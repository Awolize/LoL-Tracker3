import ChampionItem from "@/features/mastery/champion-item";
import { sortAlgorithm } from "@/features/shared/champs";
import type { CompleteChampionInfo } from "@/features/shared/types";
import { useOptionsPersistentContext } from "@/stores/options-persistent-store";

const ChampionList = ({ champions }: { champions: CompleteChampionInfo[] }) => {
	const {
		filterPoints,
		filterLevel,
		filterPointsDirection,
		filterLevelDirection,
		showMasteryPoints,
		showChampionLevels,
		showMasteryBorders,
		selectedChampions,
		sortOrder,
		showSelectedChampions,
		championsScale,
		toggleSelectedChampion,
	} = useOptionsPersistentContext((state) => state);

	return (
		<div className="w-full p-4">
			<p>
				{selectedChampions.size}/{champions.length}
			</p>
			<div
				className="grid justify-between gap-2"
				style={{
					gridTemplateColumns: `repeat(auto-fill, ${championsScale}px)`,
				}}
			>
				{champions
					.sort((a, b) => sortAlgorithm(sortOrder, a, b))
					.map((championInfo) => {
						const hidden = selectedChampions.has(championInfo.id);

						if (hidden && !showSelectedChampions) {
							return null;
						}

						return (
							<ChampionItem
								key={championInfo.id}
								champ={championInfo}
								filterPoints={filterPoints}
								filterLevel={filterLevel}
								filterPointsDirection={filterPointsDirection}
								filterLevelDirection={filterLevelDirection}
								hiddenChamp={selectedChampions.has(championInfo.id)}
								showFinished={false}
								showMasteryPoints={showMasteryPoints}
								showChampionLevels={showChampionLevels}
								showMasteryBorders={showMasteryBorders}
								handleChampionClick={() =>
									showSelectedChampions &&
									toggleSelectedChampion(championInfo.id)
								}
							/>
						);
					})}
			</div>
		</div>
	);
};

export default ChampionList;
