import { db } from "~/db";
import { championDetails } from "~/db/schema";
import { baseChampionKey } from "~/features/shared/champs";
import type { CompleteChampionInfo, Summoner } from "~/features/shared/types";
import { masteryBySummoner } from "~/server/champions/mastery-by-summoner";
import type { Regions } from "~/server/external/riot/twisted";

import rolesJson from "./roles.json";

export async function getCompleteChampionData(region: Regions, user: Summoner) {
	const championMasteries = await masteryBySummoner(region, user);
	const champions = await db.select().from(championDetails);

	const completeChampionsData = champions.map((champion) => {
		// roles.json only carries the classic keys, so a Jade variant resolves the role of its
		// classic counterpart instead of falling through to the default.
		const role =
			(rolesJson as Record<string, string>)[baseChampionKey(champion.key)] || "Bottom";
		const personalChampData = championMasteries.find(
			(champ) => champ.championId === champion.id,
		) ?? {
			championPoints: 0,
			championLevel: 0,
		};

		const { championPoints, championLevel } = personalChampData;

		return {
			...champion,
			...personalChampData,
			championPoints,
			championLevel,
			role: role,
			name: champion.name === "Nunu & Willump" ? "Nunu" : champion.name,
		} as CompleteChampionInfo;
	});

	const version = champions.at(0)?.version ?? "";

	return { completeChampionsData, version };
}
