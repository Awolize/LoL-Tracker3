import { db } from "~/db";
import { championDetails } from "~/db/schema";
import { baseChampionKey } from "~/features/shared/champs";
import type { CompleteChampionInfo, Summoner } from "~/features/shared/types";
import { masteryBySummoner } from "~/server/champions/mastery-by-summoner";
import type { Regions } from "~/server/external/riot/twisted";

import { globalLaneCounts, summonerLaneCounts } from "./lane-data";
import rolesJson from "./roles.json";

export async function getCompleteChampionData(region: Regions, user: Summoner) {
	const championMasteries = await masteryBySummoner(region, user);
	const [champions, summonerLanes, globalLanes] = await Promise.all([
		db.select().from(championDetails),
		summonerLaneCounts(user.puuid),
		globalLaneCounts(),
	]);

	// The classic and current versions are separate sets, and only the latter carries
	// matches, so a classic entry (Jade_Aatrox) resolves through the champion it mirrors.
	//
	// By key first — `ChampionDetails.key` is Riot's internal name and can differ from the
	// display name (`MonkeyKing` is Wukong, so `Jade_Wukong` finds no `Wukong` key). The
	// name lookup is the fallback for exactly that, and it resolves to the current
	// champion because only the classic entries share a name with another row.
	const championIdByKey = new Map(champions.map((champion) => [champion.key, champion.id]));
	const championIdByName = new Map(champions.map((champion) => [champion.name, champion.id]));
	const staticRoles = rolesJson as Record<string, string>;

	const completeChampionsData = champions.map((champion) => {
		const baseKey = baseChampionKey(champion.key);
		const baseId = championIdByKey.get(baseKey) ?? championIdByName.get(champion.name);

		// Prefer the summoner's own games in the current patch window, fall back to how the
		// champion is played across every recorded match, and reach for roles.json only
		// for champions with no recorded games at all.
		const role =
			(baseId === undefined ? undefined : summonerLanes.get(baseId)) ??
			(baseId === undefined ? undefined : globalLanes.get(baseId)) ??
			(staticRoles[baseKey] || "Bottom");

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
