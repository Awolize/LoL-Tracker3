export const useDataDragonPath = (version: string) => {
	const getChampionImage = (championName: string) => {
		return `/api/images/cdn/${version}/img/champion/${championName}`.replace(
			".png",
			".webp",
		);
	};

	const getProfileImage = (iconId: string) => {
		
		return `/api/images/cdn/${version}/img/profileicon/${iconId}.webp`
	};

	return { getChampionImage, getProfileImage };
};