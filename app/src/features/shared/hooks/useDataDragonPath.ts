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

	/**
	 * Icon for a challenge at one specific tier.
	 *
	 * `getChallengeIcon` answers a different question: it returns the art of the *highest* tier a
	 * challenge defines, which is what the global directory and leaderboard want. A profile has to
	 * show the tier its summoner actually reached, so it passes that tier in here.
	 *
	 * Riot publishes a token per *tier* only — there is no `unranked` variant upstream — so a null
	 * tier is a last resort for a challenge with no ladder at all, and the image proxy answers it
	 * with its fallback. Callers should pass a real tier wherever one exists.
	 */
	const getChallengeTierIcon = (challengeId: number, tier: string | null) => {
		return `/api/images/cdn/${version}/img/challenges/${challengeId}-${(tier ?? "unranked").toLowerCase()}.webp`;
	};

	return {
		getChampionImage,
		getProfileImage,
		getItemImage,
		getSpellImage,
		getChallengeIcon,
		getChallengeTierIcon,
	};
};
