interface RoleHeaderProps {
	role: string;
	finishedSize: number;
	size: number;
	hasHidden: boolean;
	percentage: number;
	hiddenCount?: number;
}

// Get progress bar color based on completion percentage
const getProgressColor = (percentage: number): string => {
	if (percentage >= 100) return "bg-gradient-to-r from-amber-400 to-yellow-500";
	if (percentage >= 75) return "bg-gradient-to-r from-emerald-500 to-teal-500";
	if (percentage >= 50) return "bg-gradient-to-r from-sky-500 to-blue-500";
	if (percentage >= 25) return "bg-gradient-to-r from-violet-500 to-purple-500";
	return "bg-gradient-to-r from-rose-500 to-pink-500";
};

export function RoleHeader({
	role,
	finishedSize,
	size,
	hasHidden,
	percentage,
	hiddenCount = 0,
}: RoleHeaderProps) {
	return (
		<div className="flex flex-col gap-2 mb-3">
			{/* Role title */}
			<h4 className="font-bold text-lg text-center">{role}</h4>

			{/* Progress bar row with stats */}
			<div className="flex items-center justify-center gap-2">
				<span className="text-xs text-muted-foreground whitespace-nowrap">
					{finishedSize}/{size}{hasHidden ? "*" : ""}
				</span>
				<div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
					<div
						className={`h-full ${getProgressColor(percentage)} transition-all duration-500 ease-out rounded-full`}
						style={{ width: `${Math.min(percentage, 100)}%` }}
					/>
				</div>
				<span className="text-xs text-muted-foreground whitespace-nowrap">
					{percentage.toFixed(1)}%
				</span>
			</div>

			{/* Hidden count indicator - always shown for consistent alignment */}
			<div className="text-xs text-muted-foreground text-center h-4">
				{hiddenCount} hidden by filters
			</div>
		</div>
	);
}
