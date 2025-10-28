import clsx from "clsx";
import type React from "react";
import { useDataDragonPath } from "@/components/custom/use-data-dragon-path";
import { filteredOut } from "@/lib/champs";
import type { CompleteChampionInfo } from "@/lib/types";

interface ChampionItemProps {
	champ: CompleteChampionInfo;
	handleChampionClick: (championId: number) => void;
	filterPoints: number;
	showFinished: boolean;
	showLevel: boolean;
	hiddenChamp: boolean;
	showMasteryPoints: boolean;
}

const ChampionItem: React.FC<ChampionItemProps> = ({
	champ,
	filterPoints,
	showFinished,
	showLevel,
	hiddenChamp,
	showMasteryPoints,
	handleChampionClick,
}) => {
	const disabled = filteredOut(champ, filterPoints);
	const hide = disabled && !showFinished;

	const { getChampionImage } = useDataDragonPath(champ.version);

	console.log(getChampionImage(champ.full));

	if (hide) return <></>;

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: Not sure how to solve this. Putting it off until later date, more pressing matters
		<li
			key={champ.key as React.Key}
			className="flex flex-col pb-2"
			onClick={() => handleChampionClick(champ.id)}
		>
			<div className="relative z-10">
				{showLevel && (
					<div className="absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 bg-opacity-50 font-bold text-xs">
						{champ.championLevel}
					</div>
				)}

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
							"border-4 border-sky-500 border-opacity-70":
								showLevel && champ.championLevel >= 10,
							"border-4 border-purple-600 border-opacity-60":
								showLevel && champ.championLevel === 9,
							"border-4 border-red-600 border-opacity-50":
								showLevel && champ.championLevel === 8,
							"border-4 border-yellow-700 border-opacity-25":
								showLevel && champ.championLevel < 8,
						},
						"rounded",
					)}
					alt={`${champ.name}`}
					height={90}
					width={90}
					// placeholder="blur"
					// blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
				/>
			</div>

			<div className="text-center text-xs">{champ.name}</div>
			{showMasteryPoints && (
				<div className="items-center justify-center text-center text-xs">
					{champ.championPoints}
				</div>
			)}
		</li>
	);
};

export default ChampionItem;
