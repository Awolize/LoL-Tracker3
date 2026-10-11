export const useDataDragonPath = (version: string) => {
	const getChampionImage = (championName: string) => {
		return `/api/images/cdn/${version}/img/champion/${championName}`.replace(".png", ".webp");
	};

	const getProfileImage = (iconId: string) => {
		return `/api/images/cdn/${version}/img/profileicon/${iconId}.webp`;
	};

	/**
	 * Items are addressed by id (`img/item/1001.webp`); summoner spells by Data Dragon's file name
	 * (`img/spell/SummonerFlash.webp`), which is why stored spell ids need `summonerSpells.ts`.
	 */
	const getItemImage = (itemId: number) => {
		return `/api/images/cdn/${version}/img/item/${itemId}.webp`;
	};

	const getSpellImage = (imageName: string) => {
		return `/api/images/cdn/${version}/img/spell/${imageName}.webp`;
	};

	const getChallengeIcon = (challengeId: number, thresholds?: Record<string, number>) => {
		// Determine the highest achievable tier
		let highestTier = "CHALLENGER"; // default fallback

		if (thresholds) {
			const tierOrder = [
				"IRON",
				"BRONZE",
				"SILVER",
				"GOLD",
				"PLATINUM",
				"DIAMOND",
				"MASTER",
				"GRANDMASTER",
				"CHALLENGER",
			];

			for (const tier of tierOrder.reverse()) {
				if (thresholds[tier] !== undefined && thresholds[tier] > 0) {
					highestTier = tier.toLowerCase();
					break;
				}
			}
		}

		return `/api/images/cdn/${version}/img/challenges/${challengeId}-${highestTier}.webp`;
	};

	return { getChampionImage, getProfileImage, getItemImage, getSpellImage, getChallengeIcon };
};
