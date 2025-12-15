import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { StarIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { regionToDisplay } from "@/features/shared/champs";
import { useDataDragonPath } from "@/features/shared/hooks/useDataDragonPath";
import { getDataDragonVersion } from "@/server/api/mutations";

// ... [Interfaces remain the same] ...
interface ChallengeConfig {
	config: {
		id: number;
		state: string | null;
		leaderboard: boolean;
		endTimestamp: Date | null;
		thresholds: Record<string, number>;
	};
	localization: {
		id: number;
		language: string;
		description: string;
		name: string;
		shortDescription: string;
	} | null;
}

interface LeaderboardEntry {
	challenge: {
		challengeId: number;
		percentile: number | null;
		level: string | null;
		value: number | null;
		achievedTime: Date | null;
	};
	summoner: {
		gameName: string | null;
		tagLine: string | null;
		region: string;
		profileIconId: number;
	};
}

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

// --- IMPROVEMENT 1: Consolidated Style Helpers ---

// Helper to get the CSS variable string for a tier
const getTierVar = (tier: string) => `var(--tier-${tier.toLowerCase()})`;

// Tier Card (Updated to use cleaner style logic)
const TierCard = ({ tier, points }: { tier: string; points: number }) => {
	const tierColor = getTierVar(tier);
	return (
		<div
			className="p-4 border rounded-lg transition-colors"
			style={{
				borderColor: tierColor,
				backgroundColor: `color-mix(in oklab, ${tierColor} 10%, transparent)`,
			}}
		>
			<div className="font-semibold text-lg capitalize">
				{tier.toLowerCase()}
			</div>
			<div className="text-sm text-muted-foreground">
				{points.toLocaleString()} points
			</div>
		</div>
	);
};

// --- IMPROVEMENT 2: Refactored Row Component ---

interface LeaderboardRowProps {
	entry: LeaderboardEntry;
	index: number;
	offset?: number;
	highlightedUsername?: string | null;
	highlightedRegion?: string | null;
	getPlayerTier: (value: number) => string;
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

	// Determine highlighting
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

	// --- LOGIC IMPROVEMENT ---
	// We calculate the specific background style here.
	// 1. Normal: 5% opacity of the tier color.
	// 2. Highlighted: 15% opacity + a subtle white mix to make it "glow",
	//    plus a shadow defined in the className below.
	const backgroundStyle = isHighlighted
		? `color-mix(in oklab, ${tierVar} 15%, rgba(255,255,255,0.1))`
		: `color-mix(in oklab, ${tierVar} 5%, transparent)`;

	return (
		<div
			ref={rowRef}
			className={`
				flex items-center justify-between p-4 border rounded-lg transition-all duration-300
				${isHighlighted ? "scale-[1.01] shadow-md z-10 relative" : ""}
			`}
			style={{
				backgroundColor: backgroundStyle,
				borderColor: tierVar,
				// If highlighted, add a colored glow using the tier color
				boxShadow: isHighlighted
					? `0 4px 20px -5px color-mix(in oklab, ${tierVar} 50%, transparent)`
					: undefined,
			}}
		>
			<div className="flex items-center gap-4">
				<div
					className={`text-lg font-bold w-8 ${
						isHighlighted
							? "text-primary scale-110 origin-left transition-transform"
							: "text-muted-foreground"
					}`}
				>
					#{actualIndex + 1}
				</div>
				<div className="flex items-center gap-2">
					<img
						src={getProfileImage(String(entry.summoner.profileIconId))}
						alt="Profile icon"
						className={`w-8 h-8 rounded-full border ${isHighlighted ? "border-primary" : "border-border"}`}
					/>
					<div>
						<div className="flex items-center gap-1">
							<Link
								to="/$region/$username"
								params={{
									region: entry.summoner.region,
									username: `${entry.summoner.gameName || "Unknown"}-${entry.summoner.tagLine || ""}`,
								}}
								className={`font-semibold transition-colors hover:text-primary ${
									isHighlighted ? "text-primary" : ""
								}`}
							>
								{entry.summoner.gameName || "Unknown"}
								<span className="text-muted-foreground opacity-50">
									#{entry.summoner.tagLine || ""}
								</span>
							</Link>
							{isHighlighted && (
								<StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-pulse" />
							)}
						</div>
						<div className="text-xs text-muted-foreground uppercase tracking-wide">
							{regionToDisplay(entry.summoner.region)}
						</div>
					</div>
				</div>
			</div>
			<div className="text-right">
				<div
					className={`font-bold font-mono ${isHighlighted ? "text-primary text-lg" : ""}`}
				>
					{(entry.challenge.value ?? 0).toLocaleString()}
				</div>
				{entry.challenge.level && (
					<div className="text-xs text-muted-foreground capitalize">
						{entry.challenge.level.toLowerCase()}
					</div>
				)}
			</div>
		</div>
	);
};

// --- Main Component (Structure cleaned up) ---

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
			Object.entries(config.config.thresholds).sort(([, a], [, b]) => b - a),
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
				// Use a composite key that is guaranteed to be unique
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
		<div className="space-y-6">
			{/* Tiers */}
			<Card>
				<CardHeader>
					<CardTitle>Tiers & Requirements</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{sortedThresholds.map(([tier, points]) => (
							<TierCard key={tier} tier={tier} points={points} />
						))}
					</div>
				</CardContent>
			</Card>

			{/* Leaderboard */}
			<Card>
				<CardHeader>
					<CardTitle>
						{config.localization?.name || `Challenge ${challengeId}`}{" "}
						Leaderboard
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					{renderEntries(topSection)}

					{shouldShowSections && (
						<div className="flex flex-col items-center py-6 text-muted-foreground gap-2">
							<span className="text-xl tracking-widest">•••</span>
							<span className="text-xs">Skipping to your position</span>
						</div>
					)}

					{renderEntries(bottomSection, shouldShowSections ? 75 : 0)}

					{leaderboard.length === 0 && (
						<div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
							No players found for this challenge yet.
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
