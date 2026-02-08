import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DifferentHeaderCounter } from "@/features/mastery/header-counter";
import { filteredOut } from "@/features/shared/champs";
import { type Choice, Dropdown } from "@/features/shared/components/dropdown";
import { ScaleSlider } from "@/features/shared/components/scale-slider";
import { SwitchWithLabel } from "@/features/shared/components/switch-with-label";
import { ToggleEye } from "@/features/shared/components/toggle-eye";
import { TogglePill } from "@/features/shared/components/toggle-pill";
import type { CompleteChampionInfo } from "@/features/shared/types";
import { useOptionsPersistentContext } from "@/stores/options-persistent-store";
import { useUserContext } from "@/stores/user-store";
import { FullSummonerUpdate } from "./summoner-update";

export enum SortOrder2 {
	Points = 0,
	AZ = 1,
	Level = 2,
}

export default function Header({
	champions,
}: {
	champions: CompleteChampionInfo[];
}) {
	const {
		showMasteryPoints,
		showChampionLevels,
		showMasteryBorders,
		byRole,
		filterPoints,
		filterLevel,
		filterPointsDirection,
		filterLevelDirection,
		sortOrder,
		showSelectedChampions,
		selectedChampions,
		roleMode,
		userRoles,
		toggleRoleMode,
		clearUserRoles,
		setSortOrder,
		setFilterPoints,
		setFilterLevel,
		toggleFilterPointsDirection,
		toggleFilterLevelDirection,
		toggleMasteryPoints,
		toggleChampionLevels,
		toggleMasteryBorders,
		toggleSortedByRole,
		toggleShowSelectedChampions,
	} = useOptionsPersistentContext((state) => state);

	const user = useUserContext((s) => s.user);

	const filteredChoices: Choice[] = [
		{ text: "100", value: 100 },
		{ text: "500", value: 500 },
		{ text: "1,000", value: 1000 },
		{ text: "1,800 (Level 2)", value: 1800 },
		{ text: "5,000", value: 5000 },
		{ text: "6000 (Level 3)", value: 6000 },
		{ text: "10,000", value: 10000 },
		{ text: "12,600 (Level 4)", value: 12600 },
		{ text: "21,600 (Level 5)", value: 21600 },
		{ text: "42,600 (Level 7)", value: 42600 },
		{ text: "50,000", value: 50000 },
		{ text: "75,600 (Level 10)", value: 76500 },
		{ text: "100,000", value: 100000 },
		{
			text: "All",
			value: Number.MAX_SAFE_INTEGER,
		},
	];

	const levelChoices: Choice[] = [
		{ text: "Level 1", value: 1 },
		{ text: "Level 2", value: 2 },
		{ text: "Level 3", value: 3 },
		{ text: "Level 4", value: 4 },
		{ text: "Level 5", value: 5 },
		{ text: "Level 6", value: 6 },
		{ text: "Level 7", value: 7 },
		{ text: "Level 8", value: 8 },
		{ text: "Level 9", value: 9 },
		{ text: "Level 10", value: 10 },
		{ text: "Level 15", value: 15 },
		{ text: "Level 20", value: 20 },
		{ text: "Level 25", value: 25 },
		{ text: "Level 50", value: 50 },
		{ text: "Level 100", value: 100 },
		{
			text: "All Levels",
			value: 0,
		},
	];

	const sortOrderChoices: Choice[] = [
		{ text: "Points", value: SortOrder2.Points },
		{ text: "A-Z", value: SortOrder2.AZ },
		{ text: "Level", value: SortOrder2.Level },
	];

	// Exclude hidden champions from counts
	const visibleChampions = champions.filter(
		(c) => !selectedChampions.has(c.id),
	);

	const filteredCount = visibleChampions.filter((c) =>
		filteredOut(
			c,
			filterPoints,
			filterLevel,
			filterPointsDirection,
			filterLevelDirection,
		),
	).length;

	return (
		<div className="flex w-full items-center justify-between px-4 py-2">
			{/* Left */}
			<div className="flex flex-1 justify-start">
				<DifferentHeaderCounter
					finished={filteredCount}
					total={visibleChampions.length}
					version={0}
				/>
			</div>
			<div className="flex flex-row items-center justify-center gap-2 mx-auto">
				<FullSummonerUpdate user={user} awaitMatches={false} />
				<div className="h-8 w-px bg-gray-500" />
				<TogglePill
					label={"By Role"}
					checked={byRole}
					onChange={toggleSortedByRole}
				/>
				{byRole && (
					<>
						<div className="h-8 w-px bg-gray-500" />
						<SwitchWithLabel
							label={`Role Mode: ${roleMode === "user" ? "Custom" : "Default"}`}
							checked={roleMode === "user"}
							onChange={toggleRoleMode}
						/>
						<Button
							variant="outline"
							size="sm"
							onClick={clearUserRoles}
							disabled={Object.keys(userRoles).length === 0}
						>
							Reset Custom Roles
						</Button>
					</>
				)}
				<Dropdown
					callback={(choice) => setFilterPoints(choice)}
					menuLabel={`Filter by (${filterPointsDirection})`}
					choice={
						filteredChoices.find((el) => el.value === filterPoints) ??
						filteredChoices[filteredChoices.length - 1]
					}
					choices={filteredChoices}
				/>
				<Button
					variant="outline"
					size="sm"
					onClick={toggleFilterPointsDirection}
					className="px-1"
					aria-label={`Filter ${filterPointsDirection === "above" ? "above" : "below"} points`}
				>
					{filterPointsDirection === "above" ? (
						<ArrowUpIcon className="h-4 w-4" />
					) : (
						<ArrowDownIcon className="h-4 w-4" />
					)}
				</Button>
				<Dropdown
					callback={(choice) => setFilterLevel(choice)}
					menuLabel={`Level (${filterLevelDirection})`}
					choice={
						levelChoices.find((el) => el.value === filterLevel) ??
						levelChoices[levelChoices.length - 1]
					}
					choices={levelChoices}
				/>
				<Button
					variant="outline"
					size="sm"
					onClick={toggleFilterLevelDirection}
					className="px-1"
					aria-label={`Filter ${filterLevelDirection === "above" ? "above" : "below"} levels`}
				>
					{filterLevelDirection === "above" ? (
						<ArrowUpIcon className="h-4 w-4" />
					) : (
						<ArrowDownIcon className="h-4 w-4" />
					)}
				</Button>
				<Dropdown
					choices={sortOrderChoices}
					menuLabel="Sort by"
					choice={
						sortOrderChoices.find((el) => el.value === sortOrder) ??
						sortOrderChoices[0]
					}
					callback={(value) => setSortOrder(value)}
				/>
				<ToggleEye
					label="Hide selected champions"
					checked={!showSelectedChampions}
					onChange={toggleShowSelectedChampions}
				/>
				<div className="h-8 w-px bg-gray-500" />
				<TogglePill
					label={"Mastery Points"}
					checked={showMasteryPoints}
					onChange={toggleMasteryPoints}
				/>
				<TogglePill
					label={"Show Levels"}
					checked={showChampionLevels}
					onChange={toggleChampionLevels}
				/>
				<TogglePill
					label={"Mastery Borders"}
					checked={showMasteryBorders}
					onChange={toggleMasteryBorders}
				/>
				<div className="h-8 w-px bg-gray-500" />
				<div className="flex flex-col items-center gap-3">
					<Label>Image size</Label>
					<ScaleSlider />
				</div>
			</div>
			{/* Right (optional, can be empty) */}
			<div className="flex flex-1 justify-end" />
		</div>
	);
}
