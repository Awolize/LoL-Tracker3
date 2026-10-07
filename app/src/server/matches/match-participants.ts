/**
 * SQL access to Match-V5 participant data.
 *
 * `MatchInfo.participants` (jsonb) remains the source of truth. `MatchParticipant`
 * is a typed, indexed projection of the fields we query; everything here rebuilds
 * from the jsonb, so the projection can be dropped and re-derived at any time and
 * is never required for the raw data to be correct.
 */
import { and, count, eq, gte, inArray, notInArray, type SQL, sql } from "drizzle-orm";

import { db } from "~/db";
import { matchInfo, matchParticipant, matchSummoners } from "~/db/schema";
import type { MatchFilterOptions } from "~/server/matches/get-matches";

const INSERT_COLUMNS = sql`(
	"matchId", "puuid", "participantId", "teamId", "championId", "championName", "win",
	"teamPosition", "individualPosition", "placement", "kills", "deaths", "assists",
	"goldEarned", "totalMinionsKilled", "neutralMinionsKilled", "visionScore", "champLevel",
	"timePlayed", "totalDamageDealtToChampions",
	"item0", "item1", "item2", "item3", "item4", "item5", "item6",
	"summoner1Id", "summoner2Id"
)`;

/**
 * `SELECT` that expands `MatchInfo.participants` into MatchParticipant rows.
 * `from` must alias MatchInfo as `mi` and the unnested element as `p`.
 */
const projectionSelect = (from: SQL, where?: SQL) => sql`
	SELECT
		mi."gameId",
		p->>'puuid',
		(p->>'participantId')::int,
		(p->>'teamId')::int,
		(p->>'championId')::int,
		p->>'championName',
		(p->>'win')::boolean,
		nullif(p->>'teamPosition', ''),
		nullif(p->>'individualPosition', ''),
		(p->>'placement')::int,
		(p->>'kills')::int,
		(p->>'deaths')::int,
		(p->>'assists')::int,
		(p->>'goldEarned')::int,
		(p->>'totalMinionsKilled')::int,
		(p->>'neutralMinionsKilled')::int,
		(p->>'visionScore')::int,
		(p->>'champLevel')::int,
		(p->>'timePlayed')::int,
		(p->>'totalDamageDealtToChampions')::int,
		(p->>'item0')::int, (p->>'item1')::int, (p->>'item2')::int, (p->>'item3')::int,
		(p->>'item4')::int, (p->>'item5')::int, (p->>'item6')::int,
		(p->>'summoner1Id')::int, (p->>'summoner2Id')::int
	FROM ${from}
	${where ? sql`WHERE ${where}` : sql``}
`;

/** Project one user's participant rows for every match they appear in. */
export const projectUserMatchParticipants = async (puuid: string): Promise<void> => {
	await db.execute(sql`
		INSERT INTO "MatchParticipant" ${INSERT_COLUMNS}
		${projectionSelect(
			sql`"MatchInfo" mi
				JOIN "_MatchSummoners" ms ON ms."A" = mi."gameId" AND ms."B" = ${puuid}
				CROSS JOIN LATERAL jsonb_array_elements(mi."participants") AS p`,
			sql`p->>'puuid' = ${puuid}`,
		)}
		ON CONFLICT DO NOTHING
	`);
};

/**
 * Project every participant of the given matches. Used by the backfill script
 * (and safe to call repeatedly — it is idempotent).
 */
export const projectMatchesParticipants = async (gameIds: string[]): Promise<void> => {
	if (gameIds.length === 0) return;
	await db.execute(sql`
		INSERT INTO "MatchParticipant" ${INSERT_COLUMNS}
		${projectionSelect(
			sql`"MatchInfo" mi
				CROSS JOIN LATERAL jsonb_array_elements(mi."participants") AS p
				JOIN "Summoner" s ON s."puuid" = p->>'puuid'`,
			sql`mi."gameId" IN (${sql.join(
				gameIds.map((id) => sql`${id}`),
				sql`, `,
			)})`,
		)}
		ON CONFLICT DO NOTHING
	`);
};

/**
 * Cheap guard: if the user has fewer projected participant rows than matches,
 * project the missing history from the jsonb before querying. Keeps the feature
 * correct even if the one-off backfill has not been run yet.
 */
export const ensureUserParticipantsProjected = async (puuid: string): Promise<void> => {
	const [[matchCount], [projectedCount]] = await Promise.all([
		db.select({ value: count() }).from(matchSummoners).where(eq(matchSummoners.b, puuid)),
		db
			.select({ value: count() })
			.from(matchParticipant)
			.where(eq(matchParticipant.puuid, puuid)),
	]);

	if ((matchCount?.value ?? 0) > (projectedCount?.value ?? 0)) {
		await projectUserMatchParticipants(puuid);
	}
};

/** Distinct champions the user played in matches/participations matching the filters. */
export const getChampionIdsForUser = async (
	puuid: string,
	filters: MatchFilterOptions,
	participantCondition?: SQL,
): Promise<number[]> => {
	const conditions: SQL[] = [eq(matchParticipant.puuid, puuid)];

	if (filters.mapIds?.length) conditions.push(inArray(matchInfo.mapId, filters.mapIds));
	if (filters.queueIdsNotIn?.length) {
		conditions.push(notInArray(matchInfo.queueId, filters.queueIdsNotIn));
	}
	if (filters.gameMode) conditions.push(eq(matchInfo.gameMode, filters.gameMode));
	if (filters.gameType) conditions.push(eq(matchInfo.gameType, filters.gameType));
	if (filters.gameStartTimestampGte) {
		conditions.push(gte(matchInfo.gameStartTimestamp, filters.gameStartTimestampGte));
	}
	if (participantCondition) conditions.push(participantCondition);

	const rows = await db
		.selectDistinct({ championId: matchParticipant.championId })
		.from(matchParticipant)
		.innerJoin(matchInfo, eq(matchParticipant.matchId, matchInfo.gameId))
		.where(and(...conditions));

	return rows.map((row) => row.championId);
};
