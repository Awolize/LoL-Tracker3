interface ChallengeThresholdsProps {
	thresholds: Record<string, number> | null;
	selectedChallengeProgress: {
		challengeId: number;
		value: number;
		percentile: number;
		level: string;
		achievedTime?: Date;
	} | null;
}

export function ChallengeHeaderThresholds({
	thresholds,
	selectedChallengeProgress,
}: ChallengeThresholdsProps) {
	const currentValue = selectedChallengeProgress?.value;


	if (!thresholds || currentValue == null) return null;

	const uniqueSortedValues = Array.from(new Set(Object.values(thresholds).concat(currentValue))).sort(
		(a, b) => a - b,
	);

	return (
		<div className="flex flex-col items-center justify-center">
			<ul className="flex flex-row gap-1 text-sm text-gray-400">
				{uniqueSortedValues.map((value) => (
					<li
						key={value}
						className={`${
							value === currentValue
								? "text-purple-500"
								: value > currentValue
									? "text-white"
									: "text-gray-500"
						}`}
					>
						{value}
					</li>
				))}
			</ul>
		</div>
	);
}
