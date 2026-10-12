import { inArray } from "drizzle-orm";

import { db } from "~/db";
import { summoner } from "~/db/schema";
import {
	LADDER_REGIONS,
	type LadderRegionId,
	isLadderRegionId,
} from "~/features/challenges/ladder-regions";
import { rateLimitWrapper } from "~/server/api/rate-limit-wrapper";
import { lolApi } from "~/server/external/riot/lol-api";
import { riotApi } from "~/server/external/riot/riot-api";
import {
	type Levels,
	type Regions,
	regionToRegionGroupForAccountAPI,
} from "~/server/external/riot/twisted";
import { connection } from "~/server/jobs/redis";

export { LADDER_REGIONS, isLadderRegionId };
export type { LadderRegionId };

/**
 * The three tiers Riot actually publishes a challenge leaderboard for.
 *
 * Measured on CRYSTAL (challenge 0) on 2026-10-12: `by-level/CHALLENGER|GRANDMASTER|MASTER`
 * answer 200 while every completed tier (`DIAMOND` and below) answers 400 - Riot only keeps an
 * apex ladder per challenge. Order matters: it is the order we concatenate tiers in before the
 * global re-rank, and the order the region's own positions already use.
 *
 * The SDK types its levels as a nominal `enum`, so the string ids below cannot be *assigned* to
 * `Levels` even though they are identical values - the same nominal gap `ladderRegion` bridges
 * below, and the reason these two casts exist.
 */
export const LADDER_TIERS = ["CHALLENGER", "GRANDMASTER", "MASTER"] as const;
export type LadderTier = (typeof LADDER_TIERS)[number];

const ladderTier = (tier: LadderTier): Levels => tier as unknown as Levels;

/**
 * A shard id as the SDK's `Regions`.
 *
 * `champs.ts`'s `regionToConstant` cannot do this: it only knows the *search-param* spellings
 * (`BR`, `EUNE`, `EUW`, ...) plus the shards those spellings collapse onto, so it throws
 * `Invalid region` for `BR1`, `EUN1` and `VN2` - three of the twelve shards in the list below.
 * `LADDER_REGIONS` holds platform ids, which are already the enum's own values, so this bridges
 * the nominal gap the same way `champs.ts` does for the ones it does know.
 */
const ladderRegion = (region: LadderRegionId): Regions => region as unknown as Regions;

/** `MASTER` comes back exactly full at this size, i.e. Riot truncates the tier here. */
export const LADDER_PAGE_LIMIT = 200;

/**
 * How long a fetched snapshot is served without asking Riot again.
 *
 * A day. The values drift slowly - EUW1 CRYSTAL's top moved 29,405 over a day - and a sync costs
 * 136 Riot calls, so there is nothing to gain from refreshing more often than the ranking
 * meaningfully moves.
 *
 * **This is a freshness window, not a schedule.** A refresh is still queued by a page view, so
 * "once a day" honestly means "the first look of the day refreshes it": a challenge nobody opens
 * keeps whatever snapshot it had. The scheduled sweep is what makes the cadence independent of
 * visits.
 *
 * It is also explicitly **not** an eviction: see {@link CACHE_TTL_SECONDS}.
 */
export const LADDER_FRESH_SECONDS = 24 * 60 * 60;

/**
 * How long a snapshot is kept in Redis at all.
 *
 * Deliberately far longer than {@link LADDER_FRESH_SECONDS}, because expiry is not eviction here:
 * a stale snapshot is still served (and refreshed in the background) so the board never drops to
 * the tracked fallback just because the freshness window rolled over. This is only a safety net
 * against keys for challenges nobody looks at any more.
 *
 * This is what made the board show 56 rows instead of 1,283 for ~36 s after every expiry: the key
 * vanished, the read returned nothing, and the fallback took over until the queued sync finished.
 */
export const CACHE_TTL_SECONDS = 24 * 60 * 60;

/** True when a stored snapshot is older than {@link LADDER_FRESH_SECONDS}. */
export const isLadderStale = (snapshot: { fetchedAt: string }, now = Date.now()): boolean =>
	now - new Date(snapshot.fetchedAt).getTime() > LADDER_FRESH_SECONDS * 1000;

/** One Riot call at a time, a beat apart - well inside the key's 20-per-second app burst. */
export const LADDER_FETCH_GAP_MS = 650;

/**
 * How many Account-v1 lookups run at once when naming the players Riot ranked.
 *
 * Four in flight, paced by {@link LADDER_NAME_GAP_MS}. The account endpoint's own limit is far
 * higher (`x-method-rate-limit: 1000:60`); what binds is the key's app budget.
 */
export const LADDER_NAME_CONCURRENCY = 4;

/**
 * Minimum spacing between Account-v1 calls, shared across every slot.
 *
 * Four requests per second. Nothing is gained by going faster: the key allows
 * `100:120` app-wide, so the 36-call ladder sweep and the naming slice below already spend the
 * whole two-minute budget, and the first attempt at this measured a 429 with `Retry-After: 115`
 * when it tried roughly three times this rate.
 */
export const LADDER_NAME_GAP_MS = 250;

/**
 * The most rows worth naming per sync.
 *
 * This is a budget, not a preference. Measured on CRYSTAL: the merged board is 1,283 rows but the
 * page caps at 100, of which 37 were already named from our own `Summoner` table and 63 needed an
 * Account-v1 call. Naming exactly the top 100 therefore covers every row any view can show for
 * 36 + 100 = 136 app-budget calls per two-minute window - the whole allowance, which is why the
 * cut cannot simply be raised. Rows above it keep Riot's own `Riot #` position, so they are
 * complete ladder rows without a Riot ID attached.
 */
export const LADDER_NAME_MAX_ROWS = 100;

/**
 * Extra attempts per page when Riot answers 5xx.
 *
 * Measured: `101101`'s deep `limit=200` pages answered 504 twice in one sweep while every other
 * page answered. Those pages are the difference between a complete tier and a silently short one,
 * so one retry is worth the wait; a tier that answers at all after that is recorded honestly.
 */
export const LADDER_FETCH_RETRIES = 2;

const CACHE_PREFIX = "challenge-ladder:v1";
const cacheKey = (challengeId: number) => `${CACHE_PREFIX}:${challengeId}`;

/**
 * One `by-level/{tier}` row as Riot ships it, plus the Riot ID we resolve for it.
 *
 * The leaderboard DTO itself is only `{position, puuid, value}` - it carries no name at all - so
 * `gameName`/`tagLine` are filled in from Account-v1 afterwards.
 */
export type RiotLadderEntry = {
	position: number;
	puuid: string;
	value: number;
	gameName?: string | null;
	tagLine?: string | null;
};

/** A merged row: Riot's ladder facts plus whatever the tracker already knows about the puuid. */
export type LadderRow = {
	position: number;
	puuid: string;
	value: number;
	region: LadderRegionId;
	/** Riot's own position inside that region's tier, kept for the region view. */
	regionalPosition: number;
	tier: LadderTier;
	/** Resolved from our `Summoner` row when we track the player; null otherwise. */
	gameName: string | null;
	tagLine: string | null;
	profileIconId: number | null;
	/** True when this puuid has a `Summoner` row, i.e. the profile link will resolve. */
	tracked: boolean;
};

export type LadderSnapshot = {
	challengeId: number;
	/** Apex rows we hold, all regions and all three tiers merged. */
	global: LadderRow[];
	/** The same rows restricted to one shard. */
	byRegion: Record<string, LadderRow[]>;
	/** Rows fetched per shard/tier, for the honest "what is missing" note in the UI. */
	fetched: { region: LadderRegionId; tier: LadderTier; count: number }[];
	/** Shards where at least one tier answered 200. Everything else is a silent zero. */
	regionsWithData: LadderRegionId[];
	/** A tier that came back at {@link LADDER_PAGE_LIMIT} is truncated by Riot. */
	truncatedTiers: { region: LadderRegionId; tier: LadderTier; count: number }[];
	fetchedAt: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * One shard/tier page.
 *
 * Goes through {@link rateLimitWrapper} so a 429 retries with Riot's own `RetryAfter` instead of
 * failing the page, and through `lolApi.Challenges.Leaderboards` so the URL and `Levels` typing
 * stay in the SDK. `limit` is Riot's only paging control: there is no offset, so `MASTER` is as
 * deep as its page size and no deeper.
 */
async function fetchLadderPage(
	challengeId: number,
	tier: LadderTier,
	region: Regions,
): Promise<RiotLadderEntry[]> {
	let lastError: unknown;
	for (let attempt = 0; attempt <= LADDER_FETCH_RETRIES; attempt++) {
		if (attempt > 0) await sleep(LADDER_FETCH_GAP_MS * attempt);
		try {
			const result = await rateLimitWrapper(() =>
				lolApi.Challenges.Leaderboards(challengeId, ladderTier(tier), region, {
					limit: LADDER_PAGE_LIMIT,
				}),
			);
			return result.response ?? [];
		} catch (error) {
			lastError = error;
			// Riot answers 5xx on the deep `limit=200` pages under load, and it is transient.
			// Anything else (a 400 for a tier the challenge does not rank) is terminal.
			if (!isTransientLadderError(error)) throw error;
		}
	}
	throw lastError;
}

const isTransientLadderError = (error: unknown): boolean => {
	const status = (error as { status?: number } | null)?.status;
	return typeof status === "number" && status >= 500;
};

/**
 * Resolve the Riot IDs of ladder puuids from Account-v1, in a bounded pool.
 *
 * The account API routes by *region group*, not by shard, and `LADDER_REGIONS` only spans three
 * of them (AMERICAS / EUROPE / ASIA), so one call per player covers every shard they could have
 * been ranked on. Note the group is taken from the region the puuid was ranked in - the same
 * puuid is reachable from any shard in its group, so no player is looked up twice.
 *
 * Unknown and failing puuids are simply absent from the map: a missing name is cosmetic and must
 * never fail the sync, which is why a 404 is silent and any other error is a warning.
 */
async function resolveRiotIds(
	puuids: { puuid: string; region: LadderRegionId }[],
	onResolved: (puuid: string, account: { gameName: string; tagLine: string }) => void,
): Promise<void> {
	const queue = [...puuids];
	let failures = 0;

	// A shared clock rather than a per-slot sleep: the slots race to pull from the queue, so the
	// spacing has to be a property of the calls, not of any one worker.
	let nextAllowedAt = 0;
	const throttle = async () => {
		const now = Date.now();
		const waitFor = Math.max(0, nextAllowedAt - now);
		nextAllowedAt = Math.max(now, nextAllowedAt) + LADDER_NAME_GAP_MS;
		if (waitFor > 0) await sleep(waitFor);
	};

	await Promise.all(
		Array.from({ length: LADDER_NAME_CONCURRENCY }, async () => {
			for (;;) {
				const next = queue.shift();
				if (!next) return;
				await throttle();
				try {
					const group = regionToRegionGroupForAccountAPI(ladderRegion(next.region));
					const account = (
						await rateLimitWrapper(() => riotApi.Account.getByPUUID(next.puuid, group))
					).response;
					onResolved(next.puuid, account);
				} catch (error) {
					failures++;
					const status = (error as { status?: number } | null)?.status;
					if (status !== 404) {
						console.warn(
							`[Ladder] Could not resolve a Riot ID for ${next.puuid.slice(0, 8)}…:`,
							error instanceof Error ? error.message : error,
						);
					}
				}
			}
		}),
	);

	console.log(
		`[Ladder] Named ${puuids.length - failures}/${puuids.length} ladder rows via Account-v1`,
	);
}

/**
 * Fetch every configured shard/tier page once.
 *
 * Sequential with a fixed gap rather than concurrent: the SDK is shared and the whole point of
 * this path is to stay far below the rate limit, not to finish fast. A shard that has no ladder
 * for a challenge (VN2 answers 400 for CRYSTAL, for instance) is recorded as a zero rather than
 * failing the sync, because a missing regional ladder is normal.
 */
async function fetchLadderPages(
	challengeId: number,
): Promise<{ region: LadderRegionId; tier: LadderTier; entries: RiotLadderEntry[] }[]> {
	const raw: { region: LadderRegionId; tier: LadderTier; entries: RiotLadderEntry[] }[] = [];

	for (const region of LADDER_REGIONS) {
		let regionHasData = false;

		for (const tier of LADDER_TIERS) {
			await sleep(LADDER_FETCH_GAP_MS);
			try {
				const entries = await fetchLadderPage(challengeId, tier, ladderRegion(region.id));
				raw.push({ region: region.id, tier, entries });
				if (entries.length > 0) regionHasData = true;
			} catch (error) {
				console.warn(
					`[Ladder] ${region.id} ${tier} challenge ${challengeId} unavailable:`,
					error instanceof Error ? error.message : error,
				);
				raw.push({ region: region.id, tier, entries: [] });
			}
		}

		if (!regionHasData) {
			console.log(`[Ladder] ${region.id} has no apex ladder for challenge ${challengeId}`);
		}
	}

	return raw;
}

/**
 * Fill in a Riot ID for the highest-ranked rows, in place.
 *
 * Riot's leaderboard DTO has no name, so without this the board is a list of puuids: fine as a
 * ranking, useless as a ladder.
 *
 * Only the best {@link LADDER_NAME_MAX_ROWS} by value are looked up - that is the slice any view
 * can show - and each puuid is looked up once, so a player ranked in two tiers costs one call.
 * Rows that already have a name are skipped, which is what makes a repeated pass cheap enough to
 * be worth not optimising further.
 */
async function nameLadderRows(rows: LadderRow[]): Promise<void> {
	const wanted = new Map<string, LadderRegionId>();
	for (const row of rows.slice(0, LADDER_NAME_MAX_ROWS)) {
		if (row.gameName !== null && row.tagLine !== null) continue;
		if (!wanted.has(row.puuid)) wanted.set(row.puuid, row.region);
	}
	if (wanted.size === 0) return;

	const names = new Map<string, { gameName: string; tagLine: string }>();
	await resolveRiotIds(
		[...wanted].map(([puuid, region]) => ({ puuid, region })),
		(puuid, account) => names.set(puuid, account),
	);

	for (const row of rows) {
		const account = names.get(row.puuid);
		if (!account) continue;
		row.gameName = account.gameName;
		row.tagLine = account.tagLine;
	}
}

/** Merge raw shard/tier pages into one global board, re-ranked by us, plus per-region boards. */
function buildSnapshot(
	challengeId: number,
	raw: { region: LadderRegionId; tier: LadderTier; entries: RiotLadderEntry[] }[],
): LadderSnapshot {
	const rows: LadderRow[] = [];

	for (const { region, tier, entries } of raw) {
		for (const entry of entries) {
			rows.push({
				puuid: entry.puuid,
				value: entry.value,
				position: entry.position,
				regionalPosition: entry.position,
				tier,
				region,
				gameName: entry.gameName ?? null,
				tagLine: entry.tagLine ?? null,
				profileIconId: null,
				tracked: false,
			});
		}
	}

	// Our rank is a property of the merged list, not of Riot's regional position: sort by value,
	// then by the regional position Riot already assigned, then by puuid so ties are stable.
	const collator = (a: LadderRow, b: LadderRow) =>
		b.value - a.value ||
		a.regionalPosition - b.regionalPosition ||
		a.puuid.localeCompare(b.puuid);

	const global = [...rows].sort(collator).map((row, index) => ({ ...row, position: index + 1 }));

	const byRegion: Record<string, LadderRow[]> = {};
	for (const region of LADDER_REGIONS) {
		byRegion[region.id] = global.filter((row) => row.region === region.id);
	}

	return {
		challengeId,
		global,
		byRegion,
		fetched: raw.map(({ region, tier, entries }) => ({
			region,
			tier,
			count: entries.length,
		})),
		regionsWithData: LADDER_REGIONS.map((r) => r.id).filter((id) =>
			raw.some((page) => page.region === id && page.entries.length > 0),
		),
		truncatedTiers: raw
			.filter((page) => page.entries.length >= LADDER_PAGE_LIMIT)
			.map(({ region, tier, entries }) => ({ region, tier, count: entries.length })),
		fetchedAt: new Date().toISOString(),
	};
}

/** Attach the names and icons we already store, so the board can link a row to its profile. */
export async function attachTrackedSummoners(snapshot: LadderSnapshot): Promise<LadderSnapshot> {
	const puuids = snapshot.global.map((row) => row.puuid);
	if (puuids.length === 0) return snapshot;

	const known = await db
		.select({
			puuid: summoner.puuid,
			gameName: summoner.gameName,
			tagLine: summoner.tagLine,
			profileIconId: summoner.profileIconId,
		})
		.from(summoner)
		.where(inArray(summoner.puuid, puuids));

	const byPuuid = new Map(known.map((row) => [row.puuid, row]));

	const enrich = (rows: LadderRow[]): LadderRow[] =>
		rows.map((row) => {
			const match = byPuuid.get(row.puuid);
			if (!match) return row;
			return {
				...row,
				gameName: match.gameName,
				tagLine: match.tagLine,
				profileIconId: match.profileIconId,
				tracked: true,
			};
		});

	const byRegion: Record<string, LadderRow[]> = {};
	for (const [region, rows] of Object.entries(snapshot.byRegion)) {
		byRegion[region] = enrich(rows);
	}

	return { ...snapshot, global: enrich(snapshot.global), byRegion };
}

/**
 * The cached snapshot, with our own names attached - or null on a miss.
 *
 * Deliberately never calls Riot: this is what a page view runs, so a request costs one Redis read
 * (plus one indexed `Summoner` lookup) no matter how many people load the page. Refreshing is the
 * worker's job (see {@link syncChallengeLadder}), which is why a cold cache is a miss the route
 * answers with the tracked board rather than a request that blocks for half a minute.
 */
export async function readCachedLadder(challengeId: number): Promise<LadderSnapshot | null> {
	const cached = await connection.get(cacheKey(challengeId));
	if (!cached) return null;
	return attachTrackedSummoners(JSON.parse(cached) as LadderSnapshot);
}

/**
 * Fetch every configured shard/tier and store the merged snapshot. This is the worker's path.
 *
 * On success the cache is written and the fresh snapshot returned. On failure the cache is left
 * untouched - a partial board cached for fifteen minutes would read as a real ladder with a hole
 * in it, which is the one outcome this feature must not produce.
 */
/**
 * Write a snapshot and hand it back enriched.
 *
 * Names are carried over from whatever is already stored, so a refresh does not throw away the
 * Account-v1 work of the previous one: without this, every re-sync would blank the Riot IDs for
 * the ~25 s until its naming pass caught up, because the slice is budget-bound and deliberately
 * only covers part of the board.
 */
async function publishSnapshot(
	challengeId: number,
	raw: { region: LadderRegionId; tier: LadderTier; entries: RiotLadderEntry[] }[],
): Promise<LadderSnapshot> {
	const previouslyNamed = await readCachedLadder(challengeId);
	if (previouslyNamed) {
		const known = new Map(
			previouslyNamed.global
				.filter((row) => row.gameName !== null && row.tagLine !== null)
				.map((row) => [
					row.puuid,
					{ gameName: row.gameName as string, tagLine: row.tagLine as string },
				]),
		);
		for (const page of raw) {
			for (const entry of page.entries) {
				if (entry.gameName !== undefined) continue;
				const carried = known.get(entry.puuid);
				if (carried) {
					entry.gameName = carried.gameName;
					entry.tagLine = carried.tagLine;
				}
			}
		}
	}

	const snapshot = buildSnapshot(challengeId, raw);
	await connection.set(cacheKey(challengeId), JSON.stringify(snapshot), "EX", CACHE_TTL_SECONDS);
	return attachTrackedSummoners(snapshot);
}

/**
 * Fetch every configured shard/tier page and publish the board.
 *
 * Naming is deliberately **not** part of this. It used to run inline, which meant the sync held its
 * worker slot for the naming pass (up to 100 calls at ~4/second, so ~25 s on top of the ~23 s
 * sweep) against a worker with `concurrency: 2` shared with player refreshes. The board is real
 * without names, so it is published immediately and {@link nameStoredLadder} decorates it after.
 */
export async function syncChallengeLadder(challengeId: number): Promise<LadderSnapshot> {
	return publishSnapshot(challengeId, await fetchLadderPages(challengeId));
}

/**
 * Attach Account-v1 Riot IDs to the stored snapshot, in place.
 *
 * Its own job because it is the slow half of a refresh and the board does not need it to be
 * correct - only to be named. Reads whatever is currently stored, so it does not depend on the
 * sync that triggered it still being alive, and re-writes only if it actually resolved something
 * new; a second call is a no-op rather than another 100 calls.
 */
export async function nameStoredLadder(challengeId: number): Promise<LadderSnapshot | null> {
	const snapshot = await readCachedLadder(challengeId);
	if (!snapshot) return null;

	const before = snapshot.global.filter((row) => row.gameName !== null).length;
	await nameLadderRows(snapshot.global);
	const after = snapshot.global.filter((row) => row.gameName !== null).length;

	if (after === before) return snapshot;

	await connection.set(cacheKey(challengeId), JSON.stringify(snapshot), "EX", CACHE_TTL_SECONDS);
	return snapshot;
}

/** True when a snapshot is already stored for this challenge, i.e. a refresh is not needed. */
export async function hasCachedLadder(challengeId: number): Promise<boolean> {
	return (await connection.exists(cacheKey(challengeId))) === 1;
}
