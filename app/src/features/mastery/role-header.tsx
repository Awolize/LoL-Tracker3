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
		<div className="mb-3 flex flex-col gap-2">
			{/* Role title */}
			<h4 className="text-center text-lg font-bold">{role}</h4>

			{/* Progress bar row with stats */}
			<div className="flex items-center justify-center gap-2">
				<span className="text-muted-foreground text-xs whitespace-nowrap">
					{finishedSize}/{size}
					{hasHidden ? "*" : ""}
				</span>
				<div className="bg-muted h-2 w-32 overflow-hidden rounded-full">
					<div
						className={`h-full ${getProgressColor(percentage)} rounded-full transition-all duration-500 ease-out`}
						style={{ width: `${Math.min(percentage, 100)}%` }}
					/>
				</div>
				<span className="text-muted-foreground text-xs whitespace-nowrap">
					{percentage.toFixed(1)}%
				</span>
			</div>
		</div>
	);
}
