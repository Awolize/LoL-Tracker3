import { and, desc, eq, exists, gte, inArray, lt, notInArray, or, sql } from "drizzle-orm";

import { db } from "~/db";
import { match, matchInfo, matchParticipant } from "~/db/schema";
import type { Summoner } from "~/features/shared/types";

export type MatchFilterOptions = {
	mapIds?: number[];
	queueIdsNotIn?: number[];
	/** Restrict to these queues. Combines with `queueIdsNotIn` rather than replacing it. */
	queueIds?: number[];
	/** Restrict to matches where this user played this champion. */
	championId?: number;
	/** Restrict to matches this user won (`true`) or lost (`false`). */
	win?: boolean;
	gameMode?: string;
	gameType?: string;
	gameStartTimestampGte?: Date;
	/**
	 * Keyset cursor: only matches strictly older than this. Pass `gameIdLt` as well to break ties,
	 * so a page boundary is never duplicated or skipped when a match lands between two requests.
	 */
	gameStartTimestampLt?: Date;
	gameIdLt?: string;
	take?: number;
};

export async function getMatches(
	user: Summoner,
	options: MatchFilterOptions = {},
	take = options.take || 9999999,
) {
	const {
		mapIds,
		queueIdsNotIn,
		queueIds,
		championId,
		win,
		gameMode,
		gameType,
		gameStartTimestampGte,
		gameStartTimestampLt,
		gameIdLt,
	} = options;

	// 1. Build the WHERE conditions dynamically
	const filters = [];

	// OPTIONAL FILTERS: Applied to matchInfo
	if (mapIds?.length) {
		filters.push(inArray(matchInfo.mapId, mapIds));
	}
	if (queueIdsNotIn?.length) {
		filters.push(notInArray(matchInfo.queueId, queueIdsNotIn));
	}
	if (queueIds?.length) {
		filters.push(inArray(matchInfo.queueId, queueIds));
	}
	if (gameMode) {
		filters.push(eq(matchInfo.gameMode, gameMode));
	}
	if (gameType) {
		filters.push(eq(matchInfo.gameType, gameType));
	}
	if (gameStartTimestampGte) {
		filters.push(gte(matchInfo.gameStartTimestamp, gameStartTimestampGte));
	}

	// Keyset cursor. A bare `timestamp < cursor` would skip or repeat the rows that share a
	// timestamp at the page boundary, so the tie is broken on the game id, which is unique.
	if (gameStartTimestampLt && gameIdLt) {
		const keyset = or(
			lt(matchInfo.gameStartTimestamp, gameStartTimestampLt),
			and(eq(matchInfo.gameStartTimestamp, gameStartTimestampLt), lt(match.gameId, gameIdLt)),
		);
		if (keyset) filters.push(keyset);
	} else if (gameStartTimestampLt) {
		filters.push(lt(matchInfo.gameStartTimestamp, gameStartTimestampLt));
	}

	// 2. STEP ONE: Get the Game IDs
	// This executes the logic in SQL (joins, where, sort, limit)
	//
	// CORE FILTER: the user must be a participant of the match. `MatchParticipant` is the
	// match <-> summoner link (unique (matchId, puuid)), so this replaces the old join to
	// the dropped `_MatchSummoners` table — as `EXISTS`, so no join can duplicate a match.
	//
	// The player count comes from `MatchInfo.participants`, matching what the match view
	// already renders from: the projection can be short a few rows (186 matches hold fewer
	// participant rows than the jsonb, from participant upserts that failed silently).
	const validMatches = await db
		.select({
			gameId: match.gameId,
			gameStartTimestamp: matchInfo.gameStartTimestamp,
			playerCount: sql<number>`jsonb_array_length(${matchInfo.participants})`.mapWith(Number),
		})
		.from(match)
		// Join MatchInfo to filter by map/queue and sort by time
		.innerJoin(matchInfo, eq(match.gameId, matchInfo.gameId))
		.where(
			and(
				...filters,
				exists(
					db
						.select({ one: sql`1` })
						.from(matchParticipant)
						.where(
							and(
								eq(matchParticipant.matchId, match.gameId),
								eq(matchParticipant.puuid, user.puuid),
								// Champion and result describe *this user's* participation, so they
								// belong in the same EXISTS rather than a second one.
								championId === undefined
									? undefined
									: eq(matchParticipant.championId, championId),
								win === undefined ? undefined : eq(matchParticipant.win, win),
							),
						),
				),
			),
		)
		// Tie-broken on the game id so the keyset cursor above is a total order.
		.orderBy(desc(matchInfo.gameStartTimestamp), desc(match.gameId))
		.limit(take);

	// If no matches found, return early
	if (validMatches.length === 0) {
		return [];
	}

	const gameIds = validMatches.map((m) => m.gameId);

	// 3. STEP TWO: Hydrate the data
	// Fetch the full nested objects only for the specific IDs we found
	const fullMatches = await db.query.match.findMany({
		where: inArray(match.gameId, gameIds),
		with: {
			matchInfos: true,
		},
	});

	// 4. Sort again in Memory
	// (SQL 'IN' clauses do not preserve order, so we re-sort the small result set)
	fullMatches.sort((a, b) => {
		const aTime = a.matchInfos?.[0]?.gameStartTimestamp?.getTime() || 0;
		const bTime = b.matchInfos?.[0]?.gameStartTimestamp?.getTime() || 0;
		// Same total order as the SQL above, so paging stays consistent with the page it follows.
		return bTime - aTime || (a.gameId < b.gameId ? 1 : a.gameId > b.gameId ? -1 : 0);
	});

	// `playerCount` is a scalar SQL aggregate, so it rides alongside the hydrated rows
	// rather than being a column on `match`.
	const playerCountByGameId = new Map(validMatches.map((m) => [m.gameId, m.playerCount]));

	return fullMatches.map((row) => ({
		...row,
		playerCount: playerCountByGameId.get(row.gameId) ?? 0,
	}));
}

// Arena Map (https://static.developer.riotgames.com/docs/lol/maps.json)
export const ARENA_MATCH_FILTERS: MatchFilterOptions = {
	mapIds: [30],
	gameMode: "CHERRY",
	gameType: "MATCHED_GAME",
	gameStartTimestampGte: new Date("2024-01-01T00:00:00Z"),
};

// Summoner's Rift Map (https://static.developer.riotgames.com/docs/lol/maps.json)
// Stable queueIds: 2,4,6,14,420,430,440,490,700
export const SR_MATCH_FILTERS: MatchFilterOptions = {
	mapIds: [1, 2, 11],
	queueIdsNotIn: [800, 810, 820, 830, 840, 850, 860, 870, 880, 890], // Co-op vs AI
	gameMode: "CLASSIC",
	gameType: "MATCHED_GAME",
	gameStartTimestampGte: new Date("2023-01-01T00:00:00Z"),
};

export async function getArenaMatches(user: Summoner) {
	return getMatches(user, ARENA_MATCH_FILTERS);
}

export async function getSRMatches(user: Summoner) {
	return getMatches(user, SR_MATCH_FILTERS);
}
