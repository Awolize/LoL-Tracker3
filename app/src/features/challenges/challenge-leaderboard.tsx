import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { StarIcon } from "lucide-react";
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

// Helper to get the CSS variable string for a tier
const getTierVar = (tier: string) => `var(--tier-${tier.toLowerCase()})`;

// --- Tier Badge (White Text & Larger Points) ---
const TierBadge = ({ tier, points }: { tier: string; points: number }) => {
	const tierColor = getTierVar(tier);
	return (
		<div
			className="flex flex-col items-center justify-center py-3 px-3 rounded-md border transition-all"
			style={{
				borderColor: tierColor,
				// Increased opacity slightly to support white text better
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
		</div>
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

// --- Leaderboard Row (Background Tint Only) ---
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

	// --- STYLE LOGIC ---
	// Removed the box-shadow (left color strip).
	// Kept the background tint.
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
		<div
			ref={rowRef}
			className={`
				group flex items-center justify-between px-4 py-2 text-sm transition-all duration-200
				${
					isHighlighted
						? "z-10 relative border-y"
						: "hover:brightness-105 border-b border-border/40 last:border-0"
				}
			`}
			style={rowStyle}
		>
			<div className="flex items-center gap-4">
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
								// Avatar always gets a border matching their tier
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
								<StarIcon className="w-3 h-3 text-yellow-500 fill-yellow-500" />
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
			<div className="text-right">
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
		</div>
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
				<div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
					{sortedThresholds.map(([tier, points]) => (
						<TierBadge key={tier} tier={tier} points={points} />
					))}
				</div>
			</section>

			{/* Leaderboard List */}
			<section>
				<div className="rounded-xl border bg-background/50 overflow-hidden shadow-sm">
					<div className="flex flex-col">
						{renderEntries(topSection)}

						{shouldShowSections && (
							<div className="flex items-center justify-center py-3 bg-muted/20 border-y border-border/40">
								<div className="h-1 w-1 rounded-full bg-muted-foreground/30 mx-0.5" />
								<div className="h-1 w-1 rounded-full bg-muted-foreground/30 mx-0.5" />
								<div className="h-1 w-1 rounded-full bg-muted-foreground/30 mx-0.5" />
							</div>
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
