import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { StarIcon } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { regionToDisplay } from "~/features/shared/champs";
import { useDataDragonPath } from "~/features/shared/hooks/useDataDragonPath";
import type { ChallengeConfig, LeaderboardEntry } from "~/features/shared/types";
import { getDataDragonVersion } from "~/server/api/mutations";

interface ChallengeLeaderboardProps {
	config: ChallengeConfig;
	leaderboard: LeaderboardEntry[];
	hasSections: boolean;
	challengeId: number;
	highlightedUser?: {
		username: string;
		region: string;
	};
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

// Helper to get the CSS variable string for a tier
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
				{exists ? points.toLocaleString() : "—"}
			</div>
		</motion.div>
	);
};

// --- Leaderboard Row Component ---
interface LeaderboardRowProps {
	entry: LeaderboardEntry;
	index: number;
	offset?: number;
	highlightedUsername?: string | null;
	highlightedRegion?: string | null;
	getPlayerTier: (value: number) => string | null;
	getProfileImage: (id: string) => string;
}

const LeaderboardRow = ({
	entry,
	index,
	offset = 0,
	highlightedUsername,
	highlightedRegion,
	getPlayerTier,
	getProfileImage,
}: LeaderboardRowProps) => {
	const rowRef = useRef<HTMLDivElement>(null);
	const actualIndex = offset + index;
	const entryUsername = `${entry.summoner.gameName}#${entry.summoner.tagLine}`;

	const isHighlighted =
		highlightedUsername &&
		highlightedRegion &&
		entryUsername === highlightedUsername &&
		regionToDisplay(entry.summoner.region).toUpperCase() === highlightedRegion;

	const tier = getPlayerTier(entry.challenge.value ?? 0);
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
				{/* Rank */}
				<div
					className={`w-6 text-center font-mono text-sm ${
						isHighlighted ? "text-foreground font-bold" : "text-muted-foreground/70"
					}`}
				>
					{actualIndex + 1}
				</div>

				{/* Avatar & Info */}
				<div className="flex items-center gap-3">
					<div className="relative">
						<img
							src={getProfileImage(String(entry.summoner.profileIconId))}
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
									region: entry.summoner.region,
									username: `${entry.summoner.gameName || "Unknown"}-${entry.summoner.tagLine || ""}`,
								}}
								className={`hover:text-primary max-w-[200px] truncate font-medium transition-colors hover:underline ${
									isHighlighted
										? "text-foreground font-bold"
										: "text-foreground/90"
								}`}
							>
								{entry.summoner.gameName || "Unknown"}
							</Link>
							{isHighlighted && (
								<motion.div
									initial={{ scale: 0, rotate: -180 }}
									animate={{ scale: 1, rotate: 0 }}
									transition={{ type: "spring", stiffness: 200 }}
								>
									<StarIcon className="h-3 w-3 fill-yellow-500 text-yellow-500" />
								</motion.div>
							)}
						</div>
						<div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-[10px] leading-none">
							<span className="text-[9px] font-semibold tracking-wider uppercase">
								{regionToDisplay(entry.summoner.region)}
							</span>
							<span className="text-border">|</span>
							<span className="opacity-80">#{entry.summoner.tagLine}</span>
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
					{(entry.challenge.value ?? 0).toLocaleString()}
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
	leaderboard,
	challengeId,
	highlightedUser,
}: ChallengeLeaderboardProps) {
	const { data: version = "15.24.1" } = useQuery({
		queryKey: ["dd-version"],
		queryFn: getDataDragonVersion,
	});

	const { getProfileImage, getChallengeIcon } = useDataDragonPath(version);

	// Determine logic for tier calculation
	const activeThresholds = useMemo(() => {
		const thresholds = config.config.thresholds as Record<string, number>;
		return Object.entries(thresholds).sort(
			([tierA], [tierB]) => TIER_ORDER.indexOf(tierA) - TIER_ORDER.indexOf(tierB),
		);
	}, [config.config.thresholds]);

	// Find the player's current tier based on their points
	const getPlayerTier = useCallback(
		(value: number) => {
			for (let i = activeThresholds.length - 1; i >= 0; i--) {
				const [tier, threshold] = activeThresholds[i];
				if (value >= threshold) return tier;
			}
			return null; // Below minimum threshold
		},
		[activeThresholds],
	);

	const normalizedUsername = highlightedUser?.username.replace("-", "#") ?? null;
	const normalizedRegion = highlightedUser
		? regionToDisplay(highlightedUser.region).toUpperCase()
		: null;

	const renderEntries = (entries: LeaderboardEntry[], offset = 0) =>
		entries.map((entry, index) => (
			<LeaderboardRow
				key={`${entry.summoner.region}-${entry.summoner.gameName}-${entry.summoner.tagLine}-${offset + index}`}
				entry={entry}
				index={index}
				offset={offset}
				highlightedUsername={normalizedUsername}
				highlightedRegion={normalizedRegion}
				getPlayerTier={getPlayerTier}
				getProfileImage={getProfileImage}
			/>
		));

	const shouldShowSections = highlightedUser && leaderboard.length > 75;
	const topSection = shouldShowSections ? leaderboard.slice(0, 75) : leaderboard;
	const bottomSection = shouldShowSections ? leaderboard.slice(75) : [];

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
						const thresholds = config.config.thresholds as Record<string, number>;
						const points = thresholds[tier];
						const exists = points !== undefined;

						return (
							<TierBadge
								key={tier}
								tier={tier}
								points={points || 0}
								exists={exists}
								// Pass a single-entry object to force the hook to return this tier's icon
								iconUrl={getChallengeIcon(challengeId, { [tier]: 1 })}
							/>
						);
					})}
				</motion.div>
			</section>

			{/* Leaderboard List */}
			<section>
				<h3 className="text-muted-foreground mb-3 px-1 text-sm font-semibold tracking-widest uppercase">
					Leaderboard
				</h3>
				<div className="bg-background/50 overflow-hidden rounded-xl border shadow-sm">
					<div className="flex flex-col">
						{renderEntries(topSection)}

						{shouldShowSections && (
							<motion.div
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								className="bg-muted/20 border-border/40 flex items-center justify-center border-y py-3"
							>
								<div className="bg-muted-foreground/30 mx-0.5 h-1 w-1 rounded-full" />
								<div className="bg-muted-foreground/30 mx-0.5 h-1 w-1 rounded-full" />
								<div className="bg-muted-foreground/30 mx-0.5 h-1 w-1 rounded-full" />
							</motion.div>
						)}

						{renderEntries(bottomSection, shouldShowSections ? 75 : 0)}

						{leaderboard.length === 0 && (
							<div className="text-muted-foreground flex flex-col items-center justify-center py-12">
								<p className="text-sm">No players found</p>
							</div>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
