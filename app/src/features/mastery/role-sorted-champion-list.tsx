import ChampionItem from "@/features/mastery/champion-item";
import { RoleHeader } from "@/features/mastery/role-header";
import { filteredOut, sortAlgorithm } from "@/features/shared/champs";
import type { CompleteChampionInfo } from "@/features/shared/types";
import { useOptionsPersistentContext } from "@/stores/options-persistent-store";

const ROLES = ["Top", "Jungle", "Mid", "Bottom", "Support"];
const SortedChampionList = ({
	champions,
}: {
	champions: CompleteChampionInfo[];
}) => {
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
		roleMode,
		userRoles,
		setUserRole,
	} = useOptionsPersistentContext((state) => state);

	const getEffectiveRole = (champ: CompleteChampionInfo): string => {
		return roleMode === "user" ? userRoles[champ.id] || champ.role : champ.role;
	};

	const playerChampionInfoSorted: CompleteChampionInfo[][] = [];

	for (const role of ROLES) {
		const championsForRole = champions.filter(
			(champion) => getEffectiveRole(champion) === role,
		);
		playerChampionInfoSorted.push(championsForRole);
	}

	return (
		<div className="flex flex-row gap-2">
			{playerChampionInfoSorted.map((roleChampions, index) => {
				const role = ROLES[index] ?? `Unknown ${index}`;

				roleChampions.sort((a, b) => sortAlgorithm(sortOrder, a, b));
				const finishedChamps = roleChampions.filter(
					(champ) =>
						filteredOut(
							champ,
							filterPoints,
							filterLevel,
							filterPointsDirection,
							filterLevelDirection,
						) || selectedChampions.has(champ.id),
				);
				const finishedChampsPercentage =
					(finishedChamps.length / roleChampions.length) * 100;

				const handleDragOver = (e: React.DragEvent) => {
					e.preventDefault();
				};

				const handleDrop = (e: React.DragEvent) => {
					e.preventDefault();
					const champId = parseInt(e.dataTransfer.getData("text/plain"), 10);
					setUserRole(champId, role);
				};

				return (
					<div
						className="w-full p-4"
						key={role}
						onDragOver={roleMode === "user" ? handleDragOver : undefined}
						onDrop={roleMode === "user" ? handleDrop : undefined}
					>
						<RoleHeader
							role={role}
							finishedSize={finishedChamps.length}
							hasHidden={false}
							size={roleChampions.length}
							percentage={finishedChampsPercentage}
							hiddenCount={
								roleChampions.length -
								roleChampions.filter((c) => {
									const hidden = selectedChampions.has(c.id);
									if (hidden && !showSelectedChampions) return false;
									return !filteredOut(
										c,
										filterPoints,
										filterLevel,
										filterPointsDirection,
										filterLevelDirection,
									);
								}).length
							}
						/>

						<div
							className="grid justify-between"
							style={{
								gridTemplateColumns: `repeat(auto-fill, ${championsScale}px)`,
							}}
						>
							{roleChampions.map((championInfo) => {
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
										hiddenChamp={hidden}
										showMasteryPoints={showMasteryPoints}
										showChampionLevels={showChampionLevels}
										showMasteryBorders={showMasteryBorders}
										showFinished={false}
										isDraggingEnabled={roleMode === "user"}
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
			})}
		</div>
	);
};

export default SortedChampionList;
