export const useDataDragonPath = (version: string) => {
	const getChampionImage = (championName: string) => {
		return `/api/images/cdn/${version}/img/champion/${championName}`.replace(
			".png",
			".webp",
		);
	};

	const getProfileImage = (iconId: string) => {
		return `/api/images/cdn/${version}/img/profileicon/${iconId}.webp`;
	};

	const getChallengeIcon = (
		challengeId: number,
		thresholds?: Record<string, number>,
	) => {
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

	return { getChampionImage, getProfileImage, getChallengeIcon };
};
