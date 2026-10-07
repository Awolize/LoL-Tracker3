import { eq, type InferSelectModel, inArray } from "drizzle-orm";

import { db } from "~/db";
import {
	matchInfo as matchInfoTable,
	matchParticipant as matchParticipantTable,
	matchSummoners as matchSummonersTable,
	match as matchTable,
	type summoner,
	summoner as summonerTable,
} from "~/db/schema";
import { lolApi } from "~/server/external/riot/lol-api";
import type { Regions } from "~/server/external/riot/twisted";
import { regionToRegionGroup } from "~/server/external/riot/twisted";

type SummonerRow = InferSelectModel<typeof summoner>;

export const fetchMatchIds = async (puuid: string, region: Regions): Promise<string[]> => {
	let totalCount = 1000;
	const matchIds: string[] = [];
	let start = 0;

	while (totalCount > 0) {
		const count = Math.min(100, totalCount);
		const matchIdsResponse = await lolApi.MatchV5.list(puuid, regionToRegionGroup(region), {
			count,
			start,
			startTime: new Date("2022-05-11T00:00:00Z").getTime() / 1000,
		});

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

	console.log(
		"diff",
		matchIds.filter((id) => !existingGameIds.has(id)),
	);

	return matchIds.filter((id) => !existingGameIds.has(id));
};

export const updateGamesSingle = async (matchId: string, region: Regions) => {
	const gameResponse = await lolApi.MatchV5.get(matchId, regionToRegionGroup(region));
	const game = gameResponse.response;

	// Match-V5 `info.gameDuration` is in SECONDS. `gameEndTimestamp` is normally
	// present (added in 11.20); fall back to start + duration for very old matches.
	const gameStartTimestamp = new Date(game.info.gameStartTimestamp);
	const gameEndTimestamp = game.info.gameEndTimestamp
		? new Date(game.info.gameEndTimestamp)
		: new Date(game.info.gameStartTimestamp + game.info.gameDuration * 1000);

	await db.transaction(async (tx) => {
		const validSummoners: SummonerRow[] = [];

		for (const participant of game.info.participants) {
			try {
				// Nested transaction = SAVEPOINT: a failed participant upsert rolls back
				// only that participant instead of aborting the whole match transaction.
				const summoner = await tx.transaction(async (sp) => {
					const existing = await sp
						.select()
						.from(summonerTable)
						.where(eq(summonerTable.puuid, participant.puuid))
						.limit(1)
						.then((rows) => rows[0] || null);

					// Store lowercase for consistent lookups (UI resolves by lowercased Riot ID).
					const gameName = participant.riotIdGameName?.toLowerCase() ?? null;
					const tagLine = participant.riotIdTagline?.toLowerCase() ?? null;

					if (!existing) {
						const inserted = await sp
							.insert(summonerTable)
							.values({
								puuid: participant.puuid,
								region,
								gameName,
								tagLine,
								summonerLevel: participant.summonerLevel,
								profileIconId: participant.profileIcon,
								revisionDate: gameStartTimestamp,
								updatedAt: gameStartTimestamp,
								createdAt: new Date(),
							})
							.returning();
						return inserted[0];
					}

					if (gameStartTimestamp > existing.updatedAt) {
						const updated = await sp
							.update(summonerTable)
							.set({
								gameName,
								tagLine,
								summonerLevel: participant.summonerLevel,
								profileIconId: participant.profileIcon,
								revisionDate: gameStartTimestamp,
								updatedAt: gameStartTimestamp,
							})
							.where(eq(summonerTable.puuid, participant.puuid))
							.returning();
						return updated[0];
					}

					return existing;
				});

				if (summoner) validSummoners.push(summoner);
			} catch (error) {
				console.error("Error upserting summoner:", participant.puuid, error);
			}
		}

		await tx.insert(matchTable).values({ gameId: matchId }).onConflictDoNothing();

		await tx
			.insert(matchInfoTable)
			.values({
				gameId: matchId,
				dataVersion: game.metadata.dataVersion,
				endOfGameResult: game.info.endOfGameResult,
				gameCreation: new Date(game.info.gameCreation),
				gameDuration: game.info.gameDuration,
				gameEndTimestamp,
				gameMode: game.info.gameMode,
				gameName: game.info.gameName,
				gameStartTimestamp,
				gameType: game.info.gameType,
				gameVersion: game.info.gameVersion,
				mapId: game.info.mapId,
				participants: game.info.participants,
				platformId: game.info.platformId,
				queueId: game.info.queueId,
				teams: game.info.teams,
				tournamentCode: game.info.tournamentCode,
			})
			.onConflictDoNothing();

		// Connect participants
		for (const s of validSummoners) {
			await tx
				.insert(matchSummonersTable)
				.values({ a: matchId, b: s.puuid })
				.onConflictDoNothing();
		}

		// Typed projection for SQL querying. Only for participants whose Summoner row
		// exists (the FK requires it); `MatchInfo.participants` keeps the full payload.
		const knownPuuids = new Set(validSummoners.map((s) => s.puuid));
		const participantRows = game.info.participants
			.filter((p) => knownPuuids.has(p.puuid))
			.map((p) => ({
				matchId,
				puuid: p.puuid,
				participantId: p.participantId,
				teamId: p.teamId,
				championId: p.championId,
				championName: p.championName,
				win: p.win,
				teamPosition: p.teamPosition || null,
				individualPosition: p.individualPosition || null,
				placement: p.placement ?? null,
				kills: p.kills,
				deaths: p.deaths,
				assists: p.assists,
				goldEarned: p.goldEarned,
				totalMinionsKilled: p.totalMinionsKilled,
				neutralMinionsKilled: p.neutralMinionsKilled,
				visionScore: p.visionScore,
				champLevel: p.champLevel,
				timePlayed: p.timePlayed,
				totalDamageDealtToChampions: p.totalDamageDealtToChampions,
				item0: p.item0,
				item1: p.item1,
				item2: p.item2,
				item3: p.item3,
				item4: p.item4,
				item5: p.item5,
				item6: p.item6,
				summoner1Id: p.summoner1Id,
				summoner2Id: p.summoner2Id,
			}));

		if (participantRows.length > 0) {
			await tx.insert(matchParticipantTable).values(participantRows).onConflictDoNothing();
		}
	});
};
