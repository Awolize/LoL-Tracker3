/**
 * SQL access to Match-V5 participant data.
 *
 * `MatchInfo.participants` (jsonb) remains the source of truth. `MatchParticipant`
 * is a typed, indexed projection of the fields we query; everything here rebuilds
 * from the jsonb, so the projection can be dropped and re-derived at any time and
 * is never required for the raw data to be correct.
 */
import { and, count, desc, eq, gte, inArray, notInArray, type SQL, sql } from "drizzle-orm";

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

// There is deliberately no "repair this one user" function here. The only record of which
// matches a user played is `MatchParticipant` itself, so such a repair has to join the very
// projection it is trying to fill — it can only ever re-insert rows that already exist. A
// previous `projectUserMatchParticipants` did exactly that behind an "if the user has no
// projected rows" guard, which is precisely the case where its own join returns nothing, so it
// never inserted a row. A user with no projected rows therefore has no readable history until a
// rebuild by match id (see `projectMatchesParticipants` above, driven by
// `scripts/backfill-match-participants.ts`).

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

/**
 * The queues this user actually has matches in, so the match-history filter only offers options
 * that can return something — a global queue list would show a lot of dead ends for most profiles.
 */
export const getUserQueueIds = async (puuid: string): Promise<number[]> => {
	const rows = await db
		.selectDistinct({ queueId: matchInfo.queueId })
		.from(matchParticipant)
		.innerJoin(matchInfo, eq(matchParticipant.matchId, matchInfo.gameId))
		.where(eq(matchParticipant.puuid, puuid));

	return rows.map((row) => row.queueId);
};

/** A champion the user has played, for the match-history champion filter. */
export type UserChampionOption = {
	championId: number;
	championName: string;
	games: number;
};

/**
 * The user's champions, most-played first.
 *
 * `MatchParticipant` carries both id and name, so this needs no join to `ChampionDetails` — and it
 * stays correct for a champion Riot has since renamed.
 */
export const getUserChampions = async (puuid: string): Promise<UserChampionOption[]> => {
	const rows = await db
		.select({
			championId: matchParticipant.championId,
			championName: matchParticipant.championName,
			games: count().mapWith(Number),
		})
		.from(matchParticipant)
		.where(eq(matchParticipant.puuid, puuid))
		.groupBy(matchParticipant.championId, matchParticipant.championName)
		.orderBy(desc(count()));

	return rows;
};
