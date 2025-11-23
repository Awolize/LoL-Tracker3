import { db } from "@/db";
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

	const matches = await db.query.match.findMany({
		with: {
			matchInfos: true,
			matchSummoners: {
				with: {
					summoner: true,
				},
			},
		},
		limit: take,
	});

	// Filter matches where the user is a participant and by matchInfo fields
	const filteredMatches = matches.filter((match) => {
		const matchInfo = match.matchInfos?.[0];
		const hasUser = match.matchSummoners!.some(
			(ms) => ms.summoner.puuid === user.puuid,
		);
		const matchFilter =
			(!mapIds || mapIds.includes(matchInfo?.mapId || 0)) &&
			(!queueIdsNotIn || !queueIdsNotIn.includes(matchInfo?.queueId || 0)) &&
			(!gameMode || matchInfo?.gameMode === gameMode) &&
			(!gameType || matchInfo?.gameType === gameType) &&
			(!gameStartTimestampGte ||
				(matchInfo?.gameStartTimestamp || new Date(0)) >=
					gameStartTimestampGte);

		return hasUser && matchFilter;
	});

	// Sort by gameStartTimestamp desc
	filteredMatches.sort((a, b) => {
		const aTime = a.matchInfos?.[0]?.gameStartTimestamp || new Date(0);
		const bTime = b.matchInfos?.[0]?.gameStartTimestamp || new Date(0);
		return bTime.getTime() - aTime.getTime();
	});

	return filteredMatches.slice(0, take);
}

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
