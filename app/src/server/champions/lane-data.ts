/**
 * Derives a champion's lane from recorded matches instead of the hand-maintained
 * `roles.json`.
 *
 * `MatchParticipant` is the source: it is a projection of `MatchInfo.participants`,
 * so anything missing from it can be rebuilt from the jsonb.
 *
 * Two maps are returned, and the caller prefers them in this order:
 *
 *   1. `bySummoner` — how *this* player actually plays each champion, restricted to the
 *      last `PATCH_WINDOW` patches and to champions they have played
 *      `MIN_SUMMONER_GAMES` times or more. This is why a champion can sit in a different
 *      lane for different profiles.
 *   2. `global`     — how that champion is played across every recorded match, used
 *      whenever the personal sample is too thin. A typical summoner has only ~1.2
 *      matches stored (rows exist for every participant of a match, but history is
 *      only backfilled for the tracked player), so in practice this is the tier most
 *      profiles resolve through.
 *
 * The window is anchored to the patch Data Dragon reports (`getDataDragonVersion`), capped
 * so it never runs ahead of the matches actually recorded — see `currentPatch`. A single
 * patch is too narrow to be useful: on 16.20 there were only 4 matches, so no summoner
 * champion pair reached the minimum and every champion fell through to the global lane.
 */
import { and, count, eq, inArray, sql, type SQL } from "drizzle-orm";

import { db } from "~/db";
import { matchInfo, matchParticipant } from "~/db/schema";
import { getDataDragonVersion } from "~/server/api/get-datadragon-version";

/** Match-V5 `teamPosition` -> the lane names the UI groups by. */
const LANES = ["Top", "Jungle", "Mid", "Bottom", "Support"] as const;

export type Lane = (typeof LANES)[number];

const POSITION_TO_LANE: Record<string, Lane> = {
	TOP: "Top",
	JUNGLE: "Jungle",
	MIDDLE: "Mid",
	BOTTOM: "Bottom",
	UTILITY: "Support",
};

/**
 * `teamPosition` values the query should count. `individualPosition` is deliberately
 * not used: it is `"Invalid"` for over a quarter of the stored rows.
 */
const COUNTED_POSITIONS = Object.keys(POSITION_TO_LANE);

/**
 * Games a summoner needs on one champion, within the patch window, before their own lane
 * outranks the global one. Keeps a single off-role game from redefining a champion.
 */
export const MIN_SUMMONER_GAMES = 5;

/**
 * How many of the newest patches a summoner's own lane is drawn from. One patch is too
 * narrow: coverage is thin for the first days after a patch drops, and the personal tier
 * would silently switch off for every profile until enough games accumulate.
 */
export const PATCH_WINDOW = 2;

/**
 * How long the global lane map is reused before being recomputed. It only shifts as
 * enough new matches accumulate, so recomputing it on every profile view is wasted work.
 */
const GLOBAL_CACHE_MS = 15 * 60 * 1000;

/**
 * Kept on `globalThis` so dev HMR does not drop the cache on every reload, matching the
 * S3 client in `~/server/external/s3`.
 */
const globalForLanes = globalThis as unknown as {
	championLanes?: { at: number; lanes: Map<number, Lane> };
};

/**
 * The patch Data Dragon is currently serving — "16.20.1" -> `"16.20"` — or `undefined` when
 * the version carries no patch component, in which case the data decides the window alone.
 *
 * Resolved live rather than read from `ChampionDetails.version`, because that column is only
 * as fresh as the last `updateChampionDetails()` sync while Data Dragon moves the moment a
 * patch ships. That gap matters here: a stale version would pin the window to a patch the
 * game has already left even when the newer patch has matches. `getDataDragonVersion` falls
 * back to the stored version when Data Dragon is unreachable, and is cached for 15 minutes.
 */
const dataDragonPatch = async (): Promise<string | undefined> => {
	const parts = (await getDataDragonVersion()).split(".");
	if (!parts[0] || !parts[1]) return undefined;
	return `${parts[0]}.${parts[1]}`;
};

/** One `(champion, lane) -> games` row as the builder returns it. */
type LaneCountRow = {
	championId: number;
	position: string | null;
	games: number;
};

const laneCountsByChampion = (rows: LaneCountRow[]) => {
	const byChampion = new Map<number, Map<Lane, number>>();

	for (const row of rows) {
		const lane = row.position === null ? undefined : POSITION_TO_LANE[row.position];
		if (!lane) continue;

		const counts = byChampion.get(row.championId) ?? new Map<Lane, number>();
		counts.set(lane, row.games);
		byChampion.set(row.championId, counts);
	}

	return byChampion;
};

const mostPlayed = (counts: Map<Lane, number>): Lane | undefined =>
	// Ties break on the ROLES order, so the result is stable across calls.
	LANES.reduce<Lane | undefined>((best, lane) => {
		const games = counts.get(lane) ?? 0;
		if (games === 0) return best;
		if (!best) return lane;
		return games > (counts.get(best) ?? 0) ? lane : best;
	}, undefined);

/**
 * Patch of a `gameVersion` ("16.19.823.722" -> "16.19"). Derived from the first two
 * segments rather than compared as text: lexicographically "16.9" sorts above "16.19",
 * so picking the latest patch with a plain `ORDER BY` would select the older one.
 */
const patchOf = (column: SQL) =>
	sql`split_part(${column}, '.', 1) || '.' || split_part(${column}, '.', 2)`;

/**
 * The patch window to count a summoner's games over: the newest `PATCH_WINDOW` patches,
 * taken from the data itself. Data Dragon's patch is only allowed to *cap* that window —
 * when it has already moved on to a patch with no recorded matches yet, the newest patches
 * that do have matches are used instead, so a patch transition does not silently disable
 * the per-summoner tier. When the version carries no patch the data decides on its own.
 *
 * Patches are ranked by their newest match, and read as text, so the two-segment form is
 * what makes the comparison ordered: "16.19" < "16.20" where the raw version strings
 * "16.19.823.722" and "16.20.1" would not sort the same way.
 */
const patchWindow = (dataDragon: string | undefined) => sql`(
	SELECT ${patchOf(sql`"gameVersion"`)}
	FROM "MatchInfo"
	WHERE "gameVersion" IS NOT NULL AND "gameVersion" <> ''
		AND (${dataDragon ?? null}::text IS NULL
			OR ${patchOf(sql`"gameVersion"`)} <= ${dataDragon ?? null}::text)
	GROUP BY 1
	ORDER BY max("gameStartTimestamp") DESC
	LIMIT ${PATCH_WINDOW}
)`;

/** Games per champion per lane across every recorded match. */
const globalLaneRows = async () =>
	db
		.select({
			championId: matchParticipant.championId,
			position: matchParticipant.teamPosition,
			games: count().mapWith(Number),
		})
		.from(matchParticipant)
		// No join to MatchInfo: the global lane is a property of the champion, not of a match,
		// and joining in 37k matches to aggregate 288k participant rows roughly doubles the cost
		// (measured 48ms -> 93ms).
		.where(inArray(matchParticipant.teamPosition, COUNTED_POSITIONS))
		.groupBy(matchParticipant.championId, matchParticipant.teamPosition);

/** Games per champion per lane for one summoner, within the patch window. */
const summonerLaneRows = async (puuid: string, window: SQL) =>
	db
		.select({
			championId: matchParticipant.championId,
			position: matchParticipant.teamPosition,
			games: count().mapWith(Number),
		})
		.from(matchParticipant)
		.innerJoin(matchInfo, eq(matchInfo.gameId, matchParticipant.matchId))
		.where(
			and(
				eq(matchParticipant.puuid, puuid),
				inArray(matchParticipant.teamPosition, COUNTED_POSITIONS),
				inArray(patchOf(sql`${matchInfo.gameVersion}`), window),
			),
		)
		.groupBy(matchParticipant.championId, matchParticipant.teamPosition);

/** Lanes for one summoner's games in the patch window, or an empty map. */
export const summonerLaneCounts = async (puuid: string): Promise<Map<number, Lane>> => {
	const rows = await summonerLaneRows(puuid, patchWindow(await dataDragonPatch()));

	const lanes = new Map<number, Lane>();

	for (const [championId, counts] of laneCountsByChampion(rows)) {
		const total = [...counts.values()].reduce((sum, games) => sum + games, 0);
		if (total < MIN_SUMMONER_GAMES) continue;

		const lane = mostPlayed(counts);
		if (lane) lanes.set(championId, lane);
	}

	return lanes;
};

/** Every champion's most-played lane across all recorded matches. */
export const globalLaneCounts = async (): Promise<Map<number, Lane>> => {
	const cached = globalForLanes.championLanes;
	if (cached && Date.now() - cached.at < GLOBAL_CACHE_MS) return cached.lanes;

	const lanes = await computeGlobalLaneCounts();
	globalForLanes.championLanes = { at: Date.now(), lanes };

	return lanes;
};

const computeGlobalLaneCounts = async (): Promise<Map<number, Lane>> => {
	const rows = await globalLaneRows();

	const lanes = new Map<number, Lane>();

	for (const [championId, counts] of laneCountsByChampion(rows)) {
		const lane = mostPlayed(counts);
		if (lane) lanes.set(championId, lane);
	}

	return lanes;
};
