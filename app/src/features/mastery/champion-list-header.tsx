import { useMemo } from "react";
import { ChallengeHeaderProgress } from "@/features/challenges/challenge-header-progress";
import { ChallengeHeaderThresholds } from "@/features/challenges/challenge-header-thresholds";
import type {
	ChampionDetails,
	CompleteChampionInfo,
} from "@/features/shared/types";
import { useChallengeContext } from "@/stores/challenge-store";
import { useSelectedChallenge } from "@/stores/selected-challenge-context";
import { DifferentHeaderCounter } from "./header-counter.tsx";

interface ChampionListHeaderProps {
	challengeChampions?: ChampionDetails[];
	champions: CompleteChampionInfo[];
	version: string;
	profileId: string;
	playerProgress?: Record<number, any> | null;
	challenges?: any[];
}

export function ChampionListHeader({
	challengeChampions = [],
	champions,
	version,
	profileId,
	playerProgress,
	challenges = [],
}: ChampionListHeaderProps) {
	const { selectedChallengeId } = useSelectedChallenge();
	const manuallyMarked = useChallengeContext((state) => state.manuallyMarked);

	const totalSize = useMemo(() => {
		if (!selectedChallengeId) return 0;

		const manualList =
			manuallyMarked[profileId]?.[selectedChallengeId] ?? new Set<number>();
		const awotList = challengeChampions.map((e) => e.id!);

		return new Set([...awotList, ...manualList]).size;
	}, [selectedChallengeId, manuallyMarked, profileId, challengeChampions]);

	const selectedChallengeProgress =
		selectedChallengeId && playerProgress
			? playerProgress[selectedChallengeId]
			: null;
	const selectedChallengeConfig = selectedChallengeId
		? challenges.find((config) => config.config.id === selectedChallengeId)
		: null;

	return (
		<header className="flex h-24 w-full justify-evenly">
			<div className="flex flex-1 items-center justify-center">
				<ChallengeHeaderProgress
					selectedChallengeProgress={selectedChallengeProgress}
					completedChampionsSize={totalSize}
				/>
			</div>
			<div className="flex max-w-52 flex-1 justify-center">
				<DifferentHeaderCounter
					finished={totalSize}
					total={champions.length}
					version={version}
				/>
			</div>
			<div className="flex flex-1 items-center justify-center">
				<ChallengeHeaderThresholds
					thresholds={selectedChallengeConfig?.config.thresholds ?? null}
					selectedChallengeProgress={selectedChallengeProgress}
				/>
			</div>
		</header>
	);
}
