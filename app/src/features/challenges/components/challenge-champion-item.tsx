import type React from "react";
import { useDataDragonPath } from "@/features/shared/hooks/useDataDragonPath";
import type { CompleteChampionInfo } from "@/features/shared/types";

export const DifferentChampionItem = ({
	champ,
	hide,
	version,
	onClick,
}: {
	champ: CompleteChampionInfo;
	hide: boolean;
	version: string;
	onClick: () => void;
}) => {
	const { getChampionImage } = useDataDragonPath(version);
	return (
		<li className="flex flex-col pb-2" key={champ.key as React.Key}>
			<div className="relative z-10">
				<img
					onClick={onClick}
					src={getChampionImage(champ.full)}
					style={{
						zIndex: -1,
						opacity: hide ? "40%" : "100%",
						boxSizing: "border-box",
					}}
					className={`rounded ${hide ? "brightness-50 grayscale" : ""}`}
					alt={`${champ.name}`}
					height={90}
					width={90}
				/>
			</div>

			<div className="text-center text-xs">{champ.name}</div>
		</li>
	);
};
