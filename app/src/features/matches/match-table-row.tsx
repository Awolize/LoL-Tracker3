import { Link, useParams } from "@tanstack/react-router";
import type React from "react";
import type { MatchPlayerData } from "@/features/matches/match-player-data";
import { useDataDragonPath } from "@/features/shared/hooks/useDataDragonPath";
import { useUserContext } from "@/stores/user-store";
import { cn } from "@/components/utils";

interface MatchTableProps {
	players: Array<MatchPlayerData>;
	teamId: number;
	version: string;
}

const MatchTable: React.FC<MatchTableProps> = ({
	players,
	teamId,
	version,
}) => {
	const { getChampionImage } = useDataDragonPath(version);
	const user = useUserContext((s) => s.user);

	const params = useParams({ from: "/$region/$username/matches" });

	const teamPlayers = players.filter((player) => player.teamId === teamId);

	return (
		<div className="space-y-2">
			{teamPlayers.map((player) => {
				const isCurrentUser = user.puuid === player.puuid;

				return (
					<div
						key={player.puuid}
						className={cn(
							"flex items-center gap-3 p-3 rounded-lg border transition-colors",
							isCurrentUser
								? "bg-primary/5 border-primary/20 ring-1 ring-primary/10"
								: "bg-muted/30 border-border hover:bg-muted/50",
						)}
					>
						{/* Champion Image */}
						<div className="flex-shrink-0">
							<img
								src={getChampionImage(`${player.championName}.png`)}
								className="w-10 h-10 rounded-lg border border-border"
								alt={`${player.championName}`}
							/>
						</div>

						{/* Champion Name */}
						<div className="flex-1 min-w-0">
							<div className="text-sm font-medium text-foreground truncate">
								{player.championName}
							</div>
						</div>

						{/* Player Name */}
						<div className="flex-1 min-w-0">
							<Link
								to="/$region/$username/mastery"
								params={{
									region: params.region,
									username: `${player.riotIdGameName}-${player.riotIdTagline}`,
								}}
								className={cn(
									"text-sm font-medium transition-colors truncate block",
									isCurrentUser
										? "text-primary hover:text-primary/80"
										: "text-foreground hover:text-foreground/80",
								)}
							>
								{player.riotIdGameName}
							</Link>
						</div>

						{/* K/D/A Stats */}
						<div className="flex-shrink-0 text-right">
							<div className="text-sm font-bold">
								<span className="text-green-600 dark:text-green-400">
									{player.kills}
								</span>
								<span className="text-muted-foreground"> / </span>
								<span className="text-red-600 dark:text-red-400">
									{player.deaths}
								</span>
								<span className="text-muted-foreground"> / </span>
								<span className="text-blue-600 dark:text-blue-400">
									{player.assists}
								</span>
							</div>
							<div className="text-xs text-muted-foreground">
								{player.kills + player.deaths + player.assists} total
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default MatchTable;
