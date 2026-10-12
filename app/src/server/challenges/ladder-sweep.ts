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
 * The challenges a sweep should refresh, most-read first.
 *
 * "Most-read" is the priority the parent asked for and it also happens to be the honest one: a
 * board nobody opens is a board nobody is looking at a stale number on. Challenges never read are
 * still eligible via the `challengesConfig` fallback, so the sweep eventually covers the whole
 * catalogue rather than only what has been visited.
 */
export const selectSweepChallenges = async (limit: number): Promise<number[]> => {
	const [viewed, allLeaderboards] = await Promise.all([
		connection.zrevrange(VIEW_COUNT_KEY, 0, limit - 1).catch(() => [] as string[]),
		db
			.select({ id: challengesConfig.id })
			.from(challengesConfig)
			.where(eq(challengesConfig.leaderboard, true))
			.orderBy(asc(challengesConfig.id)),
	]);

	const selected = viewed
		.map((id) => Number.parseInt(id, 10))
		.filter((id) => Number.isInteger(id));

	if (selected.length >= limit) return selected.slice(0, limit);

	// Top up from the catalogue so an unvisited board still gets refreshed eventually; the
	// ordering is stable, so repeated sweeps walk through the catalogue rather than retrying the
	// same two ids.
	const fallback = allLeaderboards
		.map((row) => row.id)
		.filter((id) => !selected.includes(id))
		.slice(0, limit - selected.length);

	return [...selected, ...fallback];
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
