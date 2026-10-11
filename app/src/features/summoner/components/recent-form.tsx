import { useState } from "react";

import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { cn } from "~/components/utils";
import { Dropdown, type Choice } from "~/features/shared/components/dropdown";
import { queueLabel } from "~/features/shared/queues";
import type { FormEntry } from "~/server/matches/match-participants";
import { getRecentFormFn } from "~/server/matches/mutations";

/** How much history the chart plots. Shared with the hub loader so the two cannot drift. */
export const RECENT_FORM_GAMES = 100;

/** Games in the rolling window behind each point on the line. */
const WINDOW = 10;
/**
 * Most recent results shown as pills. Half the fetched history, so the strip stays a readable
 * one-or-two-line block while the curve behind it shows a longer arc.
 */
const PILL_COUNT = 50;

const WIDTH = 600;
const HEIGHT = 140;
const PAD = 10;

/** The app's accent teal (also the `theme-color`). */
const ACCENT = "#4FB8B2";

/** Win rate over the trailing `WINDOW` games, at every game, as a percentage. */
const rollingWinRate = (entries: FormEntry[]): number[] =>
	entries.map((_, index) => {
		const window = entries.slice(Math.max(0, index - WINDOW + 1), index + 1);
		const wins = window.filter((entry) => entry.win).length;
		return (wins / window.length) * 100;
	});

/**
 * A path through `values`, each scaled to its own 0–100% height. `preserveAspectRatio="none"` lets
 * the chart fill any width, so strokes use `vector-effect="non-scaling-stroke"` to stay even.
 */
const toPath = (values: number[]): string => {
	const stepX = values.length > 1 ? (WIDTH - PAD * 2) / (values.length - 1) : 0;

	return values
		.map((value, index) => {
			const x = PAD + index * stepX;
			const y = HEIGHT - PAD - (value / 100) * (HEIGHT - PAD * 2);
			return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
		})
		.join(" ");
};

const toArea = (values: number[]): string => {
	const line = toPath(values);
	if (!line) return "";
	const stepX = values.length > 1 ? (WIDTH - PAD * 2) / (values.length - 1) : 0;
	const lastX = PAD + (values.length - 1) * stepX;
	return `${line} L${lastX.toFixed(1)},${HEIGHT - PAD} L${PAD},${HEIGHT - PAD} Z`;
};

/**
 * Recent form for a profile: a rolling win-rate curve over the last games, plus the individual
 * results as pills.
 *
 * A rolling window over games rather than a per-day trend, deliberately: stored history is thin per
 * patch (16.20 has 8 matches, 16.19 has 179), so a date-bucketed chart would be mostly gaps, while
 * a per-game window reads well whatever history a profile has.
 */
interface Props {
	entries: FormEntry[];
	puuid: string;
	/** Every queue the summoner has played, for the selector. */
	queueIds: number[];
}

export function RecentFormPanel({ entries, puuid, queueIds }: Props) {
	// The queue choice is local rather than a URL param: this is a widget on the profile rather than
	// a view of its own, so switching it refetches client-side instead of re-running the hub loader.
	const [queueId, setQueueId] = useState<number | undefined>(undefined);
	const [current, setCurrent] = useState<FormEntry[]>(entries);
	const [loading, setLoading] = useState(false);

	const selectQueue = async (value: number) => {
		const next = value === 0 ? undefined : value;
		setQueueId(next);
		setLoading(true);
		try {
			setCurrent(
				await getRecentFormFn({ data: { puuid, take: RECENT_FORM_GAMES, queueId: next } }),
			);
		} finally {
			setLoading(false);
		}
	};

	const queueChoices: Choice[] = [
		{ text: "All queues", value: 0 },
		...queueIds.map((id) => ({ text: queueLabel(id), value: id })),
	];
	const queueChoice =
		queueChoices.find((choice) => choice.value === (queueId ?? 0)) ?? queueChoices[0]!;

	// Stay mounted when a queue has too little history, so the selector cannot strand the visitor
	// on a chart that is not there.
	if (current.length < 2) {
		return (
			<Card className="gap-4 py-4">
				<CardHeader className="px-4 pb-0">
					<h3 className="text-lg font-semibold">Recent form</h3>
					<p className="text-muted-foreground text-sm">
						Not enough stored games in this queue to plot a trend.
					</p>
				</CardHeader>
				<CardContent className="px-4">
					<Dropdown
						choices={queueChoices}
						choice={queueChoice}
						callback={selectQueue}
						menuLabel="Queue"
					/>
				</CardContent>
			</Card>
		);
	}

	const winRates = rollingWinRate(current);
	const linePath = toPath(winRates);
	const areaPath = toArea(winRates);

	const wins = current.filter((entry) => entry.win).length;
	const overallRate = Math.round((wins / current.length) * 100);
	const currentRate = Math.round(winRates[winRates.length - 1] ?? 0);
	const trendUp = currentRate >= overallRate;

	const recent = [...current].reverse().slice(0, PILL_COUNT);

	return (
		<Card className="gap-4 py-4">
			<CardHeader className="px-4 pb-0">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div>
						<h3 className="text-lg font-semibold">Recent form</h3>
						<p className="text-muted-foreground text-sm">
							Win rate over each rolling {WINDOW}-game window, across the last{" "}
							{current.length} games
							{queueId === undefined ? "" : ` in ${queueLabel(queueId)}`}
						</p>
					</div>
					<div className="flex flex-wrap items-center gap-3">
						<div className="flex items-baseline gap-2">
							<span
								className={cn(
									"text-2xl font-bold",
									trendUp
										? "text-emerald-600 dark:text-emerald-400"
										: "text-red-600 dark:text-red-400",
								)}
							>
								{currentRate}%
							</span>
							<span className="text-muted-foreground text-sm">
								now · {overallRate}% overall
							</span>
						</div>
						<Dropdown
							choices={queueChoices}
							choice={queueChoice}
							callback={selectQueue}
							menuLabel="Queue"
						/>
					</div>
				</div>
			</CardHeader>

			<CardContent className={cn("px-4 transition-opacity", loading && "opacity-50")}>
				<svg
					viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
					preserveAspectRatio="none"
					className="h-36 w-full"
					role="img"
					aria-label={`Rolling ${WINDOW}-game win rate over the last ${current.length} games, currently ${currentRate}%`}
				>
					<defs>
						<linearGradient id="form-fill" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor={ACCENT} stopOpacity="0.45" />
							<stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
						</linearGradient>
					</defs>

					{/* 50% guide, so "above/below even" is readable at a glance. */}
					<line
						x1={PAD}
						x2={WIDTH - PAD}
						y1={HEIGHT / 2}
						y2={HEIGHT / 2}
						className="text-border"
						stroke="currentColor"
						strokeDasharray="4 6"
						vectorEffect="non-scaling-stroke"
					/>

					<path d={areaPath} fill="url(#form-fill)" />
					<path
						d={linePath}
						fill="none"
						stroke={ACCENT}
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round"
						vectorEffect="non-scaling-stroke"
					/>
				</svg>

				<div className="mt-3 flex flex-wrap items-center gap-1">
					{recent.map((entry) => (
						<span
							key={entry.gameId}
							title={`${entry.win ? "Win" : "Loss"} · ${entry.kills}/${entry.deaths}/${entry.assists} · ${entry.cs} cs`}
							className={cn(
								"grid h-5 w-5 place-items-center rounded text-[10px] font-bold",
								entry.win
									? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
									: "bg-red-500/15 text-red-600 dark:text-red-400",
							)}
						>
							{entry.win ? "W" : "L"}
						</span>
					))}
					<span className="text-muted-foreground ml-1 text-xs">
						most recent {recent.length} games
					</span>
				</div>
			</CardContent>
		</Card>
	);
}
