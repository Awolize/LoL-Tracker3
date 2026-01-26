import { eq, type InferSelectModel, inArray } from "drizzle-orm";
import type { Regions } from "twisted/dist/constants";
import { regionToRegionGroup } from "twisted/dist/constants";
import { db } from "@/db";
import {
	matchInfo as matchInfoTable,
	matchSummoners as matchSummonersTable,
	match as matchTable,
	type summoner,
	summoner as summonerTable,
} from "@/db/schema";
import { lolApi } from "@/server/external/riot/lol-api";

type SummonerRow = InferSelectModel<typeof summoner>;

export const fetchMatchIds = async (
	puuid: string,
	region: Regions,
): Promise<string[]> => {
	let totalCount = 1000;
	const matchIds: string[] = [];
	let start = 0;

	while (totalCount > 0) {
		const count = Math.min(100, totalCount);
		const matchIdsResponse = await lolApi.MatchV5.list(
			puuid,
			regionToRegionGroup(region),
			{
				count,
				start,
				startTime: new Date("2022-05-11T00:00:00Z").getTime() / 1000,
			},
		);

		if (matchIdsResponse.response.length === 0) break;

		matchIds.push(...matchIdsResponse.response);
		start += count;
		totalCount -= count;
	}

	console.log("lolapi, found matches", matchIds.length);

	// Filter out already existing matches
	if (matchIds.length === 0) return [];


	const existingMatches = await db
		.select({ gameId: matchTable.gameId })
		.from(matchTable)
		.where(inArray(matchTable.gameId, matchIds));


	console.log("db, found matches", existingMatches.length);

	const existingGameIds = new Set(existingMatches.map((m) => m.gameId));


	console.log("diff", matchIds.filter((id) => !existingGameIds.has(id)));

	return matchIds.filter((id) => !existingGameIds.has(id));
};

export const updateGamesSingle = async (matchId: string, region: Regions) => {
	const gameResponse = await lolApi.MatchV5.get(
		matchId,
		regionToRegionGroup(region),
	);
	const game = gameResponse.response;

	const validSummoners: SummonerRow[] = [];

	for (const participant of game.info.participants) {
		try {
			let summoner = await db
				.select()
				.from(summonerTable)
				.where(eq(summonerTable.puuid, participant.puuid))
				.limit(1)
				.then((rows) => rows[0] || null);

			const gameDate = new Date(game.info.gameStartTimestamp);
			if (!summoner) {
				const inserted = await db
					.insert(summonerTable)
					.values({
						puuid: participant.puuid,
						region,
						gameName: participant.riotIdGameName,
						tagLine: participant.riotIdTagline,
						summonerLevel: participant.summonerLevel,
						profileIconId: participant.profileIcon,
						revisionDate: gameDate,
						updatedAt: gameDate,
						createdAt: new Date(),
					})
					.returning();
				summoner = inserted[0];
			} else {
				if (gameDate > summoner.updatedAt) {
					const updated = await db
						.update(summonerTable)
						.set({
							gameName: participant.riotIdGameName,
							tagLine: participant.riotIdTagline,
							summonerLevel: participant.summonerLevel,
							profileIconId: participant.profileIcon,
							revisionDate: gameDate,
							updatedAt: gameDate,
						})
						.where(eq(summonerTable.puuid, participant.puuid))
						.returning();
					summoner = updated[0];
				}
			}

			validSummoners.push(summoner);
		} catch (error) {
			console.error("Error upserting summoner:", participant.puuid, error);
		}
	}

	await db.insert(matchTable).values({ gameId: matchId });

	await db.insert(matchInfoTable).values({
		gameId: matchId,
		gameCreation: new Date(game.info.gameCreation),
		gameDuration: game.info.gameDuration,
		gameEndTimestamp: new Date(
			game.info.gameStartTimestamp + game.info.gameDuration,
		),
		gameMode: game.info.gameMode,
		gameName: game.info.gameName,
		gameStartTimestamp: new Date(game.info.gameStartTimestamp),
		gameType: game.info.gameType,
		gameVersion: game.info.gameVersion,
		mapId: game.info.mapId,
		participants: game.info.participants as unknown, // typed JSON
		platformId: game.info.platformId,
		queueId: game.info.queueId,
		teams: game.info.teams as unknown,
		tournamentCode: game.info.tournamentCode,
	});

	// Connect participants
	for (const s of validSummoners) {
		await db
			.insert(matchSummonersTable)
			.values({ a: matchId, b: s.puuid })
			.onConflictDoNothing();
	}
};
