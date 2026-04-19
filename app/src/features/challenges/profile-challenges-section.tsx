import { Link } from "@tanstack/react-router";
import { ChevronsUp, TrophyIcon } from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/components/utils";
import {
	buildChallengeLadderSegments,
	compareProfileChallengesByNearCompletion,
	computeProfileChallengeStats,
	formatChallengeTopPercentLabel,
	getProfileChallengeThresholdStripModel,
	isChallengeAtHighestTier,
	isLeftToMaxChallenge,
	type LadderSegment,
	type ProfileChallengeThresholdStripModel,
	type TierPillState,
} from "~/features/challenges/lib/profile-challenge-stats";
import type { ProfileChallengeRow } from "~/features/challenges/types/profile-challenge-row";
import { useDataDragonPath } from "~/features/shared/hooks/useDataDragonPath";

const CHALLENGE_TRACKER_PATH = "/$region/$username/challenge" as const;
const GLOBAL_CHALLENGE_LEADERBOARD_PATH = "/challenge/$challengeId" as const;

type TierFilter = "all" | "maxed" | "leftToMax";

function filterChipClass(active: boolean) {
	return cn(
		"-mx-0.5 inline rounded px-1 py-0.5 align-baseline text-muted-foreground transition-colors",
		"cursor-pointer underline decoration-dotted underline-offset-[3px] hover:text-foreground",
		active && "bg-muted text-foreground shadow-sm",
		"focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
	);
}

function tierTextColor(level: string | null): string | undefined {
	if (!level) return undefined;
	const key = level.toLowerCase();
	return `var(--tier-${key})`;
}

/**
 * Only `current` uses the primary border; cleared / next / upcoming all use the same neutral pill.
 * (Next = next threshold to hit; upcoming = later tiers — different logic, same look.)
 */
function tierPillClass(state: TierPillState) {
	return cn(
		"inline-flex shrink-0 items-center justify-center rounded-md border px-1 py-0.5 text-[8px] leading-none font-semibold tabular-nums sm:text-[9px]",
		state === "current"
			? "border-primary/50 bg-primary/12 text-foreground shadow-sm"
			: "border-border/50 bg-muted/50 text-muted-foreground",
	);
}

function ladderSeparator() {
	return (
		<span
			className="text-muted-foreground/45 shrink-0 px-px text-[10px] leading-none select-none"
			aria-hidden
		>
			·
		</span>
	);
}

function currentScorePillClass() {
	return cn(
		"inline-flex shrink-0 items-center rounded-md border-2 border-primary/40 bg-primary/12 px-1 py-0.5 sm:px-1.5",
		"text-[8px] font-bold leading-none tracking-tight tabular-nums shadow-sm sm:text-[9px]",
	);
}

function ChallengeTierThresholdPill({
	tier,
	points,
	index,
	pillStates,
	suppressTitle = false,
}: {
	tier: string;
	points: number;
	index: number;
	pillStates: TierPillState[];
	/** Avoid native tooltips competing with the ladder hover tooltip. */
	suppressTitle?: boolean;
}) {
	const state = pillStates[index] ?? "upcoming";
	const opacity = state === "current" ? 1 : 0.55;
	const c = tierTextColor(tier);
	return (
		<span
			className={tierPillClass(state)}
			title={
				suppressTitle ? undefined : `${tier}: ${points.toLocaleString()} pts`
			}
			style={c ? { color: c, opacity } : { opacity }}
		>
			{formatCompactChallengePoints(points)}
		</span>
	);
}

function formatCompactChallengePoints(n: number): string {
	if (!Number.isFinite(n)) return "—";
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 100_000) return `${Math.round(n / 1000)}k`;
	if (n >= 10_000) return `${(n / 1000).toFixed(1)}k`;
	return n.toLocaleString();
}

function ChallengeLadderPills({
	rowId,
	segments,
	strip,
	levelForScoreColor,
	suppressNativeTitles,
}: {
	rowId: number;
	segments: LadderSegment[];
	strip: ProfileChallengeThresholdStripModel;
	levelForScoreColor: string | null | undefined;
	suppressNativeTitles: boolean;
}) {
	return (
		<div className="text-muted-foreground flex max-w-full flex-nowrap items-center justify-end gap-x-px [scrollbar-width:thin]">
			{segments.map((seg, si) => (
				<Fragment key={`${rowId}-lad-${si}`}>
					{si > 0 ? ladderSeparator() : null}
					{seg.kind === "score" ? (
						<span
							className={currentScorePillClass()}
							title={suppressNativeTitles ? undefined : "Your score"}
							style={
								levelForScoreColor
									? { color: tierTextColor(levelForScoreColor) }
									: undefined
							}
						>
							{seg.value.toLocaleString()}
						</span>
					) : (
						<ChallengeTierThresholdPill
							tier={seg.entry.tier}
							points={seg.entry.points}
							index={seg.index}
							pillStates={strip.pillStates}
							suppressTitle={suppressNativeTitles}
						/>
					)}
				</Fragment>
			))}
		</div>
	);
}

function formatProgressCell(
	row: ProfileChallengeRow,
	challengesSynced: boolean,
	strip: ProfileChallengeThresholdStripModel,
) {
	if (!challengesSynced || row.progress === null) {
		return <span className="text-muted-foreground tabular-nums">—</span>;
	}
	const { level, value, percentile } = row.progress;
	const topLabel = percentile != null ? formatChallengeTopPercentLabel(percentile) : null;
	const stripShowsScore =
		strip.entries.length > 0 && strip.currentValue != null && challengesSynced;

	if (level == null && value == null && percentile == null) {
		return <span className="text-muted-foreground tabular-nums">—</span>;
	}

	if (stripShowsScore) {
		if (!topLabel) return null;
		return (
			<div className="flex flex-col items-end gap-px text-right leading-tight">
				<span className="text-muted-foreground text-[10px] font-medium tabular-nums tracking-tight">
					{topLabel}
				</span>
			</div>
		);
	}

	if (level == null && value == null && !topLabel) {
		return <span className="text-muted-foreground tabular-nums">—</span>;
	}

	return (
		<div className="flex flex-col items-end gap-px text-right leading-tight">
			{level ? (
				<span
					className="text-[10px] font-bold tracking-wide uppercase"
					style={{ color: tierTextColor(level) }}
				>
					{level}
				</span>
			) : null}
			{value != null ? (
				<span className="text-foreground text-xs font-semibold tabular-nums">
					{value.toLocaleString()}
				</span>
			) : null}
			{topLabel ? (
				<span className="text-muted-foreground text-[10px] tabular-nums">{topLabel}</span>
			) : null}
		</div>
	);
}

export interface ProfileChallengesSectionProps {
	rows: ProfileChallengeRow[];
	challengesSynced: boolean;
	dataDragonVersion: string;
	rawRegion: string;
	rawUsername: string;
	hubUsername: string;
}

export function ProfileChallengesSection({
	rows,
	challengesSynced,
	dataDragonVersion,
	rawRegion,
	rawUsername,
	hubUsername,
}: ProfileChallengesSectionProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [tierFilter, setTierFilter] = useState<TierFilter>("all");
	const [sortNearCompletion, setSortNearCompletion] = useState(false);
	const { getChallengeIcon } = useDataDragonPath(dataDragonVersion);

	useEffect(() => {
		if (!challengesSynced) {
			setTierFilter("all");
			setSortNearCompletion(false);
		}
	}, [challengesSynced]);

	const stats = useMemo(
		() => computeProfileChallengeStats(rows, challengesSynced),
		[rows, challengesSynced],
	);

	const tierFiltered = useMemo(() => {
		if (!challengesSynced) return rows;
		if (tierFilter === "all") return rows;
		if (tierFilter === "maxed") {
			return rows.filter((row) => isChallengeAtHighestTier(row, challengesSynced));
		}
		return rows.filter((row) => isLeftToMaxChallenge(row, challengesSynced));
	}, [rows, challengesSynced, tierFilter]);

	const filtered = useMemo(() => {
		const q = searchTerm.trim().toLowerCase();
		if (!q) return tierFiltered;
		return tierFiltered.filter((row) => {
			const inName = row.name.toLowerCase().includes(q);
			const inDesc = row.shortDescription?.toLowerCase().includes(q) ?? false;
			return inName || inDesc;
		});
	}, [tierFiltered, searchTerm]);

	const displayedRows = useMemo(() => {
		if (!challengesSynced || !sortNearCompletion) return filtered;
		return [...filtered].sort((a, b) =>
			compareProfileChallengesByNearCompletion(a, b, challengesSynced),
		);
	}, [filtered, challengesSynced, sortNearCompletion]);

	return (
		<section className="border-border bg-card overflow-hidden rounded-lg border shadow-sm">
			<div className="flex flex-col gap-4 px-6 pt-6 pb-5">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
					<h2 className="text-lg font-semibold tracking-tight shrink-0">Challenges</h2>
					<div
						className="text-muted-foreground -mx-0.5 flex min-w-0 flex-wrap items-baseline justify-start gap-x-3 gap-y-1 text-xs leading-relaxed sm:justify-end"
						role="group"
						aria-label="Filter challenges by progress"
					>
						{challengesSynced ? (
							<>
								<button
									type="button"
									className={cn(filterChipClass(tierFilter === "all"), "whitespace-nowrap")}
									onClick={() => setTierFilter("all")}
									title="Show all challenges"
									aria-pressed={tierFilter === "all"}
								>
									<span className="tabular-nums">{stats.total}</span> total
								</button>
								<button
									type="button"
									className={cn(filterChipClass(tierFilter === "maxed"), "whitespace-nowrap")}
									onClick={() => setTierFilter("maxed")}
									title="Show maxed challenges only"
									aria-pressed={tierFilter === "maxed"}
								>
									<span className="tabular-nums">{stats.maxed}</span> maxed
								</button>
								<button
									type="button"
									className={cn(filterChipClass(tierFilter === "leftToMax"), "whitespace-nowrap")}
									onClick={() => setTierFilter("leftToMax")}
									title="Show challenges still below top tier"
									aria-pressed={tierFilter === "leftToMax"}
								>
									<span className="tabular-nums">{stats.remainingToMax}</span> left to max
								</button>
							</>
						) : (
							<span className="whitespace-nowrap">
								<span className="tabular-nums font-medium text-foreground/90">
									{stats.total}
								</span>
								<span> in catalog</span>
							</span>
						)}
					</div>
				</div>

				{!challengesSynced ? (
					<p className="text-muted-foreground border-primary/20 bg-primary/5 text-sm leading-relaxed rounded-md border px-3 py-2.5">
						No challenge progress stored yet. Run{" "}
						<span className="text-foreground font-medium">Update profile</span> above,
						wait a moment, then refresh.
					</p>
				) : null}
			</div>

			<div className="border-border/80 flex flex-col gap-2 border-t px-6 py-3 sm:flex-row sm:items-center sm:gap-3">
				{challengesSynced ? (
					<Button
						type="button"
						variant="outline"
						size="sm"
						className={cn(
							"shrink-0 self-start border-dashed sm:self-auto",
							sortNearCompletion &&
								"border-primary/50 bg-primary/10 text-foreground border-solid shadow-sm",
						)}
						onClick={() => setSortNearCompletion((v) => !v)}
						title="Sort by how close each challenge is to its top tier (then maxed, then others)"
						aria-pressed={sortNearCompletion}
					>
						<ChevronsUp className="size-3.5 opacity-80" />
						Near top tier
					</Button>
				) : null}
				<Input
					type="search"
					placeholder="Search by name or description…"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="bg-background min-w-0 flex-1"
				/>
			</div>

			<div className="border-border h-[min(28rem,55vh)] shrink-0 overflow-hidden border-t">
				<TooltipProvider delayDuration={250}>
					<ul className="flex h-full min-h-0 flex-col overflow-y-auto overscroll-y-contain">
					{displayedRows.length === 0 ? (
						<li className="text-muted-foreground flex flex-1 flex-col items-center justify-center px-6 py-8 text-center text-sm">
							{tierFiltered.length === 0
								? "No challenges for this filter."
								: "No challenges match your search."}
						</li>
					) : (
						displayedRows.map((row) => {
							const strip = getProfileChallengeThresholdStripModel(row, challengesSynced);
							const maxed = isChallengeAtHighestTier(row, challengesSynced);
							const ladderSegments =
								strip.entries.length > 0
									? buildChallengeLadderSegments(strip.entries, strip.currentValue)
									: [];
							return (
								<li
									key={row.id}
									className={cn(
										"border-border bg-background/40 hover:bg-accent/30 border-b transition-colors last:border-b-0",
										maxed &&
											"border-l-emerald-500/70 bg-emerald-500/[0.05] hover:bg-emerald-500/[0.08] border-l-2",
									)}
								>
									<div className="flex flex-col gap-1 px-3 py-2 sm:px-5">
										<div className="flex w-full min-w-0 items-center gap-2">
											<div className="bg-muted/30 relative h-9 w-9 shrink-0 overflow-hidden rounded-md">
												<img
													src={getChallengeIcon(row.id, row.thresholds)}
													alt=""
													className="h-full w-full object-contain p-px"
													loading="lazy"
												/>
											</div>
											<div className="flex min-w-0 flex-1 flex-col gap-0.5">
												<Link
													to={CHALLENGE_TRACKER_PATH}
													params={{ region: rawRegion, username: rawUsername }}
													search={{ challengeId: row.id }}
													className="text-foreground hover:text-primary min-w-0 py-0.5 text-left text-[13px] leading-snug font-semibold transition-colors line-clamp-2"
												>
													{row.name}
												</Link>
												{row.shortDescription ? (
													<p className="text-muted-foreground line-clamp-1 text-[11px] leading-tight">
														{row.shortDescription}
													</p>
												) : null}
											</div>
											<div className="flex min-h-9 min-w-0 shrink-0 items-center gap-2">
												{strip.entries.length > 0 ? (
													<div className="flex min-h-0 min-w-0 max-w-[min(11rem,calc(100vw-8rem))] items-center justify-end sm:max-w-[min(18rem,calc(100vw-10rem))]">
														{strip.footerHint && !maxed ? (
															<Tooltip>
																<TooltipTrigger asChild>
																	<div
																		className="-m-0.5 flex max-w-full cursor-default items-center justify-end overflow-x-auto overflow-y-visible rounded-md p-0.5 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
																		tabIndex={0}
																	>
																		<ChallengeLadderPills
																			rowId={row.id}
																			segments={ladderSegments}
																			strip={strip}
																			levelForScoreColor={row.progress?.level}
																			suppressNativeTitles
																		/>
																	</div>
																</TooltipTrigger>
																<TooltipContent
																	side="top"
																	align="end"
																	sideOffset={6}
																	className="max-w-sm px-3 py-2.5 text-left"
																>
																	<p className="text-background/75 mb-1 text-[10px] font-semibold tracking-wide uppercase">
																		Progress to next tier
																	</p>
																	<p className="text-background text-sm leading-snug font-medium">
																		{strip.footerHint}
																	</p>
																</TooltipContent>
															</Tooltip>
														) : (
															<div className="flex max-w-full items-center justify-end overflow-x-auto overflow-y-visible">
																<ChallengeLadderPills
																	rowId={row.id}
																	segments={ladderSegments}
																	strip={strip}
																	levelForScoreColor={row.progress?.level}
																	suppressNativeTitles={false}
																/>
															</div>
														)}
													</div>
												) : null}
												<div className="flex shrink-0 items-center gap-1.5">
													{formatProgressCell(row, challengesSynced, strip)}
													<Link
														to={GLOBAL_CHALLENGE_LEADERBOARD_PATH}
														params={{ challengeId: String(row.id) }}
														search={{
															username: hubUsername.replace("#", "-"),
															region: rawRegion,
														}}
														className="text-muted-foreground hover:text-primary transition-colors"
														title="Leaderboard"
													>
														<TrophyIcon className="h-3.5 w-3.5" />
													</Link>
												</div>
											</div>
										</div>
									</div>
								</li>
							);
						})
					)}
					</ul>
				</TooltipProvider>
			</div>
		</section>
	);
}
