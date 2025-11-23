import { useMemo } from "react";
import type {
	ChampionDetails,
	CompleteChampionInfo,
} from "@/features/shared/types";
import { useChallengeContext } from "@/stores/challenge-store";
import { DifferentHeaderCounter } from "./header-counter.tsx";

interface ChampionListHeaderProps {
	challengeChampions?: ChampionDetails[];
	champions: CompleteChampionInfo[];
	version: string;
	profileId: string;
}

export function ChampionListHeader({
	challengeChampions = [],
	champions,
	version,
	profileId,
}: ChampionListHeaderProps) {
	const selectedChallengeId = useChallengeContext(
		(state) => state.selectedChallengeId,
	);
	const manuallyMarked = useChallengeContext((state) => state.manuallyMarked);

	const totalSize = useMemo(() => {
		if (!selectedChallengeId) return 0;

		const manualList =
			manuallyMarked[profileId]?.[selectedChallengeId] ?? new Set<number>();
		const awotList = challengeChampions.map((e) => e.id!);

		return new Set([...awotList, ...manualList]).size;
	}, [selectedChallengeId, manuallyMarked, profileId, challengeChampions]);

	return (
		<header className="flex h-24 w-full justify-center items-center">
			{selectedChallengeId ? (
				<div className="flex max-w-52 justify-center">
					<DifferentHeaderCounter
						finished={totalSize}
						total={champions.length}
						version={version}
					/>
				</div>
			) : null}
		</header>
	);
}
