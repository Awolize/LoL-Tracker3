import { ChevronsUpDownIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Dropdown, type Choice } from "~/features/shared/components/dropdown";
import { TogglePill } from "~/features/shared/components/toggle-pill";
import { queueLabel } from "~/features/shared/queues";
import type { UserChampionOption } from "~/server/matches/match-participants";

import {
	DATE_RANGES,
	daysToSince,
	type MatchSearch,
	parseQueueParam,
	serialiseQueueParam,
	sinceToDays,
} from "./match-filters";

/**
 * Day counts rather than preset keys, because `Dropdown` carries numeric values. 0 means
 * "all time", which is also the sentinel the champion dropdown uses for "all champions".
 */
const RANGE_CHOICES: Choice[] = [
	{ text: "All time", value: 0 },
	...Object.entries(DATE_RANGES).map(([key, label]) => ({
		text: label,
		value: sinceToDays(key as keyof typeof DATE_RANGES),
	})),
];

interface Props {
	availableQueueIds: number[];
	availableChampions: UserChampionOption[];
	search: MatchSearch;
	onChange: (patch: Partial<MatchSearch>) => void;
	onClear: () => void;
}

export function MatchFilterBar({
	availableQueueIds,
	availableChampions,
	search,
	onChange,
	onClear,
}: Props) {
	const selectedQueues = parseQueueParam(search.queue) ?? [];

	const toggleQueue = (queueId: number) => {
		const next = selectedQueues.includes(queueId)
			? selectedQueues.filter((id) => id !== queueId)
			: [...selectedQueues, queueId];
		onChange({ queue: serialiseQueueParam(next) });
	};

	const queueSummary =
		selectedQueues.length === 0
			? "All queues"
			: selectedQueues.length === 1
				? queueLabel(selectedQueues[0] ?? 0)
				: `${selectedQueues.length} queues`;

	const championChoices: Choice[] = [
		{ text: "All champions", value: 0 },
		...availableChampions.map((champion) => ({
			text: `${champion.championName} (${champion.games})`,
			value: champion.championId,
		})),
	];
	const championChoice =
		championChoices.find((choice) => choice.value === (search.champion ?? 0)) ??
		championChoices[0]!;

	const rangeChoice =
		RANGE_CHOICES.find((choice) => choice.value === sinceToDays(search.since)) ??
		RANGE_CHOICES[0]!;

	const isFiltered = Boolean(search.queue || search.champion || search.result || search.since);

	return (
		<div className="flex flex-wrap items-center gap-2">
			{/* Queue is multi-select, so the menu stays open between clicks. */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="secondary" size="sm" className="flex flex-row gap-2">
						{queueSummary}
						<ChevronsUpDownIcon className="mt-[2px] h-5 w-5" aria-hidden="true" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-auto">
					<DropdownMenuLabel>Queue</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{availableQueueIds.length === 0 ? (
						<DropdownMenuLabel className="text-muted-foreground font-normal">
							No queues yet
						</DropdownMenuLabel>
					) : (
						availableQueueIds.map((queueId) => (
							<DropdownMenuCheckboxItem
								key={queueId}
								checked={selectedQueues.includes(queueId)}
								onCheckedChange={() => toggleQueue(queueId)}
								onSelect={(event) => event.preventDefault()}
							>
								{queueLabel(queueId)}
							</DropdownMenuCheckboxItem>
						))
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			<Dropdown
				choices={championChoices}
				choice={championChoice}
				callback={(value) => onChange({ champion: value === 0 ? undefined : value })}
				menuLabel="Champion"
			/>

			<div className="flex items-center gap-1.5">
				<TogglePill
					label="All"
					checked={!search.result}
					onChange={() => onChange({ result: undefined })}
				/>
				<TogglePill
					label="Wins"
					checked={search.result === "win"}
					onChange={() => onChange({ result: "win" })}
				/>
				<TogglePill
					label="Losses"
					checked={search.result === "loss"}
					onChange={() => onChange({ result: "loss" })}
				/>
			</div>

			<Dropdown
				choices={RANGE_CHOICES}
				choice={rangeChoice}
				callback={(value) =>
					onChange({ since: value === 0 ? undefined : daysToSince(value) })
				}
				menuLabel="Played"
			/>

			{isFiltered && (
				<Button variant="ghost" size="sm" onClick={onClear}>
					Clear filters
				</Button>
			)}
		</div>
	);
}
