import { db } from "~/db";
import { championMastery } from "~/db/schema";
import { lolApi } from "~/server/external/riot/lol-api";
import type { Regions } from "~/server/external/riot/twisted";
import type { ChampionMasteryDTO } from "~/server/external/riot/twisted";
import type { AccountDto } from "~/server/external/riot/twisted";

/**
 * Twisted's `ChampionMasteryDTO` predates the season-milestone fields that Riot
 * actually returns (`milestoneGrades`), so widen the API response locally.
 */
type ChampionMasteryDtoWithMilestones = ChampionMasteryDTO & {
	milestoneGrades?: string[];
};

export const upsertMastery = async (user: AccountDto, region: Regions) => {
	const masteryList = (await lolApi.Champion.masteryByPUUID(user.puuid, region))
		.response as ChampionMasteryDtoWithMilestones[];

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
				markRequiredForNextLevel: m.markRequiredForNextLevel ?? null,
				championSeasonMilestone: m.championSeasonMilestone ?? null,
				nextSeasonMilestone: (m.nextSeasonMilestone ?? null) as unknown,
				milestoneGrades: m.milestoneGrades ?? null,
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
					markRequiredForNextLevel: m.markRequiredForNextLevel ?? null,
					championSeasonMilestone: m.championSeasonMilestone ?? null,
					nextSeasonMilestone: (m.nextSeasonMilestone ?? null) as unknown,
					milestoneGrades: m.milestoneGrades ?? null,
					updatedAt: new Date(),
				},
			}),
	);

	await Promise.all(promises);
};
