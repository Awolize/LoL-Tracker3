/**
 * SQL access to Match-V5 participant data.
 *
 * `MatchInfo.participants` (jsonb) remains the source of truth. `MatchParticipant`
 * is a typed, indexed projection of the fields we query; everything here rebuilds
 * from the jsonb, so the projection can be dropped and re-derived at any time and
 * is never required for the raw data to be correct.
 */
import { and, eq, gte, inArray, notInArray, type SQL, sql } from "drizzle-orm";

import { db } from "~/db";
import { matchInfo, matchParticipant } from "~/db/schema";
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
				JOIN "MatchParticipant" ms ON ms."matchId" = mi."gameId" AND ms.puuid = ${puuid}
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
 * Cheap guard: if the user appears in no projected participant row at all, project their
 * history from the jsonb before querying. That is what repairs a user whose matches were
 * written before the write path projected participants, or before the one-off backfill
 * ran; for everyone else it is one indexed lookup.
 *
 * Presence, not a row count, is the right signal now that `MatchParticipant` is the write
 * path as well as the projection: participants are inserted in the same transaction as
 * their match, so a user either has rows or has no history to read.
 */
export const ensureUserParticipantsProjected = async (puuid: string): Promise<void> => {
	const [anyRow] = await db
		.select({ matchId: matchParticipant.matchId })
		.from(matchParticipant)
		.where(eq(matchParticipant.puuid, puuid))
		.limit(1);

	if (!anyRow) {
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
