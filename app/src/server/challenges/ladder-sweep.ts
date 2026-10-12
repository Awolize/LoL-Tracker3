import { isLadderStale } from "~/server/challenges/riot-challenge-ladder";
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
 * When a reader last opened each board, scored by epoch milliseconds.
 *
 * A timestamp, not a counter. The first version kept a cumulative read count, which can only ever
 * grow and so cannot answer the only question the sweep needs asked: "has anyone wanted this in the
 * last week?" A board read a thousand times a month ago must go dormant exactly like one read once.
 *
 * Redis rather than a column for the same reason as before: this is recency bookkeeping, and a
 * public page view should not be adding a write to Postgres.
 */
const LAST_READ_KEY = "ladder-read-at";

/**
 * How long a single read keeps a board on the refresh schedule.
 *
 * After this the board is no longer wanted: its snapshot is allowed to expire (24 h) and the sweep
 * stops refreshing it, so a dormant board costs nothing at all. Its first visitor after that pays a
 * cold sync (~33 s) and re-admits it for another week.
 */
export const LADDER_WANTED_SECONDS = 7 * 24 * 60 * 60;

/** Record that a reader wants this board, for {@link LADDER_WANTED_SECONDS}. */
export const recordLadderRead = async (challengeId: number): Promise<void> => {
	await connection
		.zadd(LAST_READ_KEY, String(Date.now()), String(challengeId))
		.catch(() => undefined);
};

/** Challenge ids read within {@link LADDER_WANTED_SECONDS}, most recent first. */
export const wantedChallenges = async (limit: number): Promise<number[]> => {
	const cutoff = Date.now() - LADDER_WANTED_SECONDS * 1000;
	const members = await connection
		.zrevrangebyscore(LAST_READ_KEY, "+inf", String(cutoff))
		.catch(() => [] as string[]);
	return members
		.map((id) => Number.parseInt(id, 10))
		.filter((id) => Number.isInteger(id))
		.slice(0, limit);
};

/** How many wanted boards each sweep inspects before the freshness filter narrows it to a batch. */
const WANTED_POOL = 50;

/**
 * The challenges a sweep should actually refresh.
 *
 * Two filters, and both are load-bearing:
 *
 * 1. **Wanted** - read within {@link LADDER_WANTED_SECONDS}. There is deliberately no catalogue
 *    top-up any more: pre-warming every board cost 182 x 136 = 24,752 calls, about eight hours of
 *    the key's whole allowance, to keep 178 boards nobody had ever opened current. Effort follows
 *    demand now, so a never-visited board stays cold until its first visitor instead.
 * 2. **Stale** - its stored snapshot is past `LADDER_FRESH_SECONDS`, or missing. Without this the
 *    sweep re-fetched the eligible set every rotation: with only a handful of wanted boards, a
 *    2-per-10-minute sweep would re-pull each one every ~20 minutes against a 24-hour freshness
 *    window, spending the budget re-reading data the app already treats as current.
 *
 * Both are checked here rather than inside `ladder-sync`, so an already-fresh board is never
 * enqueued at all - the sweep cannot spend budget re-reading data the app already treats as
 * current, and it cannot mark a fresh board as needing attention either.
 */
export const selectSweepChallenges = async (
	limit: number,
): Promise<{ selected: number[]; wanted: number[] }> => {
	const wanted = await wantedChallenges(limit * WANTED_POOL);
	if (wanted.length === 0) return { selected: [], wanted: [] };

	const staleFlags = await Promise.all(wanted.map((id) => isStoredLadderStale(id)));
	const stale = wanted.filter((_, index) => staleFlags[index]);

	return { selected: stale.slice(0, limit), wanted };
};

/**
 * True when a board has no snapshot, or one past `LADDER_FRESH_SECONDS`.
 *
 * Reads the snapshot directly rather than going through `readCachedLadder`, because that enriches
 * rows from `Summoner` and only `fetchedAt` is needed here.
 */
const isStoredLadderStale = async (challengeId: number): Promise<boolean> => {
	const raw = await connection.get(`challenge-ladder:v1:${challengeId}`).catch(() => null);
	if (!raw) return true;
	try {
		return isLadderStale(JSON.parse(raw) as { fetchedAt: string });
	} catch {
		// Unparseable is treated as stale so the sweep repairs it rather than skipping forever.
		return true;
	}
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
