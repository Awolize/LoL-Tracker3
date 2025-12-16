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

	const getChallengeIcon = (challengeId: number) => {
		return `/api/images/cdn/${version}/img/challenges/${challengeId}-master.webp`;
	};

	return { getChampionImage, getProfileImage, getChallengeIcon };
};
