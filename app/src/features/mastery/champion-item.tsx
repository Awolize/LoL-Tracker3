import clsx from "clsx";
import type React from "react";
import { useState } from "react";
import { filteredOut } from "@/features/shared/champs";
import { useDataDragonPath } from "@/features/shared/hooks/useDataDragonPath";
import type { CompleteChampionInfo } from "@/features/shared/types";

// Mastery level to border color mapping (matches official LoL mastery icons)
const getMasteryBorderColor = (level: number): string => {
	// Level 11+ all use the red/ruby color like level 10
	if (level >= 10) return "ring-red-500"; // Red/Ruby gem
	if (level === 9) return "ring-orange-500"; // Orange gem
	if (level === 8) return "ring-fuchsia-500"; // Purple/Magenta gem
	if (level === 7) return "ring-indigo-400"; // Blue gem
	if (level === 6) return "ring-emerald-500"; // Green gem
	if (level === 5) return "ring-cyan-500"; // Teal/Cyan gem
	if (level === 4) return "ring-amber-600"; // Gold/Bronze
	if (level === 3) return "ring-violet-300"; // Light purple/silver
	if (level === 2) return "ring-amber-700"; // Bronze
	if (level === 1) return "ring-amber-800"; // Dark bronze
	return "ring-stone-600"; // Default
};

interface ChampionItemProps {
	champ: CompleteChampionInfo;
	handleChampionClick: (championId: number) => void;
	filterPoints: number;
	filterLevel: number;
	filterPointsDirection: "above" | "below";
	filterLevelDirection: "above" | "below";
	showFinished: boolean;
	hiddenChamp: boolean;
	showMasteryPoints: boolean;
	showChampionLevels: boolean;
	showMasteryBorders?: boolean;
	isDraggingEnabled?: boolean;
}

const ChampionItem: React.FC<ChampionItemProps> = ({
	champ,
	filterPoints,
	filterLevel,
	filterPointsDirection,
	filterLevelDirection,
	showFinished,
	hiddenChamp,
	showMasteryPoints,
	showChampionLevels,
	showMasteryBorders = true,
	handleChampionClick,
	isDraggingEnabled = false,
}) => {
	// Hooks must be called before any early returns
	const [isHovered, setIsHovered] = useState(false);
	const { getChampionImage } = useDataDragonPath(champ.version ?? "");

	const disabled = filteredOut(
		champ,
		filterPoints,
		filterLevel,
		filterPointsDirection,
		filterLevelDirection,
	);
	const hide = disabled && !showFinished;

	if (!champ.version) return null;
	if (hide) return null;

	const handleDragStart = (e: React.DragEvent) => {
		e.dataTransfer.setData("text/plain", String(champ.id));
	};

	const masteryBorderColor = showMasteryBorders
		? getMasteryBorderColor(champ.championLevel)
		: "ring-transparent";

	return (
		<div
			key={champ.key as React.Key}
			className={clsx(
				"flex flex-col pb-2 cursor-pointer transition-all duration-200 ease-out",
				isHovered && !disabled && "scale-105",
			)}
			onClick={() => handleChampionClick(champ.id)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			draggable={isDraggingEnabled}
			onDragStart={isDraggingEnabled ? handleDragStart : undefined}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					handleChampionClick(champ.id);
				}
			}}
			aria-label={`Champion ${champ.name}, level ${champ.championLevel}, ${champ.championPoints} points`}
			title={`${champ.name}\nMastery Level: ${champ.championLevel}\nMastery Points: ${champ.championPoints.toLocaleString()}`}
		>
			<div
				className={clsx(
					"relative z-10 rounded ring-2 transition-all duration-200",
					masteryBorderColor,
					isHovered && !disabled && "ring-4 shadow-lg shadow-current/20",
				)}
			>
				<img
					src={getChampionImage(champ.full)}
					style={{
						zIndex: -1,
						opacity: disabled ? "40%" : "100%",
						boxSizing: "border-box",
					}}
					className={clsx(
						{
							"brightness-50 grayscale": hiddenChamp,
							grayscale: disabled,
						},
						"rounded",
					)}
					alt={`${champ.name}`}
					height={90}
					width={90}
				/>
				{showChampionLevels && (
					<div className="absolute top-1 left-1 bg-black/80 text-white text-xs font-bold px-1.5 py-0.5 rounded z-20">
						{champ.championLevel}
					</div>
				)}
			</div>

			<div className="text-center text-xs mt-1 truncate" title={champ.name}>
				{champ.name}
			</div>
			{showMasteryPoints && (
				<div className="items-center justify-center text-center text-xs text-muted-foreground">
					{champ.championPoints.toLocaleString()}
				</div>
			)}
		</div>
	);
};

export default ChampionItem;
