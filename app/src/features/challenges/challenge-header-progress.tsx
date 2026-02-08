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
		<div className="flex flex-col text-sm text-muted-foreground">
			<div className="flex gap-1">
				<div>According to Riot, you have completed</div>
				<b className="text-primary">{finishedValue}</b>
				<div>
					{missingValue > 0 ? (
						<>
							which means lol.awot.dev is missing{" "}
							<b className="text-primary">{missingValue}</b> champs.
						</>
					) : (
						"which means all champs are tracked!"
					)}
				</div>
			</div>
			{missingValue > 0 && (
				<div>
					Please review the missing champs and mark them as completed by
					clicking the champs icon.
				</div>
			)}
		</div>
	);
}
