interface ChallengeProgressProps {
	selectedChallengeProgress: {
		challengeId: number;
		value: number;
		percentile: number;
		level: string;
		achievedTime?: Date;
	} | null;
	completedChampionsSize: number;
}

export function ChallengeHeaderProgress({
	selectedChallengeProgress,
	completedChampionsSize,
}: ChallengeProgressProps) {
	if (!selectedChallengeProgress?.value) return null;

	const finishedValue = selectedChallengeProgress.value;
	const missingValue = finishedValue - completedChampionsSize;

	return (
		<div className="flex flex-col">
			<div className="flex gap-1 text-sm">
				<div className="text-gray-400">
					According to Riot, you have finished
				</div>
				<b>{finishedValue}</b>

				{missingValue > 0 ? (
					<>
						<div className="text-gray-400">
							which means lol.awot.dev is missing
						</div>
						<div className="flex flex-row">
							<b>{missingValue}</b>
							<div className="text-gray-400">.</div>
						</div>
					</>
				) : (
					<div className="text-gray-400">
						which means everything is tracked!
					</div>
				)}
			</div>
			{missingValue > 0 && (
				<div className="text-gray-400 text-sm">
					Please make sure to double-check the missing ones.
				</div>
			)}
		</div>
	);
}
