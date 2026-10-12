import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

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
	rows: LadderBoardRow[];
	/** Real number of ranked players on the selected board, never the capped row count. */
	population: number;
	/**
	 * Which ladder is on screen.
	 *
	 * `fallback` only ever reaches here when Riot cannot be read, and it has to say so or the
	 * board would be presenting our 55 synced profiles as if they were Riot's regional ladder.
	 */
	ladder: "riot" | "fallback";
	/** "GLOBAL" for the merged board, otherwise a Riot platform id. */
	selectedRegion: LadderRegionId | "GLOBAL";
	onRegionChange: (region: LadderRegionId | "GLOBAL") => void;
	/** True when Riot truncated an apex tier at its page size - the tail is missing. */
	truncated: boolean;
	/** True while rows beyond the ones rendered exist on the server. */
	hasMore?: boolean;
	/** Loads the next page. Absent when there is nothing more, or the board is not paged. */
	onLoadMore?: () => void;
	/** Rows already shown on earlier pages, so rank numbering continues rather than restarting. */
	rankOffset?: number;
	highlightedUser?: { username: string; region: string };
}

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
	/** Rows already rendered above this one, so the rank continues across sections. */
	offset: number;
	highlightedUsername: string | null;
	highlightedRegion: string | null;
	getPlayerTier: (value: number) => string | null;
	getProfileImage: (id: string) => string;
}

const LeaderboardRow = ({
	entry,
	index,
	offset,
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
				{/* Position within the board on screen, so a region board counts 1, 2, 3... rather
				    than showing the rank it held on the merged board. */}
				<div
					className={`w-10 text-center font-mono text-sm ${
						isHighlighted ? "text-foreground font-bold" : "text-muted-foreground/70"
					}`}
				>
					{offset + index + 1}
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
	rows,
	population,
	ladder,
	selectedRegion,
	onRegionChange,
	truncated,
	hasMore = false,
	onLoadMore,
	rankOffset = 0,
	highlightedUser,
}: ChallengeLeaderboardProps) {
	const { data: version = "15.24.1" } = useQuery({
		queryKey: ["dd-version"],
		queryFn: getDataDragonVersion,
	});

	const { getProfileImage, getChallengeIcon } = useDataDragonPath(version);

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
					</div>

					{/* The real population, counted for this board - never the page size. */}
					<span className="text-muted-foreground font-mono text-xs">
						{population.toLocaleString()}{" "}
						{population === 1 ? "summoner ranked" : "summoners ranked"}
						{population > rows.length && ` · ${rows.length} shown`}
						{truncated && " · Master tier capped by Riot"}
					</span>
				</div>
				<div className="bg-background/50 overflow-hidden rounded-xl border shadow-sm">
					<div className="flex flex-col">
						{rows.map((entry, index) => (
							<LeaderboardRow
								key={`${entry.region}-${entry.puuid}`}
								entry={entry}
								index={index}
								offset={rankOffset}
								highlightedUsername={normalizedUsername}
								highlightedRegion={normalizedRegion}
								getPlayerTier={getPlayerTier}
								getProfileImage={getProfileImage}
							/>
						))}

						{rows.length === 0 && (
							<div className="text-muted-foreground flex flex-col items-center justify-center py-12">
								<p className="text-sm">No players found</p>
								{ladder === "fallback" && (
									<p className="mt-1 text-xs">
										Nobody tracked has a recorded value for this challenge here.
									</p>
								)}
							</div>
						)}

						{/* Only offered while rows remain: Riot caps a tier at its page size, so the
						    ladder can end before the population count does, and a control here would
						    promise rows that do not exist. */}
						{hasMore && onLoadMore && (
							<div className="border-border/40 flex justify-center border-t p-3">
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={onLoadMore}
								>
									Load more
								</Button>
							</div>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
