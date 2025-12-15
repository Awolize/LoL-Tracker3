import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { StarIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataDragonPath } from "@/features/shared/hooks/useDataDragonPath";
import { getDataDragonVersion } from "@/server/api/mutations";

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

export default function ChallengeLeaderboard({
	config,
	leaderboard,
	hasSections,
	challengeId,
	highlightedUser,
}: ChallengeLeaderboardProps) {
	const highlightedUserRef = useRef<HTMLDivElement>(null);

	const { data: version } = useQuery({
		queryKey: ["dd-version"],
		queryFn: () => getDataDragonVersion(),
	});

	const { getProfileImage } = useDataDragonPath(version ?? "15.24.1");

	const thresholds = config.config.thresholds as Record<string, number>;
	const sortedThresholds = Object.entries(thresholds).sort(
		([, a], [, b]) => b - a,
	);

	// Scroll to highlighted user when component mounts or highlightedUser changes
	useEffect(() => {
		if (highlightedUser && highlightedUserRef.current) {
			highlightedUserRef.current.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}
	}, [highlightedUser]);

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
							<div key={tier} className="p-4 border rounded-lg bg-card">
								<div className="font-semibold text-lg">{tier}</div>
								<div className="text-sm text-muted-foreground">
									{points.toLocaleString()} points
								</div>
							</div>
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
				<CardContent>
					<div className="space-y-2">
						{(() => {
							// If we have a highlighted user and leaderboard has more than 75 entries,
							// show top 75, ellipsis, then the rest
							const shouldShowSections =
								highlightedUser && leaderboard.length > 75;
							const topSection = shouldShowSections
								? leaderboard.slice(0, 75)
								: leaderboard;
							const bottomSection = shouldShowSections
								? leaderboard.slice(75)
								: [];

							return (
								<>
									{/* Top section */}
									{topSection.map((entry, index) => {
										const normalizedUsername =
											highlightedUser?.username.replace("-", "#");
										const isHighlighted =
											highlightedUser &&
											`${entry.summoner.gameName}#${entry.summoner.tagLine}` ===
												normalizedUsername &&
											entry.summoner.region.toLowerCase() ===
												highlightedUser.region.toLowerCase();

										return (
											<div
												key={`${entry.summoner.gameName}-${entry.summoner.tagLine}-${index}`}
												ref={isHighlighted ? highlightedUserRef : undefined}
												className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
													isHighlighted
														? "bg-primary/20 border-primary ring-2 ring-primary/30 shadow-md"
														: "bg-card hover:bg-accent/50"
												}`}
											>
												<div className="flex items-center gap-4">
													<div
														className={`text-lg font-bold w-8 ${
															isHighlighted
																? "text-primary"
																: "text-muted-foreground"
														}`}
													>
														#{index + 1}
													</div>
													<div className="flex items-center gap-2">
														<img
															src={getProfileImage(
																String(entry.summoner.profileIconId),
															)}
															alt="Profile icon"
															className="w-8 h-8 rounded-full border border-border"
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
																	{entry.summoner.gameName || "Unknown"}#
																	{entry.summoner.tagLine || ""}
																</Link>
																{isHighlighted && (
																	<StarIcon className="w-4 h-4 text-primary fill-primary" />
																)}
															</div>
															<div className="text-sm text-muted-foreground uppercase">
																{entry.summoner.region}
															</div>
														</div>
													</div>
												</div>
												<div className="text-right">
													<div
														className={`font-bold ${
															isHighlighted ? "text-primary" : ""
														}`}
													>
														{(entry.challenge.value ?? 0).toLocaleString()}
													</div>
													{entry.challenge.level && (
														<div className="text-sm text-muted-foreground">
															{entry.challenge.level}
														</div>
													)}
												</div>
											</div>
										);
									})}

									{/* Ellipsis separator */}
									{shouldShowSections && (
										<div className="flex justify-center py-4">
											<div className="text-muted-foreground text-lg">...</div>
										</div>
									)}

									{/* Bottom section */}
									{bottomSection.map((entry, index) => {
										const actualIndex = 75 + index;
										const normalizedUsername =
											highlightedUser?.username.replace("-", "#");
										const isHighlighted =
											highlightedUser &&
											`${entry.summoner.gameName}#${entry.summoner.tagLine}` ===
												normalizedUsername &&
											entry.summoner.region.toLowerCase() ===
												highlightedUser.region.toLowerCase();

										return (
											<div
												key={`${entry.summoner.gameName}-${entry.summoner.tagLine}-${actualIndex}`}
												ref={isHighlighted ? highlightedUserRef : undefined}
												className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
													isHighlighted
														? "bg-primary/20 border-primary ring-2 ring-primary/30 shadow-md"
														: "bg-card hover:bg-accent/50"
												}`}
											>
												<div className="flex items-center gap-4">
													<div
														className={`text-lg font-bold w-8 ${
															isHighlighted
																? "text-primary"
																: "text-muted-foreground"
														}`}
													>
														#{actualIndex + 1}
													</div>
													<div className="flex items-center gap-2">
														<img
															src={getProfileImage(
																String(entry.summoner.profileIconId),
															)}
															alt="Profile icon"
															className="w-8 h-8 rounded-full border border-border"
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
																	{entry.summoner.gameName || "Unknown"}#
																	{entry.summoner.tagLine || ""}
																</Link>
																{isHighlighted && (
																	<StarIcon className="w-4 h-4 text-primary fill-primary" />
																)}
															</div>
															<div className="text-sm text-muted-foreground uppercase">
																{entry.summoner.region}
															</div>
														</div>
													</div>
												</div>
												<div className="text-right">
													<div
														className={`font-bold ${
															isHighlighted ? "text-primary" : ""
														}`}
													>
														{(entry.challenge.value ?? 0).toLocaleString()}
													</div>
													{entry.challenge.level && (
														<div className="text-sm text-muted-foreground">
															{entry.challenge.level}
														</div>
													)}
												</div>
											</div>
										);
									})}

									{leaderboard.length === 0 && (
										<div className="text-center py-8 text-muted-foreground">
											No players found for this challenge.
										</div>
									)}
								</>
							);
						})()}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
