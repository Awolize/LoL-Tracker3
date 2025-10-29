import { type InferSelectModel, inArray } from "drizzle-orm";
import type { Regions } from "twisted/dist/constants";
import { regionToRegionGroup } from "twisted/dist/constants";
import type { RateLimitError } from "twisted/dist/errors";
import { db } from "@/db";
import {
  matchInfo as matchInfoTable,
  match as matchTable,
  matchSummoners as matchSummonersTable,
  type summoner,
} from "@/db/schema";
import { lolApi } from "@/lib/lol-api";
import { summonersFromGames } from "@/server/summonersFromGames";

type SummonerRow = InferSelectModel<typeof summoner>;

export const updateGames = async (user: SummonerRow, region: Regions) => {
  try {
    const matchIds = await fetchMatchIds(user.puuid, region);

    console.log(
      `UpdateGames for user ${user.gameName}#${user.tagLine} (${user.region}), ${matchIds.length} games`,
    );

    const { addedGames, skippedGames, failedGames } = await processMatches(
      user,
      region,
      matchIds,
    );

    console.log({
      addedGames: addedGames.length,
      failedGames: failedGames.length,
      skipAddingGames: skippedGames.length,
    });

    return { addedGames, failedGames, skippedGames };
  } catch (error) {
    console.error("updateGames error:", error);
    return { addedGames: [], failedGames: [], skippedGames: [] };
  }
};

const fetchMatchIds = async (
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

  return matchIds;
};

const processMatches = async (
  user: SummonerRow,
  region: Regions,
  matchIds: string[],
): Promise<{
  addedGames: string[];
  skippedGames: string[];
  failedGames: string[];
}> => {
  const addedGames: string[] = [];
  const skippedGames: string[] = [];
  const failedGames: string[] = [];

  // Get existing games
  const existingGames = await db
    .select()
    .from(matchTable)
    .where(inArray(matchTable.gameId, matchIds));

  const newMatchIds = matchIds.filter((id) => {
    const exists = existingGames.some((g) => g.gameId === id);
    if (exists) skippedGames.push(id);
    return !exists;
  });

  for (let index = 0; index < newMatchIds.length; index++) {
    const matchId = newMatchIds[index];

    if (!matchId) continue;

    if (index % 50 === 0) {
      console.log(
        `${user.gameName}#${user.tagLine} (${user.region}) progress: ${index} / ${newMatchIds.length}`,
      );
    }

    try {
      await processSingleMatch(region, matchId);
      addedGames.push(matchId);
    } catch (error) {
      const rateLimitError = error as RateLimitError;
      if (rateLimitError?.status === 429) {
        const retryAfter = (rateLimitError.rateLimits?.RetryAfter || 60) + 1;
        console.warn(
          `[Game] Rate limited. Retrying in ${retryAfter} seconds...`,
        );
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        newMatchIds.push(matchId);
      } else {
        console.error(`Failed processing game ${matchId}`, error);
        failedGames.push(matchId);
      }
    }
  }

  return { addedGames, skippedGames, failedGames };
};

const processSingleMatch = async (region: Regions, matchId: string) => {
  const gameResponse = await lolApi.MatchV5.get(
    matchId,
    regionToRegionGroup(region),
  );
  const game = gameResponse.response;

  const creationPromises = summonersFromGames(game);
  const summoners = await Promise.all(
    creationPromises.map(async (p) => {
      try {
        return await p;
      } catch (error) {
        console.error("Error creating summoner:", error);
        return null;
      }
    }),
  );

  const validSummoners = summoners.filter((s): s is SummonerRow => s !== null);

  // Insert match and match info
  await db.insert(matchTable).values({
    gameId: matchId,
  });

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
    participants: game.info.participants as unknown, // need typed JSON
    platformId: game.info.platformId,
    queueId: game.info.queueId,
    teams: game.info.teams as unknown,
    tournamentCode: game.info.tournamentCode,
  });

  // Connect participants
  for (const s of validSummoners) {
    await db
      .insert(matchSummonersTable)
      .values({
        a: matchId,
        b: s.puuid,
      })
      .onConflictDoNothing(); // ignore if already connected
  }
};
