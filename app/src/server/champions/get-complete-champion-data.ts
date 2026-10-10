import { db } from "~/db";
import { championDetails } from "~/db/schema";
import { baseChampionKey } from "~/features/shared/champs";
import type { CompleteChampionInfo, Summoner } from "~/features/shared/types";
import { getDataDragonVersion } from "~/server/api/get-datadragon-version";
import { masteryBySummoner } from "~/server/champions/mastery-by-summoner";
import type { Regions } from "~/server/external/riot/twisted";

import { globalLaneCounts, summonerLaneCounts } from "./lane-data";

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

	const completeChampionsData = champions.map((champion) => {
		const baseId =
			championIdByKey.get(baseChampionKey(champion.key)) ??
			championIdByName.get(champion.name);

		// Prefer the summoner's own games in the current patch window, then how the champion
		// is played across every recorded match. Only a champion with no recorded games at
		// all falls through to the default lane — every champion in ChampionDetails currently
		// has games, so that branch is insurance, not a path taken in practice.
		const role =
			(baseId === undefined ? undefined : summonerLanes.get(baseId)) ??
			(baseId === undefined ? undefined : globalLanes.get(baseId)) ??
			"Bottom";

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

	// The page-level version must come from the shared resolver, never from `champions[0]`:
	// `ChampionDetails` holds the current and classic sets at once (16.20.1 and 16.15.1), and
	// this select has no `ORDER BY`, so row 0 is arbitrary — it would pick the classic version
	// and build every page-level champion icon URL against the wrong patch.
	const version = await getDataDragonVersion();

	return { completeChampionsData, version };
}
