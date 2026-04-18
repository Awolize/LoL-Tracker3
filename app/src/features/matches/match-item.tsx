import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardHeader } from "~/components/ui/card";
import MatchTable from "~/features/matches/match-table-row";
import { useDataDragonPath } from "~/features/shared/hooks/useDataDragonPath";
import type { CompleteMatch } from "~/features/shared/types";
import { useUserContext } from "~/stores/user-store";

const MatchItem = ({ match }: { match: CompleteMatch }) => {
	const user = useUserContext((s) => s.user);
	const { getChampionImage } = useDataDragonPath(
		`${match.MatchInfo.gameVersion.split(".").slice(0, 2).join(".")}.1`,
	);
	const [isExpanded, setIsExpanded] = useState(false);

	/* biome-ignore lint/suspicious/noExplicitAny: this object is way too big */
	const userParticipant = (match.MatchInfo.participants as unknown as Array<any>)?.find(
		(p) => p.puuid === user.puuid,
	);

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
			className={`w-full gap-4 py-4 transition-all duration-200 ${isWin ? "border-green-500/20 bg-green-50/10 dark:bg-green-950/10" : "border-red-500/20 bg-red-50/10 dark:bg-red-950/10"} ${
				!isExpanded
					? "hover:bg-muted/70 hover:border-muted cursor-pointer hover:scale-[1.01] hover:shadow-md"
					: ""
			}`}
			onClick={() => setIsExpanded(!isExpanded)}
		>
			<CardHeader className="px-2 pb-1">
				<div
					className={`grid w-full min-w-0 grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto_minmax(0,2fr)_minmax(0,1fr)] place-items-center items-center gap-2 sm:gap-3`}
				>
					{/* Column 1: Victory + Champion + Chevron */}
					<div className="flex min-w-0 flex-row items-center gap-2 justify-self-start sm:gap-3">
						{/* Expand/Collapse Chevron */}
						{isExpanded ? (
							<ChevronUp className="h-3 w-3" />
						) : (
							<ChevronDown className="h-3 w-3" />
						)}

						<div
							className={`w-16 rounded-full px-2 py-0.5 text-center text-xs font-semibold ${
								isWin
									? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
									: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
							}`}
						>
							{isWin ? "VICTORY" : "DEFEAT"}
						</div>

						<div className="flex min-w-0 items-center gap-2">
							{/* Champion Info */}
							<div className="flex min-w-0 items-center gap-2">
								<img
									src={getChampionImage(`${userParticipant?.championName}.png`)}
									className="h-10 w-10 shrink-0 rounded"
									alt={userParticipant?.championName}
								/>
								<span className="text text-foreground min-w-0 truncate">
									{userParticipant?.championName}
								</span>
							</div>
						</div>
					</div>

					{/* Column 2: Game Type (ranked, normal, etc.) */}

					<div className="flex min-w-0 shrink-0 items-center justify-self-start overflow-hidden">
						<div className="text-foreground text-sm font-medium">
							{match.MatchInfo?.gameMode
								?.replace(/_/g, " ")
								?.toLowerCase()
								?.replace(/\b\w/g, (l) => l.toUpperCase()) || "Unknown"}
						</div>
					</div>

					{/* Column 3: K/D/A Stats (centered) */}
					<div className="flex items-center justify-center gap-1 overflow-hidden text-lg font-bold">
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

					<div className="flex min-w-0 flex-col justify-center gap-0.5 overflow-hidden">
						{/* Blue Team Row */}
						<div className="flex items-center justify-center gap-1">
							{(match.MatchInfo.participants as unknown as Array<any>)
								.filter((p: any) => p.teamId === 100)
								.map((participant: any) => (
									<div key={participant.puuid} className="relative">
										<img
											src={getChampionImage(
												`${participant.championName}.png`,
											)}
											className={`h-6 w-6 rounded border ${
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
						<div className="flex items-center justify-center gap-1">
							{(match.MatchInfo.participants as unknown as Array<any>)
								.filter((p: any) => p.teamId === 200)
								.map((participant: any) => (
									<div key={participant.puuid} className="relative">
										<img
											src={getChampionImage(
												`${participant.championName}.png`,
											)}
											className={`h-6 w-6 rounded border ${
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
					<div className="shrink-0 overflow-hidden text-left">
						<div className="text-muted-foreground text-xs">
							{gameDate} • {gameTime}
						</div>
						<div className="text-muted-foreground flex flex-col text-xs">
							<div>{match.MatchInfo?.gameType}</div>
						</div>
					</div>
				</div>
			</CardHeader>

			{isExpanded && (
				<CardContent>
					<div className="space-y-4">
						{/* Teams Layout */}
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{/* Team 200 (Red Team) */}
							<div className="space-y-2">
								<h4 className="text-sm font-semibold text-red-600 dark:text-red-400">
									Red Team
								</h4>
								<MatchTable
									players={match.MatchInfo.participants as unknown as Array<any>}
									teamId={200}
									version={`${match.MatchInfo.gameVersion.split(".").slice(0, 2).join(".")}.1`}
								/>
							</div>

							{/* Team 100 (Blue Team) */}
							<div className="space-y-2">
								<h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400">
									Blue Team
								</h4>
								<MatchTable
									players={match.MatchInfo.participants as unknown as Array<any>}
									teamId={100}
									version={`${match.MatchInfo.gameVersion.split(".").slice(0, 2).join(".")}.1`}
								/>
							</div>
						</div>

						{/* Match Footer Info */}
						<div className="flex items-center justify-between border-t pt-2">
							<div className="text-muted-foreground text-sm">
								Map: {match.MatchInfo?.mapId} • Duration: {gameDuration}
							</div>
							<div className="text-muted-foreground text-sm">
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
