import clsx from "clsx";
import type React from "react";
import { filteredOut } from "@/features/shared/champs";
import { useDataDragonPath } from "@/features/shared/hooks/useDataDragonPath";
import type { CompleteChampionInfo } from "@/features/shared/types";

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
	handleChampionClick,
	isDraggingEnabled = false,
}) => {
	const disabled = filteredOut(
		champ,
		filterPoints,
		filterLevel,
		filterPointsDirection,
		filterLevelDirection,
	);
	const hide = disabled && !showFinished;

	if (!champ.version) return null;

	const { getChampionImage } = useDataDragonPath(champ.version);

	if (hide) return null;

	const handleDragStart = (e: React.DragEvent) => {
		e.dataTransfer.setData("text/plain", String(champ.id));
	};

	return (
		<div
			key={champ.key as React.Key}
			className="flex flex-col pb-2"
			onClick={() => handleChampionClick(champ.id)}
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
		>
			<div className="relative z-10">
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
					// placeholder="blur"
					// blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
				/>
				{showChampionLevels && (
					<div className="absolute top-1 left-1 bg-black bg-opacity-70 text-white text-xs font-bold px-1 rounded z-20">
						{champ.championLevel}
					</div>
				)}
			</div>

			<div className="text-center text-xs">{champ.name}</div>
			{showMasteryPoints && (
				<div className="items-center justify-center text-center text-xs">
					{champ.championPoints}
				</div>
			)}
		</div>
	);
};

export default ChampionItem;
