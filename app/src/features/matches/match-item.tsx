import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import MatchTable from "@/features/matches/match-table-row";
import { useDataDragonPath } from "@/features/shared/hooks/useDataDragonPath";
import type { CompleteMatch } from "@/features/shared/types";
import { useUserContext } from "@/stores/user-store";

const MatchItem = ({ match }: { match: CompleteMatch }) => {
	const user = useUserContext((s) => s.user);
	const { getChampionImage } = useDataDragonPath(
		`${match.MatchInfo.gameVersion.split(".").slice(0, 2).join(".")}.1`,
	);
	const [isExpanded, setIsExpanded] = useState(false);

	/* biome-ignore lint/suspicious/noExplicitAny: this object is way too big */
	const userParticipant = (
		match.MatchInfo.participants as unknown as Array<any>
	)?.find((p) => p.puuid === user.puuid);

	const isWin: boolean = userParticipant?.win || false;

	// Format date nicely
	const gameDate = match.MatchInfo?.gameStartTimestamp
		? new Date(match.MatchInfo.gameStartTimestamp).toLocaleDateString()
		: "Unknown";
	const gameTime = match.MatchInfo?.gameStartTimestamp
		? new Date(match.MatchInfo.gameStartTimestamp).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			})
		: "Unknown";

	// Format game duration
	const gameDuration = match.MatchInfo?.gameDuration
		? `${Math.floor(match.MatchInfo.gameDuration / 60)}:${String(match.MatchInfo.gameDuration % 60).padStart(2, "0")}`
		: "Unknown";

	return (
		<Card
			className={`w-full transition-all duration-200 gap-4 py-4 ${isWin ? "border-green-500/20 bg-green-50/10 dark:bg-green-950/10" : "border-red-500/20 bg-red-50/10 dark:bg-red-950/10"} ${
				!isExpanded
					? "cursor-pointer hover:bg-muted/70 hover:border-muted hover:shadow-md hover:scale-[1.01]"
					: ""
			}`}
			onClick={() => setIsExpanded(!isExpanded)}
		>
			<CardHeader className="pb-1 px-2">
				<div
					className={`grid grid-cols-[2fr_1fr_auto_2fr_1fr] items-center place-items-center gap-2 min-w-0 w-full`}
				>
					{/* Column 1: Victory + Champion + Chevron */}
					<div className="flex flex-row items-center gap-4 shrink-0 justify-self-start">
						{/* Expand/Collapse Chevron */}
						{isExpanded ? (
							<ChevronUp className="w-3 h-3" />
						) : (
							<ChevronDown className="w-3 h-3" />
						)}

						<div
							className={`px-2 py-0.5 rounded-full text-xs font-semibold w-16 text-center ${
								isWin
									? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
									: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
							}`}
						>
							{isWin ? "VICTORY" : "DEFEAT"}
						</div>

						<div className="flex items-center gap-2">
							{/* Champion Info */}
							<div className="flex items-center gap-2 ">
								<img
									src={getChampionImage(`${userParticipant?.championName}.png`)}
									className="w-10 h-10 rounded"
									alt={userParticipant?.championName}
								/>
								<span className="text text-foreground truncate">
									{userParticipant?.championName}
								</span>
							</div>
						</div>
					</div>

					{/* Column 2: Game Type (ranked, normal, etc.) */}

					<div className="flexitems-center shrink-0 overflow-hidden justify-self-start">
						<div className="text-sm font-medium text-foreground">
							{match.MatchInfo?.gameMode
								?.replace(/_/g, " ")
								?.toLowerCase()
								?.replace(/\b\w/g, (l) => l.toUpperCase()) || "Unknown"}
						</div>
					</div>

					{/* Column 3: K/D/A Stats (centered) */}
					<div className="flex items-center gap-1 text-lg font-bold justify-center overflow-hidden">
						<span className="text-green-600 dark:text-green-400">
							{userParticipant?.kills}
						</span>
						<span className="text-muted-foreground">/</span>
						<span className="text-red-600 dark:text-red-400">
							{userParticipant?.deaths}
						</span>
						<span className="text-muted-foreground">/</span>
						<span className="text-blue-600 dark:text-blue-400">
							{userParticipant?.assists}
						</span>
					</div>

					{/* Column 4: Game Stats (when expanded) or Champion Icons (when collapsed) */}

					<div className="flex flex-col gap-0.5 justify-center overflow-hidden">
						{/* Blue Team Row */}
						<div className="flex items-center gap-1 justify-center">
							{(match.MatchInfo.participants as unknown as Array<any>)
								.filter((p: any) => p.teamId === 100)
								.map((participant: any) => (
									<div key={participant.puuid} className="relative">
										<img
											src={getChampionImage(`${participant.championName}.png`)}
											className={`w-6 h-6 rounded border ${
												participant.puuid === user.puuid
													? "border-primary shadow-sm"
													: "border-border"
											}`}
											alt={participant.championName}
											title={`Blue: ${participant.championName} (${participant.riotIdGameName})`}
										/>
									</div>
								))}
						</div>
						{/* Red Team Row */}
						<div className="flex items-center gap-1 justify-center">
							{(match.MatchInfo.participants as unknown as Array<any>)
								.filter((p: any) => p.teamId === 200)
								.map((participant: any) => (
									<div key={participant.puuid} className="relative">
										<img
											src={getChampionImage(`${participant.championName}.png`)}
											className={`w-6 h-6 rounded border ${
												participant.puuid === user.puuid
													? "border-primary shadow-sm"
													: "border-border"
											}`}
											alt={participant.championName}
											title={`Red: ${participant.championName} (${participant.riotIdGameName})`}
										/>
									</div>
								))}
						</div>
					</div>

					{/* Column 5: Champion Icons (when collapsed only - hidden when expanded) */}
					<div className="text-left shrink-0 overflow-hidden">
						<div className="text-xs text-muted-foreground">
							{gameDate} • {gameTime}
						</div>
						<div className="text-xs text-muted-foreground flex flex-col">
							<div>{match.MatchInfo?.gameType}</div>
						</div>
					</div>
				</div>
			</CardHeader>

			{isExpanded && (
				<CardContent>
					<div className="space-y-4">
						{/* Teams Layout */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Team 200 (Red Team) */}
							<div className="space-y-2">
								<h4 className="font-semibold text-red-600 dark:text-red-400 text-sm">
									Red Team
								</h4>
								<MatchTable
									players={
										match.MatchInfo.participants as unknown as Array<any>
									}
									teamId={200}
									version={`${match.MatchInfo.gameVersion.split(".").slice(0, 2).join(".")}.1`}
								/>
							</div>

							{/* Team 100 (Blue Team) */}
							<div className="space-y-2">
								<h4 className="font-semibold text-blue-600 dark:text-blue-400 text-sm">
									Blue Team
								</h4>
								<MatchTable
									players={
										match.MatchInfo.participants as unknown as Array<any>
									}
									teamId={100}
									version={`${match.MatchInfo.gameVersion.split(".").slice(0, 2).join(".")}.1`}
								/>
							</div>
						</div>

						{/* Match Footer Info */}
						<div className="flex items-center justify-between pt-2 border-t">
							<div className="text-sm text-muted-foreground">
								Map: {match.MatchInfo?.mapId} • Duration: {gameDuration}
							</div>
							<div className="text-sm text-muted-foreground">
								{match.participants?.length || 0} players
							</div>
						</div>
					</div>
				</CardContent>
			)}
		</Card>
	);
};

export default MatchItem;
