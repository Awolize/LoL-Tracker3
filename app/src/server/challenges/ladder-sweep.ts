import { asc, eq } from "drizzle-orm";

import { db } from "~/db";
import { challengesConfig } from "~/db/schema";
import { connection } from "~/server/jobs/redis";

/**
 * How many challenges a scheduled sweep refreshes.
 *
 * The budget arithmetic, which is the whole reason this is a small number:
 *
 * - one sync costs `12 shards x 3 tiers` = 36 ladder calls, plus up to
 *   `LADDER_NAME_MAX_ROWS` = 100 naming calls, so **136 calls**;
 * - Riot's app allowance for the key is `x-app-rate-limit: 100:120` - **100 calls per
 *   two minutes**, shared with player refreshes, match processing and image work;
 * - the sweep runs every {@link LADDER_SWEEP_INTERVAL_MS} (10 min) and takes
 *   {@link LADDER_SWEEP_CHALLENGES} (2) challenges: 272 calls per 10 minutes, i.e.
 *   **54 calls per two-minute window - 54% of the allowance**.
 *
 * That is deliberately not "use the whole budget": the point is to remove the board's
 * dependence on being visited without starving everything else on the key. Raising this
 * number is a budget decision, not a tuning knob.
 */
export const LADDER_SWEEP_CHALLENGES = 2;

/** How often the sweep runs. Two challenges every ten minutes covers 182 boards in ~15 h. */
export const LADDER_SWEEP_INTERVAL_MS = 10 * 60 * 1000;

/** Riot's app-wide allowance for this key, as measured from `x-app-rate-limit`. */
export const LADDER_APP_BUDGET_CALLS = 100;
export const LADDER_APP_BUDGET_WINDOW_MS = 2 * 60 * 1000;

/** Calls one `ladder-sync` costs: the 36-call sweep plus the naming slice. */
export const LADDER_SYNC_CALLS = 12 * 3 + 100;

/**
 * Which challenge a reader looked at, so the sweep can keep the busy ones fresh first.
 *
 * A Redis sorted set rather than a column: this is pure recency bookkeeping, it never needs to
 * be queried relationally, and a background sweep should not be adding a write to Postgres on
 * every page view of a public page.
 */
const VIEW_COUNT_KEY = "ladder-views";

/** Record a read of a challenge's ladder. Fire-and-forget; a lost count is not worth a 500. */
export const recordLadderView = async (challengeId: number): Promise<void> => {
	await connection.zincrby(VIEW_COUNT_KEY, 1, String(challengeId)).catch(() => undefined);
};

/**
 * When each challenge was last swept, as a Redis sorted set scored by epoch milliseconds.
 *
 * This is what makes the sweep a rotation rather than a loop over the same ids. The first version
 * of this function topped up from `ChallengesConfig` ordered by id, which looked like coverage and
 * was not: the same lowest ids came back every run, so those two boards refreshed forever and the
 * other 180 never would.
 */
const LAST_SWEPT_KEY = "ladder-swept";

/** A pool big enough that the least-swept candidates include boards with no reads at all. */
const ROTATION_POOL = 50;

/**
 * Last-swept entries as a flat `[member, score, member, score]` list.
 *
 * Its own function because ioredis types `zrange`'s variadic arguments strictly; this keeps the
 * one cast in a single place rather than at the call site.
 */
const readSweptScores = async (): Promise<string[]> =>
	(await connection.zrange(LAST_SWEPT_KEY, 0, "-1", "WITHSCORES")) as unknown as string[];

/**
 * The challenges a sweep should refresh: least-recently-swept, most-read first within that.
 *
 * Two pools, because either alone is wrong:
 *
 * - **rotation** - the {@link ROTATION_POOL} least-recently-swept challenges from the catalogue,
 *   which guarantees every board comes round instead of the same ids repeating;
 * - **reads** - the most-viewed challenges, so a board people actually open does not wait a full
 *   rotation (182 boards at 2 per run is ~15 h) to be refreshed.
 *
 * Reads win ties, so a busy board is refreshed promptly while an unvisited one still gets its turn.
 */
export const selectSweepChallenges = async (
	limit: number,
): Promise<{ selected: number[]; fromRotation: number[] }> => {
	const [allLeaderboards, mostViewed, lastSwept] = await Promise.all([
		db
			.select({ id: challengesConfig.id })
			.from(challengesConfig)
			.where(eq(challengesConfig.leaderboard, true))
			.orderBy(asc(challengesConfig.id)),
		connection.zrevrange(VIEW_COUNT_KEY, 0, ROTATION_POOL - 1).catch(() => [] as string[]),
		readSweptScores(),
	]);

	const catalogue = allLeaderboards.map((row) => row.id);
	const viewRank = new Map<number, number>();
	mostViewed.forEach((id, index) => {
		const parsed = Number.parseInt(id, 10);
		if (Number.isInteger(parsed)) viewRank.set(parsed, index);
	});

	// Last-swept time per challenge; anything absent has never been swept and sorts first.
	const sweptAt = new Map<number, number>();
	for (let i = 0; i < lastSwept.length; i += 2) {
		const id = Number.parseInt(lastSwept[i] ?? "", 10);
		const score = Number.parseInt(lastSwept[i + 1] ?? "", 10);
		if (Number.isInteger(id) && Number.isInteger(score)) sweptAt.set(id, score);
	}

	const rotation = [...catalogue]
		.sort((a, b) => (sweptAt.get(a) ?? 0) - (sweptAt.get(b) ?? 0) || a - b)
		.slice(0, ROTATION_POOL);

	const byReadPriority = (a: number, b: number) =>
		(viewRank.get(a) ?? Number.MAX_SAFE_INTEGER) -
			(viewRank.get(b) ?? Number.MAX_SAFE_INTEGER) || a - b;

	const selected: number[] = [];
	for (const id of [...rotation].sort(byReadPriority)) {
		if (selected.length >= limit) break;
		selected.push(id);
	}
	// A board someone is reading right now should not wait for the rotation to come round to it.
	for (const id of [...viewRank.keys()].sort(byReadPriority)) {
		if (selected.length >= limit) break;
		if (catalogue.includes(id) && !selected.includes(id)) selected.push(id);
	}

	return { selected, fromRotation: selected.filter((id) => rotation.includes(id)) };
};

/**
 * Record that challenges were swept, so the next sweep starts after them rather than on them.
 *
 * Called with everything the sweep queued, not just what it selected: a read-priority pick that
 * jumped the rotation still has to move to the back, or it would be re-picked on every run.
 */
export const markSwept = async (challengeIds: number[]): Promise<void> => {
	if (challengeIds.length === 0) return;
	const now = Date.now();
	await Promise.all(
		challengeIds.map((id) =>
			connection.zadd(LAST_SWEPT_KEY, String(now), String(id)).catch(() => undefined),
		),
	);
};

/**
 * Calls the sweep spends per two-minute window at its configured rate.
 *
 * Exported so the arithmetic in {@link LADDER_SWEEP_CHALLENGES}'s doc is computed rather than
 * re-derived by hand, and so a change to either constant cannot leave that comment lying.
 */
export const sweepCallsPerWindow = (
	challenges = LADDER_SWEEP_CHALLENGES,
	intervalMs = LADDER_SWEEP_INTERVAL_MS,
): number => (challenges * LADDER_SYNC_CALLS * LADDER_APP_BUDGET_WINDOW_MS) / intervalMs;
