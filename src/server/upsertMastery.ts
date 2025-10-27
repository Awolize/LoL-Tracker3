import { db } from "@/db";
import { championMastery } from "@/db/schema";
import type { ChampionMasteryDTOWithoutExtras } from "@/server/mastery-by-summoner";

export const upsertMastery = async (
	puuid: string,
	masteryList: ChampionMasteryDTOWithoutExtras[],
) => {
	const promises = masteryList.map((m) =>
		db
			.insert(championMastery)
			.values({
				puuid,
				championId: m.championId,
				championLevel: m.championLevel,
				championPoints: m.championPoints,
				lastPlayTime: new Date(m.lastPlayTime),
				tokensEarned: m.tokensEarned,
				chestGranted: m.chestGranted,
			})
			.onConflictDoUpdate({
				target: [championMastery.puuid, championMastery.championId],
				set: {
					championLevel: m.championLevel,
					championPoints: m.championPoints,
					lastPlayTime: new Date(m.lastPlayTime),
					tokensEarned: m.tokensEarned,
					chestGranted: m.chestGranted,
				},
			}),
	);

	await Promise.all(promises);
};
