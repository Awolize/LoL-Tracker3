import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { StarIcon } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { regionToDisplay } from "@/features/shared/champs";
import { useDataDragonPath } from "@/features/shared/hooks/useDataDragonPath";
import type {
	ChallengeConfig,
	LeaderboardEntry,
} from "@/features/shared/types";
import { getDataDragonVersion } from "@/server/api/mutations";

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

// Helper to get the CSS variable string for a tier
const getTierVar = (tier: string) => `var(--tier-${tier.toLowerCase()})`;

// --- Tier Badge (Animated) ---
const TierBadge = ({ tier, points }: { tier: string; points: number }) => {
	const tierColor = getTierVar(tier);
	return (
		<motion.div
			variants={itemVariants}
			whileHover={{ scale: 1.05, y: -2 }}
			className="flex flex-col items-center justify-center py-3 px-3 rounded-md border transition-colors"
			style={{
				borderColor: tierColor,
				backgroundColor: `color-mix(in oklab, ${tierColor} 20%, transparent)`,
			}}
		>
			<div
				className="font-bold text-sm uppercase tracking-wider mb-1 text-white"
				style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
			>
				{tier}
			</div>
			<div
				className="font-mono font-bold text-sm text-white"
				style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
			>
				{points.toLocaleString()}
			</div>
		</motion.div>
	);
};

interface LeaderboardRowProps {
	entry: LeaderboardEntry;
	index: number;
	offset?: number;
	highlightedUsername?: string | null;
	highlightedRegion?: string | null;
	getPlayerTier: (value: number) => string;
	getProfileImage: (id: string) => string;
}

// --- Leaderboard Row (Animated) ---
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
	const tierKey = tier.toLowerCase();
	const tierVar = `var(--tier-${tierKey})`;

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
			// Use whileInView to animate rows as they scroll into screen
			initial={{ opacity: 0, x: -10 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true, margin: "-5%" }}
			transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }} // Cap delay so deep lists don't lag
			className={`
				group flex items-center justify-between px-4 py-2 text-sm transition-colors duration-200
				${
					isHighlighted
						? "z-10 relative border-y"
						: "hover:brightness-105 border-b border-border/40 last:border-0"
				}
			`}
			style={rowStyle}
		>
			{/* Pulse Effect for Highlighted User */}
			{isHighlighted && (
				<motion.div
					className="absolute inset-0 pointer-events-none"
					animate={{ opacity: [0.1, 0.2, 0.1] }}
					transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
					style={{ backgroundColor: tierVar }}
				/>
			)}

			<div className="flex items-center gap-4 relative z-10">
				{/* Rank */}
				<div
					className={`font-mono text-sm w-6 text-center ${
						isHighlighted
							? "font-bold text-foreground"
							: "text-muted-foreground/70"
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
							className="w-8 h-8 rounded-full bg-muted object-cover border-2"
							style={{
								borderColor: tierVar,
							}}
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
								className={`font-medium transition-colors hover:text-primary hover:underline truncate max-w-[200px] ${
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
									<StarIcon className="w-3 h-3 text-yellow-500 fill-yellow-500" />
								</motion.div>
							)}
						</div>
						<div className="flex items-center gap-1.5 text-[10px] text-muted-foreground leading-none mt-1">
							<span className="uppercase font-semibold tracking-wider text-[9px]">
								{regionToDisplay(entry.summoner.region)}
							</span>
							<span className="text-border">|</span>
							<span className="opacity-80">#{entry.summoner.tagLine}</span>
						</div>
					</div>
				</div>
			</div>

			{/* Points & Tier Name */}
			<div className="text-right relative z-10">
				<div
					className={`font-mono font-medium ${
						isHighlighted ? "text-foreground" : "text-foreground/80"
					}`}
				>
					{(entry.challenge.value ?? 0).toLocaleString()}
				</div>
				{entry.challenge.level && (
					<div
						className="text-[10px] capitalize leading-none mt-0.5 font-bold tracking-wide"
						style={{ color: tierVar }}
					>
						{entry.challenge.level.toLowerCase()}
					</div>
				)}
			</div>
		</motion.div>
	);
};

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
	const { getProfileImage } = useDataDragonPath(version);

	const sortedThresholds = useMemo(
		() =>
			Object.entries(config.config.thresholds as Record<string, number>).sort(
				([, a], [, b]) => b - a,
			),
		[config.config.thresholds],
	);

	const getPlayerTier = useCallback(
		(value: number) => {
			for (const [tier, threshold] of sortedThresholds)
				if (value >= threshold) return tier;
			return sortedThresholds[sortedThresholds.length - 1]?.[0] || "IRON";
		},
		[sortedThresholds],
	);

	const normalizedUsername =
		highlightedUser?.username.replace("-", "#") ?? null;
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
	const topSection = shouldShowSections
		? leaderboard.slice(0, 75)
		: leaderboard;
	const bottomSection = shouldShowSections ? leaderboard.slice(75) : [];

	return (
		<div className="flex flex-col gap-6">
			{/* Tiers Grid */}
			<section>
				<h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-widest mb-3 px-1">
					Thresholds
				</h3>
				{/* Staggered Container */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="show"
					className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2"
				>
					{sortedThresholds.map(([tier, points]) => (
						<TierBadge key={tier} tier={tier} points={points} />
					))}
				</motion.div>
			</section>

			{/* Leaderboard List */}
			<section>
				<h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-widest mb-3 px-1">
					Leaderboard
				</h3>
				<div className="rounded-xl border bg-background/50 overflow-hidden shadow-sm">
					<div className="flex flex-col">
						{renderEntries(topSection)}

						{shouldShowSections && (
							<motion.div
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								className="flex items-center justify-center py-3 bg-muted/20 border-y border-border/40"
							>
								<div className="h-1 w-1 rounded-full bg-muted-foreground/30 mx-0.5" />
								<div className="h-1 w-1 rounded-full bg-muted-foreground/30 mx-0.5" />
								<div className="h-1 w-1 rounded-full bg-muted-foreground/30 mx-0.5" />
							</motion.div>
						)}

						{renderEntries(bottomSection, shouldShowSections ? 75 : 0)}

						{leaderboard.length === 0 && (
							<div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
								<p className="text-sm">No players found</p>
							</div>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
