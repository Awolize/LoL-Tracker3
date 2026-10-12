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
import type { Levels, Regions } from "~/server/external/riot/twisted";
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
 * How long a fetched snapshot is served before Riot is asked again.
 *
 * The values drift slowly (EUW1 CRYSTAL's top moved 29,405 over a day) and every page view reads
 * the snapshot, so a long TTL is what keeps the Riot budget flat. Fifteen minutes is the tuning
 * knob; it is not a correctness boundary.
 */
export const CACHE_TTL_SECONDS = 15 * 60;

/** One Riot call at a time, a beat apart - well inside the key's 20-per-second app burst. */
export const LADDER_FETCH_GAP_MS = 650;

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

/** One `by-level/{tier}` row, exactly as Riot ships it. */
export type RiotLadderEntry = {
	position: number;
	puuid: string;
	value: number;
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
 * Fetch every configured shard/tier once and build the merged snapshot.
 *
 * Sequential with a fixed gap rather than concurrent: the SDK is shared and the whole point of
 * this path is to stay far below the rate limit, not to finish fast. A shard that has no ladder
 * for a challenge (VN2 answers 400 for CRYSTAL, for instance) is recorded as a zero rather than
 * failing the sync, because a missing regional ladder is normal.
 */
export async function fetchLadderSnapshot(challengeId: number): Promise<LadderSnapshot> {
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

	return buildSnapshot(challengeId, raw);
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
				gameName: null,
				tagLine: null,
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
export async function syncChallengeLadder(challengeId: number): Promise<LadderSnapshot> {
	const snapshot = await fetchLadderSnapshot(challengeId);
	await connection.set(cacheKey(challengeId), JSON.stringify(snapshot), "EX", CACHE_TTL_SECONDS);
	return attachTrackedSummoners(snapshot);
}

/** True when a snapshot is already stored for this challenge, i.e. a refresh is not needed. */
export async function hasCachedLadder(challengeId: number): Promise<boolean> {
	return (await connection.exists(cacheKey(challengeId))) === 1;
}
