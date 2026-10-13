import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Button } from "~/components/ui/button";
import {
	LADDER_REGIONS,
	ladderRegionLabel,
	type LadderRegionId,
} from "~/features/challenges/ladder-regions";
import { regionToDisplay } from "~/features/shared/champs";
import { Dropdown, type Choice } from "~/features/shared/components/dropdown";
import { useDataDragonPath } from "~/features/shared/hooks/useDataDragonPath";
import { parseRiotId } from "~/features/shared/riot-id";
import type { ChallengeConfig } from "~/features/shared/types";
import {
	getChallengeLadderFn,
	getChallengeLadderStatusFn,
	type LadderStatus,
} from "~/server/api/get-challenge-ladder.api";
import { getDataDragonVersion } from "~/server/api/mutations";

/**
 * The row shape the board renders, whichever ladder produced it.
 *
 * Deliberately not the Drizzle row: an official Riot ladder entry carries only a puuid, so a row
 * may have no name at all. `summoner` null means "Riot ranked this player and we do not track
 * them" - the row still renders, it just cannot link anywhere.
 */
export interface LadderBoardRow {
	puuid: string;
	value: number;
	region: string;
	/** The Riot ID Riot ranks here, present whether or not we hold a profile for it. */
	riotId: { gameName: string; tagLine: string } | null;
	summoner: {
		puuid: string;
		gameName: string | null;
		tagLine: string | null;
		region: string;
		profileIconId: number;
	} | null;
}

interface ChallengeLeaderboardProps {
	config: ChallengeConfig;
	/** Page one, rendered on the server so the page still has content without JS. */
	firstPage: LadderBoardRow[];
	/** Real number of ranked players on the selected board, never the capped row count. */
	population: number;
	/**
	 * True when the board has never been read and a sync is building it.
	 *
	 * This is the first-visit case, and it replaces the old tracked-fallback board - which showed a
	 * first-time visitor ~59 rows of our own synced population as though it were the ladder, the
	 * exact "small board pretending to be a ranking" trap this page keeps having to avoid.
	 */
	preparing?: boolean;
	/**
	 * True when Riot publishes no leaderboard for this challenge, so the rows are the tracker's own.
	 *
	 * Not the same as "empty": Riot answers 200 with an empty list for every shard and tier, so a
	 * board drawn from that reads as "0 summoners ranked" and looks broken. 223 of the 405 tracked
	 * challenges are in this state, so it is the common case, not an edge. There is no official
	 * ladder to be confused with, so what is shown is `Challenge`'s own synced values - a smaller,
	 * slower-moving sample - and every label here says so.
	 */
	unranked?: boolean;
	/** Which challenge this board belongs to; used to poll a board that has no snapshot yet. */
	challengeId: number;
	/** "GLOBAL" for the merged board, otherwise a Riot platform id. */
	selectedRegion: LadderRegionId | "GLOBAL";
	onRegionChange: (region: LadderRegionId | "GLOBAL") => void;
	/** True when Riot truncated an apex tier at its page size - the tail is missing. */
	truncated: boolean;
	/** True while rows beyond page one exist. Seeds the "load more" state for this board. */
	hasMore: boolean;
	highlightedUser?: { username: string; region: string };
}

/**
 * How often a board being built is checked, and how long we keep checking.
 *
 * Measured on a cold board: rows at ~46 s and names another ~40 s later, so the ceiling is a few
 * times the whole sequence rather than a guess. The poll stops early the moment both land; the
 * ceiling exists so a challenge whose names never resolve shows its rows instead of spinning.
 */
const PREPARING_POLL_MS = 4000;
const PREPARING_POLL_CEILING_MS = 5 * 60 * 1000;

/**
 * Watch a board being built, and invalidate the route once there is something worth showing.
 *
 * Only mounts while `preparing`, so a board with rows never polls: SWR keeps serving the stale
 * snapshot it has, and a spinner over rows we already have would be strictly worse than the rows.
 *
 * Two conditions, both required, plus one escape. The sync publishes rows first and Account-v1
 * names in a later pass, so stopping at "rows exist" would swap in thousands of raw puuids and
 * leave the reader to reload again - the same problem one step later. A board that came back with
 * **no rows at all** is the second escape: there is nothing to name, so waiting for `named > 0`
 * means polling for the whole five-minute ceiling before showing an empty board. That was every
 * unranked challenge - the common case - and it is what a reader experiences as "it never loads".
 * The ceiling stays as the last resort for a challenge whose names never resolve.
 */
const usePreparingBoard = (challengeId: number, active: boolean) => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const status = useQuery({
		queryKey: ["ladderStatus", challengeId],
		queryFn: () => getChallengeLadderStatusFn({ data: { challengeId } }),
		enabled: active,
		refetchInterval: (query) => {
			const data = query.state.data as LadderStatus | undefined;
			if (!data) return PREPARING_POLL_MS;
			// Rows and at least one name, or a board with no rows to name: worth swapping in.
			if (data.ready && (data.named > 0 || data.rows === 0)) return false;
			return PREPARING_POLL_MS;
		},
	});

	const startedAt = useRef<number | null>(null);
	if (active && startedAt.current === null) startedAt.current = Date.now();
	const timedOut =
		startedAt.current !== null && Date.now() - startedAt.current > PREPARING_POLL_CEILING_MS;

	const data = status.data;
	const worthShowing =
		data !== undefined && data.ready && (data.named > 0 || data.rows === 0 || timedOut);

	useEffect(() => {
		if (!active || !worthShowing) return;
		// Re-run the loader so the real rows replace this placeholder, and drop the status query so
		// a later cold board starts clean.
		queryClient.removeQueries({ queryKey: ["ladderStatus", challengeId] });
		router.invalidate();
	}, [active, worthShowing, challengeId, queryClient, router]);

	return { rows: data?.rows ?? 0, named: data?.named ?? 0 };
};

/**
 * How far ahead of the viewport the next page starts loading.
 *
 * A screen's worth, so the rows are usually there by the time the reader arrives rather than
 * appearing under the scroll. Deliberately not larger: the fetch is what decides how far the board
 * can run ahead of a reader, and one page per screenful keeps that honest.
 */
const LOAD_MORE_ROOT_MARGIN = "600px";

/**
 * Fire `load` when the marker scrolls into view.
 *
 * The marker is the "Load more" button, which stays rendered and focusable: an infinite scroll with
 * no control is unreachable by keyboard, and it is also the fallback if this observer never fires.
 *
 * `active` is what stops a scroll from queueing the same page twice - it goes false while a fetch is
 * in flight, and the observer is torn down rather than left to re-fire. The callback is held in a
 * ref so re-creating it every render (it closes over the row count) cannot reconnect the observer
 * and fire an extra load per render, which is the trap this hook exists to avoid.
 */
const useLoadMoreOnScroll = (active: boolean, load: () => void) => {
	const marker = useRef<HTMLDivElement | null>(null);
	const latestLoad = useRef(load);

	useEffect(() => {
		latestLoad.current = load;
	});

	useEffect(() => {
		const element = marker.current;
		if (!active || !element) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) latestLoad.current();
			},
			{ rootMargin: LOAD_MORE_ROOT_MARGIN },
		);
		observer.observe(element);
		return () => observer.disconnect();
	}, [active]);

	return marker;
};

// --- Animation Variants ---
const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.05,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 10 },
	show: { opacity: 1, y: 0 },
};

// --- Constants ---
const TIER_ORDER = [
	"IRON",
	"BRONZE",
	"SILVER",
	"GOLD",
	"PLATINUM",
	"DIAMOND",
	"MASTER",
	"GRANDMASTER",
	"CHALLENGER",
];

const GLOBAL_CHOICE: Choice = { text: "Global (all regions)", value: -1 };

/** Data Dragon's default (id 29) rather than a broken image for a player we do not track. */
const DEFAULT_PROFILE_ICON_ID = 29;

/**
 * The region list, as dropdown choices.
 *
 * Built from the shared `LADDER_REGIONS` so the list the UI offers and the list the server
 * fetches cannot drift. The underlying field is a string id, not a number, so the shared numeric
 * `Choice` shape carries the index and the id is recovered from the same array.
 */
const REGION_CHOICES: Choice[] = [
	GLOBAL_CHOICE,
	...LADDER_REGIONS.map((region, index) => ({ text: region.label, value: index })),
];

/** Helper to get the CSS variable string for a tier */
const getTierVar = (tier: string) => `var(--tier-${tier.toLowerCase()})`;

// --- Tier Badge Component ---
interface TierBadgeProps {
	tier: string;
	points: number;
	iconUrl: string;
	exists: boolean;
}

const TierBadge = ({ tier, points, iconUrl, exists }: TierBadgeProps) => {
	// If the tier doesn't exist, use a muted gray. If it does, use the tier color.
	const tierColor = exists ? getTierVar(tier) : "var(--border)";

	return (
		<motion.div
			variants={itemVariants}
			// Snappy, lightweight spring configuration for high-performance feel
			transition={{ type: "spring", stiffness: 700, damping: 25, mass: 0.5 }}
			// Subtle scale + lift to avoid "floating" or blurry look
			whileHover={exists ? { scale: 1.02, y: -3 } : undefined}
			className={`flex flex-col items-center justify-center rounded-md border px-3 py-3 transition-colors duration-200 ${exists ? "opacity-100" : "opacity-40 grayscale-[0.8]"} `}
			style={{
				borderColor: tierColor,
				// If disabled, very subtle background. If active, tinted background.
				backgroundColor: exists
					? `color-mix(in oklab, ${tierColor} 10%, transparent)`
					: "rgba(0,0,0,0.02)",
			}}
		>
			<img
				src={iconUrl}
				alt={tier}
				loading="lazy"
				className="mb-2 h-8 w-8 object-contain drop-shadow-md"
				onError={(e) => {
					// Fallback for missing images
					e.currentTarget.style.display = "none";
					e.currentTarget.parentElement?.classList.add("no-icon");
				}}
			/>

			<div
				className={`mb-0.5 text-xs font-bold tracking-wider uppercase ${
					exists ? "text-white" : "text-muted-foreground"
				}`}
				style={exists ? { textShadow: "0 1px 2px rgba(0,0,0,0.5)" } : undefined}
			>
				{tier}
			</div>

			<div
				className={`font-mono text-sm font-bold ${exists ? "text-white" : "text-muted-foreground"}`}
				style={exists ? { textShadow: "0 1px 2px rgba(0,0,0,0.5)" } : undefined}
			>
				{exists ? points.toLocaleString() : "-"}
			</div>
		</motion.div>
	);
};

// --- Leaderboard Row Component ---
interface LeaderboardRowProps {
	entry: LadderBoardRow;
	index: number;
	highlightedUsername: string | null;
	highlightedRegion: string | null;
	getPlayerTier: (value: number) => string | null;
	getProfileImage: (id: string) => string;
}

const LeaderboardRow = ({
	entry,
	index,
	highlightedUsername,
	highlightedRegion,
	getPlayerTier,
	getProfileImage,
}: LeaderboardRowProps) => {
	const rowRef = useRef<HTMLDivElement>(null);
	const displayName = entry.riotId?.gameName ?? entry.summoner?.gameName ?? null;
	const entryUsername =
		entry.riotId !== null ? `${entry.riotId.gameName}#${entry.riotId.tagLine}` : null;

	const isHighlighted = Boolean(
		highlightedUsername &&
		highlightedRegion &&
		entryUsername &&
		entryUsername.toLowerCase() === highlightedUsername.toLowerCase() &&
		regionToDisplay(entry.region).toUpperCase() === highlightedRegion.toUpperCase(),
	);

	const tier = getPlayerTier(entry.value);
	const tierKey = tier?.toLowerCase() || "iron";
	const tierVar = tier ? `var(--tier-${tierKey})` : "var(--muted-foreground)";

	useEffect(() => {
		if (isHighlighted && rowRef.current) {
			rowRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}, [isHighlighted]);

	const rowStyle = {
		backgroundColor: isHighlighted
			? `color-mix(in oklab, ${tierVar} 15%, transparent)`
			: `color-mix(in oklab, ${tierVar} 3%, transparent)`,
		borderTopColor: isHighlighted
			? `color-mix(in oklab, ${tierVar} 50%, transparent)`
			: undefined,
		borderBottomColor: isHighlighted
			? `color-mix(in oklab, ${tierVar} 50%, transparent)`
			: undefined,
	};

	return (
		<motion.div
			ref={rowRef}
			// Fade in from left
			initial={{ opacity: 0, x: -10 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true, margin: "-5%" }}
			transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
			className={`group flex items-center justify-between px-4 py-2 text-sm transition-colors duration-200 ${
				isHighlighted
					? "relative z-10 border-y"
					: "border-border/40 border-b last:border-0 hover:brightness-105"
			} `}
			style={rowStyle}
		>
			{/* Pulse Effect for Highlighted User */}
			{isHighlighted && (
				<motion.div
					className="pointer-events-none absolute inset-0"
					animate={{ opacity: [0.1, 0.2, 0.1] }}
					transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
					style={{ backgroundColor: tierVar }}
				/>
			)}

			<div className="relative z-10 flex items-center gap-4">
				{/* The board always renders from rank 1, so the row's own index is its rank. */}
				<div
					className={`w-10 text-center font-mono text-sm ${
						isHighlighted ? "text-foreground font-bold" : "text-muted-foreground/70"
					}`}
				>
					{index + 1}
				</div>

				{/* Avatar & Info */}
				<div className="flex items-center gap-3">
					<div className="relative">
						<img
							src={getProfileImage(
								String(entry.summoner?.profileIconId ?? DEFAULT_PROFILE_ICON_ID),
							)}
							alt=""
							loading="lazy"
							className="bg-muted h-8 w-8 rounded-full border-2 object-cover"
							style={{ borderColor: tierVar }}
						/>
					</div>

					<div className="flex flex-col justify-center">
						<div className="flex items-center gap-1.5">
							<Link
								to="/$region/$username"
								params={{
									region: entry.region,
									username: `${entry?.riotId?.gameName || "Unknown"}-${entry?.riotId?.tagLine || ""}`,
								}}
								className={`hover:text-primary max-w-[200px] truncate font-medium transition-colors hover:underline ${
									isHighlighted
										? "text-foreground font-bold"
										: "text-foreground/90"
								}`}
							>
								{displayName || "Unknown"}
							</Link>
						</div>
						<div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-[10px] leading-none">
							<span className="text-[9px] font-semibold tracking-wider uppercase">
								{regionToDisplay(entry.region)}
							</span>
							{entry.riotId && (
								<>
									<span className="text-border">|</span>
									<span className="opacity-80">#{entry.riotId.tagLine}</span>
								</>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Points & Tier Name */}
			<div className="relative z-10 text-right">
				<div
					className={`font-mono font-medium tracking-tight ${
						isHighlighted ? "text-foreground" : "text-foreground/80"
					}`}
				>
					{entry.value.toLocaleString()}
				</div>
				<div
					className="mt-0.5 text-[10px] leading-none font-bold tracking-wide capitalize"
					style={{ color: tierVar }}
				>
					{tier?.toLowerCase()}
				</div>
			</div>
		</motion.div>
	);
};

// --- Main Export ---
export default function ChallengeLeaderboard({
	config,
	firstPage,
	population,
	preparing = false,
	unranked = false,
	challengeId,
	selectedRegion,
	onRegionChange,
	truncated,
	hasMore,
	highlightedUser,
}: ChallengeLeaderboardProps) {
	const { data: version = "15.24.1" } = useQuery({
		queryKey: ["dd-version"],
		queryFn: getDataDragonVersion,
	});

	const { getProfileImage, getChallengeIcon } = useDataDragonPath(version);

	// Only polls while this board has never been read; a board with rows never mounts it.
	const preparingProgress = usePreparingBoard(challengeId, preparing);

	// Page one is server-rendered; everything after it is fetched a page at a time and appended
	// here. The caller remounts this component when the board changes, which is what clears them -
	// same contract as the match history section.
	const [extraRows, setExtraRows] = useState<LadderBoardRow[]>([]);
	const [nextPage, setNextPage] = useState(2);
	const [loading, setLoading] = useState(false);
	const [exhausted, setExhausted] = useState(!hasMore);
	const [error, setError] = useState<string | null>(null);

	const rows = [...firstPage, ...extraRows];

	/**
	 * Fetch and append the next page.
	 *
	 * Appended rows are de-duplicated against everything already on the board. The snapshot is
	 * replaced wholesale when the daily refresh lands, so a page fetched either side of one can
	 * repeat a row - and a repeated row is a duplicate React key, which renders it twice.
	 */
	const loadMore = async () => {
		if (loading || exhausted) return;

		setLoading(true);
		setError(null);
		try {
			const result = await getChallengeLadderFn({
				data: {
					challengeId,
					region: selectedRegion === "GLOBAL" ? null : selectedRegion,
					page: nextPage,
				},
			});

			// A cold board cannot happen here - a board with rows has a snapshot - but the union
			// leaves no way to read rows without ruling it out.
			if (result.state !== "ready") {
				throw new Error("This leaderboard is being prepared");
			}

			setExtraRows((current) => {
				const seen = new Set(
					[...firstPage, ...current].map((row) => `${row.region}-${row.puuid}`),
				);
				return [
					...current,
					...result.rows.filter((row) => !seen.has(`${row.region}-${row.puuid}`)),
				];
			});
			setNextPage((page) => page + 1);
			if (!result.hasMore) setExhausted(true);
		} catch {
			setError("Could not load more of this leaderboard - try again in a moment.");
		} finally {
			setLoading(false);
		}
	};

	// Only while there is something left to fetch: an exhausted board has no observer at all, so
	// reaching the bottom of a 379-row region board cannot spin.
	const loadMoreMarker = useLoadMoreOnScroll(!exhausted && rows.length > 0, loadMore);

	// Riot's own thresholds are the tier boundaries, and they apply to either board: a value is
	// worth the same wherever we read it from. Derived rather than memoised - it is an array of
	// at most nine entries.
	const thresholds = config.config.thresholds as Record<string, number>;
	const activeThresholds = Object.entries(thresholds).sort(
		([tierA], [tierB]) => TIER_ORDER.indexOf(tierA) - TIER_ORDER.indexOf(tierB),
	);

	// Find the player's current tier based on their points
	const getPlayerTier = (value: number) => {
		for (let i = activeThresholds.length - 1; i >= 0; i--) {
			const [tier, threshold] = activeThresholds[i];
			if (value >= threshold) return tier;
		}
		return null; // Below minimum threshold
	};

	const normalizedUsername = highlightedUser ? parseRiotId(highlightedUser.username) : null;
	const normalizedRegion = highlightedUser
		? regionToDisplay(highlightedUser.region).toUpperCase()
		: null;

	const selectedChoice =
		selectedRegion === "GLOBAL"
			? GLOBAL_CHOICE
			: (REGION_CHOICES.find((choice) => choice.text === ladderRegionLabel(selectedRegion)) ??
				GLOBAL_CHOICE);

	return (
		<div className="flex flex-col gap-6">
			{/* Tiers Grid */}
			<section>
				<h3 className="text-muted-foreground mb-3 px-1 text-sm font-semibold tracking-widest uppercase">
					Thresholds
				</h3>
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="show"
					className="xs:grid-cols-3 grid grid-cols-2 gap-2 tracking-tight select-none sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
				>
					{/* Display Tiers Highest to Lowest (Challenger -> Iron) */}
					{[...TIER_ORDER].reverse().map((tier) => {
						const points = thresholds[tier];
						const exists = points !== undefined;

						return (
							<TierBadge
								key={tier}
								tier={tier}
								points={points || 0}
								exists={exists}
								// Pass a single-entry object to force the hook to return this tier's icon
								iconUrl={getChallengeIcon(config.config.id, { [tier]: 1 })}
							/>
						);
					})}
				</motion.div>
			</section>

			{/* Leaderboard List */}
			<section>
				<div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 px-1">
					<div className="flex items-center gap-3">
						<h3 className="text-muted-foreground text-sm font-semibold tracking-widest uppercase">
							Challenge Points Leaderboard
						</h3>

						{/* Neither control means anything without a ladder: there is no regional board
						    to choose between and no population to count. */}
						{!unranked && (
							<Dropdown
								choices={REGION_CHOICES}
								choice={selectedChoice}
								menuLabel="Region"
								callback={(value) => {
									if (value < 0) {
										onRegionChange("GLOBAL");
										return;
									}
									const region = LADDER_REGIONS[value];
									if (region) onRegionChange(region.id);
								}}
							/>
						)}
					</div>

					{/* The real population, counted for this board - never the page size. A tracked
					    board counts the summoners this tracker follows, and says so, because that is
					    a different and much smaller thing than a ladder. */}
					<span className="text-muted-foreground font-mono text-xs">
						{unranked ? (
							<>
								Ranked among the {population.toLocaleString()} summoners this
								tracker follows
							</>
						) : (
							<>
								{population.toLocaleString()}{" "}
								{population === 1 ? "summoner ranked" : "summoners ranked"}
								{population > rows.length && ` · ${rows.length} shown`}
								{truncated && " · Master tier capped by Riot"}
							</>
						)}
					</span>
				</div>

				{/* Why this board is not Riot's, stated before the rows rather than after them. */}
				{unranked && rows.length > 0 && (
					<p className="text-muted-foreground bg-muted/40 mb-3 rounded-lg px-3 py-2 text-xs leading-relaxed">
						Riot does not run a leaderboard for this challenge. This is the tracker's
						own ranking, built from the challenge values it has synced for the summoners
						it follows - so it moves only when one of those profiles is refreshed, not
						when Riot's ladder does.
					</p>
				)}
				<div className="bg-background/50 overflow-hidden rounded-xl border shadow-sm">
					<div className="flex flex-col">
						{rows.map((entry, index) => (
							<LeaderboardRow
								key={`${entry.region}-${entry.puuid}`}
								entry={entry}
								index={index}
								highlightedUsername={normalizedUsername}
								highlightedRegion={normalizedRegion}
								getPlayerTier={getPlayerTier}
								getProfileImage={getProfileImage}
							/>
						))}

						{rows.length === 0 && (
							<div className="text-muted-foreground flex flex-col items-center justify-center gap-1 py-12">
								<p className="text-sm">
									{unranked
										? "Nobody this tracker follows has a value for this challenge yet"
										: preparing
											? "Preparing this leaderboard"
											: "No players found"}
								</p>
								{unranked && (
									<p className="max-w-md text-center text-xs">
										Riot does not run a leaderboard for this challenge either,
										so this board is built from the challenge values the tracker
										syncs when one of the profiles it follows is refreshed - and
										none of them has a value for this one yet.
									</p>
								)}
								{preparing && (
									<p className="max-w-sm text-center text-xs">
										{preparingProgress.rows > 0
											? `${preparingProgress.rows.toLocaleString()} players read, naming them now - this page updates itself.`
											: "Nobody has opened this board before, so it is being read from Riot. That usually takes about a minute, and this page updates itself."}
									</p>
								)}
							</div>
						)}

						{/* The marker is this button, so scrolling loads as soon as it comes into view -
						    and it stays a real button for anyone driving the page by keyboard, or if
						    the observer never fires. Only rendered while rows remain: Riot caps a tier
						    at its page size, so the ladder can end before the population count does. */}
						{!exhausted && rows.length > 0 && (
							<div
								ref={loadMoreMarker}
								className="border-border/40 flex flex-col items-center gap-2 border-t p-3"
							>
								{error && <p className="text-sm text-red-500">{error}</p>}
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={loadMore}
									disabled={loading}
								>
									{loading ? "Loading…" : "Load more"}
								</Button>
							</div>
						)}

						{/* The end of the list, stated rather than left to the reader to infer. When Riot
						    caps a tier this is as far as the ladder goes, and saying so stops the
						    control from implying rows exist that Riot will never return. */}
						{exhausted && rows.length > 0 && (
							<p className="text-muted-foreground/70 border-border/40 border-t px-1 py-3 text-center text-xs">
								{truncated
									? `End of the board - all ${rows.length.toLocaleString()} ranked players shown. Riot caps the Master tier, so this ladder ends here.`
									: `End of the board - all ${population.toLocaleString()} ranked players shown.`}
							</p>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
