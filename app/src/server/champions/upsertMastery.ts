import type { Regions } from "twisted/dist/constants";
import { db } from "@/db";
import { championMastery } from "@/db/schema";
import type { Summoner } from "@/features/shared/types";
import { lolApi } from "@/server/lib/lol-api";

export const upsertMastery = async (user: Summoner, region: Regions) => {
	const masteryList = (await lolApi.Champion.masteryByPUUID(user.puuid, region))
		.response;

	const promises = masteryList.map((m) =>
		db
			.insert(championMastery)
			.values({
				puuid: user.puuid,
				championId: m.championId,
				championLevel: m.championLevel,
				championPoints: m.championPoints,
				lastPlayTime: new Date(m.lastPlayTime),
				tokensEarned: m.tokensEarned,
				championPointsUntilNextLevel: m.championPointsUntilNextLevel,
				championPointsSinceLastLevel: m.championPointsSinceLastLevel,
				updatedAt: new Date(),
			})
			.onConflictDoUpdate({
				target: [championMastery.puuid, championMastery.championId],
				set: {
					championLevel: m.championLevel,
					championPoints: m.championPoints,
					lastPlayTime: new Date(m.lastPlayTime),
					tokensEarned: m.tokensEarned,
					championPointsUntilNextLevel: m.championPointsUntilNextLevel,
					championPointsSinceLastLevel: m.championPointsSinceLastLevel,
					updatedAt: new Date(),
				},
			}),
	);

	await Promise.all(promises);
};
