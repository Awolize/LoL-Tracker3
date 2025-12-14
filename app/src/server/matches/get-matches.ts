import { and, desc, eq, gte, inArray, notInArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { match, matchInfo, matchSummoners } from "@/db/schema";
import type { Summoner } from "@/features/shared/types";

export async function getMatches(
	user: Summoner,
	options: {
		mapIds?: number[];
		queueIdsNotIn?: number[];
		gameMode?: string;
		gameType?: string;
		gameStartTimestampGte?: Date;
		take?: number;
	} = {},
	take = options.take || 9999999,
) {
	const { mapIds, queueIdsNotIn, gameMode, gameType, gameStartTimestampGte } =
		options;

	// 1. Build the WHERE conditions dynamically
	const filters = [];

	// CORE FILTER: Join logic (User must be in the match)
	// Based on your schema: matchSummoners.a = gameId, matchSummoners.b = puuid
	filters.push(eq(matchSummoners.b, user.puuid));

	// OPTIONAL FILTERS: Applied to matchInfo
	if (mapIds?.length) {
		filters.push(inArray(matchInfo.mapId, mapIds));
	}
	if (queueIdsNotIn?.length) {
		filters.push(notInArray(matchInfo.queueId, queueIdsNotIn));
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

	// 2. STEP ONE: Get the Game IDs
	// This executes the logic in SQL (joins, where, sort, limit)
	const validMatches = await db
		.select({
			gameId: match.gameId,
			gameStartTimestamp: matchInfo.gameStartTimestamp,
		})
		.from(match)
		// Join MatchInfo to filter by map/queue and sort by time
		.innerJoin(matchInfo, eq(match.gameId, matchInfo.gameId))
		// Join MatchSummoners to filter by specific user participation
		.innerJoin(matchSummoners, eq(match.gameId, matchSummoners.a))
		.where(and(...filters))
		.orderBy(desc(matchInfo.gameStartTimestamp))
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
			matchSummoners: {
				with: {
					summoner: true,
				},
			},
		},
	});

	// 4. Sort again in Memory
	// (SQL 'IN' clauses do not preserve order, so we re-sort the small result set)
	fullMatches.sort((a, b) => {
		const aTime = a.matchInfos?.[0]?.gameStartTimestamp?.getTime() || 0;
		const bTime = b.matchInfos?.[0]?.gameStartTimestamp?.getTime() || 0;
		return bTime - aTime;
	});

	return fullMatches;
}

// ... your helper functions (getArenaMatches, getSRMatches) stay exactly the same

// Arena Map (https://static.developer.riotgames.com/docs/lol/maps.json)
export async function getArenaMatches(user: Summoner) {
	return getMatches(user, {
		mapIds: [30],
		gameMode: "CHERRY",
		gameType: "MATCHED_GAME",
		gameStartTimestampGte: new Date("2024-01-01T00:00:00Z"),
	});
}

// Summoner's Rift Map (https://static.developer.riotgames.com/docs/lol/maps.json)
// Stable queueIds: 2,4,6,14,420,430,440,490,700
export async function getSRMatches(user: Summoner) {
	return getMatches(user, {
		mapIds: [1, 2, 11],
		queueIdsNotIn: [800, 810, 820, 830, 840, 850, 860, 870, 880, 890], // Co-op vs AI
		gameMode: "CLASSIC",
		gameType: "MATCHED_GAME",
		gameStartTimestampGte: new Date("2023-01-01T00:00:00Z"),
	});
}
