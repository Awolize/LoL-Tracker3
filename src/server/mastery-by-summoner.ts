import { eq } from "drizzle-orm";
import type { Regions } from "twisted/dist/constants";
import { db } from "@/db";
import { championMastery } from "@/db/schema";
import type { ChampionMasteryDTOWithoutExtras, Summoner } from "@/lib/types";

export const masteryBySummoner = async (
	region: Regions,
	user: Summoner,
): Promise<ChampionMasteryDTOWithoutExtras[]> => {
	try {
		// Fetch mastery rows for this summoner
		const masteryRows = await db
			.select({
				mastery: championMastery,
			})
			.from(championMastery)
			.where(eq(championMastery.puuid, user.puuid));

		if (masteryRows.length) {
			console.log(
				new Date().toLocaleString(),
				`Summoner found in database: ${user.gameName}#${user.tagLine}, ${masteryRows.length} mastery rows`,
			);
		} else {
			console.log(
				new Date().toLocaleString(),
				`No mastery data for summoner ${user.gameName}#${user.tagLine}, ${region}`,
			);
		}

		return masteryRows.map(({ mastery }) => ({
			championId: mastery.championId,
			championLevel: mastery.championLevel,
			championPoints: mastery.championPoints,
			lastPlayTime: new Date(mastery.lastPlayTime).getTime(),
			championPointsSinceLastLevel: mastery.championPointsSinceLastLevel,
			championPointsUntilNextLevel: mastery.championPointsUntilNextLevel,
			chestGranted: mastery.chestGranted,
			tokensEarned: mastery.tokensEarned,
		}));
	} catch (err) {
		console.error(
			`Error fetching champion mastery for ${user.gameName}#${user.tagLine}:`,
			err,
		);
		return [];
	}
};
