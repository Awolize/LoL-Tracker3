import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MatchTable from "@/features/matches/match-table-row";
import { useDataDragonPath } from "@/features/shared/hooks/useDataDragonPath";
import type { CompleteMatch } from "@/features/shared/types";
import { useUserContext } from "@/stores/user-store";

const MatchItem = ({ match }: { match: CompleteMatch }) => {
	const user = useUserContext((s) => s.user);
	const { getChampionImage } = useDataDragonPath(
		`${match.MatchInfo.gameVersion.split(".").slice(0, 2).join(".")}.1`,
	);

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
			className={`w-full ${isWin ? "border-green-500/20 bg-green-50/10 dark:bg-green-950/10" : "border-red-500/20 bg-red-50/10 dark:bg-red-950/10"}`}
		>
			<CardHeader className="pb-3">
				<div className="flex items-center">
					<div className="flex items-center gap-3 flex-1">
						<div
							className={`px-3 py-1 rounded-full text-xs font-semibold ${
								isWin
									? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
									: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
							}`}
						>
							{isWin ? "VICTORY" : "DEFEAT"}
						</div>
						{/* Champion Icon and Name */}
						<div className="flex items-center gap-2">
							<img
								src={getChampionImage(`${userParticipant?.championName}.png`)}
								className="w-6 h-6 rounded"
								alt={userParticipant?.championName}
							/>
							<span className="text-sm font-medium text-foreground">
								{userParticipant?.championName}
							</span>
						</div>
						<div className="text-sm text-muted-foreground">
							{gameDate} • {gameTime}
						</div>
					</div>
					{/* K/D/A stats perfectly centered on desktop */}
					<div className="hidden md:flex items-center gap-1 text-lg font-bold absolute left-1/2 transform -translate-x-1/2">
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
					<div className="flex-1 text-right">
						<div className="text-sm text-muted-foreground">
							{match.MatchInfo?.gameMode}
						</div>
						<div className="text-sm text-muted-foreground">
							{match.MatchInfo?.gameType}
						</div>
					</div>
				</div>
				{/* K/D/A stats centered on mobile */}
				<div className="flex justify-center mt-3 md:hidden">
					<div className="text-xl font-bold">
						<span className="text-green-600 dark:text-green-400">
							{userParticipant?.kills}
						</span>
						<span className="text-muted-foreground mx-1">/</span>
						<span className="text-red-600 dark:text-red-400">
							{userParticipant?.deaths}
						</span>
						<span className="text-muted-foreground mx-1">/</span>
						<span className="text-blue-600 dark:text-blue-400">
							{userParticipant?.assists}
						</span>
					</div>
				</div>
			</CardHeader>

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
								players={match.MatchInfo.participants as unknown as Array<any>}
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
								players={match.MatchInfo.participants as unknown as Array<any>}
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
		</Card>
	);
};

export default MatchItem;
