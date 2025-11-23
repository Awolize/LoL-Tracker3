import type { CompleteChampionInfo } from "@/lib/types";
import { useUserContext } from "@/stores/user-store";
import { useChallengeContext } from "@/stores/challenge-store";
import ChampionItem from "@/components/custom/champion-item";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useOptionsPersistentContext } from "@/stores/options-persistent-store";

const ChallengeChampionList = ({ champions }: { champions: CompleteChampionInfo[] }) => {
	const user = useUserContext((state) => state.user);
	const selectedChallengeId = useChallengeContext((state) => state.selectedChallengeId);
	const setSelectedChallengeId = useChallengeContext((state) => state.setSelectedChallengeId);
	const markChampion = useChallengeContext((state) => state.markChampion);
	const unmarkChampion = useChallengeContext((state) => state.unmarkChampion);
	const manuallyMarked = useChallengeContext((state) => state.manuallyMarked);
	const { showLevels, showMasteryPoints, filterPoints, championsScale } = useOptionsPersistentContext((state) => ({
		showLevels: state.showLevels,
		showMasteryPoints: state.showMasteryPoints,
		filterPoints: state.filterPoints,
		championsScale: state.championsScale,
	}));

	// Placeholder challenges for now, will fetch later
	const challenges = [
		{ id: 100201, name: "Heroes", description: "Master different heroes" },
		{ id: 100301, name: "Ocean", description: "Master champions in ocean theme" },
		{ id: 610003, name: "Adapt to All Situations", description: "Adapt to different playstyles" },
	];

	const profileId = user ? `${user.gameName}-${user.tagLine}` : 'default';

	const selectedMarked = selectedChallengeId && manuallyMarked[profileId]?.[selectedChallengeId] || new Set<number>();

	const handleToggle = (championId: number) => {
		if (!selectedChallengeId || !user) return;
		if (selectedMarked.has(championId)) {
			unmarkChampion(profileId, selectedChallengeId, championId);
		} else {
			markChampion(profileId, selectedChallengeId, championId);
		}
	};

	return (
		<div className="flex flex-col p-4">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-lg font-bold">Champion Challenge Tracker</h2>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">
							{selectedChallengeId
								? challenges.find(c => c.id === selectedChallengeId)?.name || `Challenge ${selectedChallengeId}`
								: "Select Challenge"
							}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={() => setSelectedChallengeId(null)}>
							None
						</DropdownMenuItem>
						{challenges.map(challenge => (
							<DropdownMenuItem key={challenge.id} onClick={() => setSelectedChallengeId(challenge.id)}>
								{challenge.name}: {challenge.description}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{selectedChallengeId && (
				<div className="mb-4">
					<p>Marked Champions: {selectedMarked.size}/{champions.filter(c => c.championPoints >= filterPoints).length}</p>
				</div>
			)}

			<div
				className="grid justify-between gap-2"
				style={{ gridTemplateColumns: `repeat(auto-fill, ${championsScale}px)` }}
			>
				{champions
					.filter(champion => champion.championPoints! >= filterPoints)
					.map((championInfo) => {
						const isMarked = selectedMarked.has(championInfo.id!);

						return (
							<ChampionItem
								key={championInfo.id!}
								champ={championInfo}
								filterPoints={filterPoints}
								hiddenChamp={false}
								showLevel={showLevels}
								showFinished={selectedChallengeId ? isMarked : false}
								showMasteryPoints={showMasteryPoints}
								handleChampionClick={selectedChallengeId ? () => handleToggle(championInfo.id!) : () => {}}
							/>
						);
					})}
			</div>
		</div>
	);
};

export default ChallengeChampionList;
