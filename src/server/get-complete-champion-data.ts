import type { InferSelectModel } from "drizzle-orm";
import type { Regions } from "twisted/dist/constants";
import { db } from "@/db";
import { championDetails, type summoner } from "@/db/schema";
import type { CompleteChampionInfo } from "@/lib/types";
import { masteryBySummoner } from "@/server/mastery-by-summoner";
import rolesJson from "./roles.json";

type SummonerRow = InferSelectModel<typeof summoner>;

export async function getCompleteChampionData(
	region: Regions,
	user: SummonerRow,
) {
	const championMasteries = await masteryBySummoner(region, user);
	const champions = await db.select().from(championDetails);

	const completeChampionsData = champions.map((champion) => {
		const role = rolesJson[champion.key] || "Bottom";
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
