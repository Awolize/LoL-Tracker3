export const useDataDragonPath = (version: string) => {
	const getChampionImage = (championName: string) => {
		return `/api/images/cdn/${version}/img/champion/${championName}`;
	};

	return { getChampionImage };
};
