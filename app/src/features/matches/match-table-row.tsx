import { Link, useParams } from "@tanstack/react-router";
import type React from "react";

import { cn } from "~/components/utils";
import { useDataDragonPath } from "~/features/shared/hooks/useDataDragonPath";
import { formatRiotId } from "~/features/shared/riot-id";
import { summonerSpell } from "~/features/shared/summoner-spells";
import type { MatchParticipantDTO } from "~/server/external/riot/twisted";
import { useUserContext } from "~/stores/user-store";

interface MatchTableProps {
	players: Array<MatchParticipantDTO>;
	teamId: number;
	version: string;
}

/** 16500 -> "16.5k". Keeps the stat line narrow enough to sit beside a team column. */
const compact = (value: number): string => {
	if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
	if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
	return String(value);
};

/** Riot's own position names, shortened for the row. */
const POSITION_LABELS: Record<string, string> = {
	TOP: "TOP",
	JUNGLE: "JGL",
	MIDDLE: "MID",
	BOTTOM: "BOT",
	UTILITY: "SUP",
};

const MatchTable: React.FC<MatchTableProps> = ({ players, teamId, version }) => {
	const { getChampionImage, getItemImage, getSpellImage } = useDataDragonPath(version);
	const user = useUserContext((s) => s.user);

	const params = useParams({ from: "/$region/$username/matches" });

	const teamPlayers = players.filter((player) => player.teamId === teamId);

	return (
		<div className="space-y-2">
			{teamPlayers.map((player) => {
				const isCurrentUser = user.puuid === player.puuid;

				const cs = player.totalMinionsKilled + player.neutralMinionsKilled;
				const minutes = player.timePlayed > 0 ? player.timePlayed / 60 : 0;
				const csPerMinute = minutes > 0 ? (cs / minutes).toFixed(1) : "0.0";

				const damage = player.totalDamageDealtToChampions;
				// Pre-computed by Riot and present on nearly every stored match; more informative
				// than recomputing a share from the other nine participants.
				const damageShare = player.challenges?.teamDamagePercentage;
				const killParticipation = player.challenges?.killParticipation;

				const position = POSITION_LABELS[player.teamPosition ?? ""];
				const summoners = [
					summonerSpell(player.summoner1Id),
					summonerSpell(player.summoner2Id),
				];
				const items = [
					player.item0,
					player.item1,
					player.item2,
					player.item3,
					player.item4,
					player.item5,
				];

				return (
					<div
						key={player.puuid}
						className={cn(
							"rounded-lg border p-3 transition-colors",
							isCurrentUser
								? "bg-primary/5 border-primary/20 ring-1 ring-primary/10"
								: "bg-muted/30 border-border hover:bg-muted/50",
						)}
					>
						{/* Identity row: champion, player, KDA */}
						<div className="flex items-center gap-3">
							<div className="relative shrink-0">
								<img
									src={getChampionImage(`${player.championName}.png`)}
									loading="lazy"
									className="border-border h-10 w-10 rounded-lg border"
									alt={player.championName}
								/>
								<span className="bg-background/90 border-border absolute -right-1 -bottom-1 rounded border px-1 text-[10px] font-semibold">
									{player.champLevel}
								</span>
							</div>

							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-1.5">
									<span className="text-foreground truncate text-sm font-medium">
										{player.championName}
									</span>
									{position && (
										<span className="text-muted-foreground text-[10px] font-semibold tracking-wide">
											{position}
										</span>
									)}
								</div>
								<Link
									to="/$region/$username"
									params={{
										region: params.region,
										username: formatRiotId(
											player.riotIdGameName,
											player.riotIdTagline,
										),
									}}
									className={cn(
										"block truncate text-xs transition-colors",
										isCurrentUser
											? "text-primary hover:text-primary/80"
											: "text-muted-foreground hover:text-foreground",
									)}
								>
									{player.riotIdGameName}
								</Link>
							</div>

							<div className="shrink-0 text-right">
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
								<div className="text-muted-foreground text-xs">
									{player.deaths === 0
										? "Perfect KDA"
										: `${((player.kills + player.assists) / player.deaths).toFixed(2)} KDA`}
								</div>
							</div>
						</div>

						{/* Detail row: spells, items, then the post-game numbers */}
						<div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
							<div className="flex shrink-0 gap-1">
								{summoners.map((spell, index) =>
									spell.image ? (
										<img
											key={index}
											src={getSpellImage(spell.image)}
											loading="lazy"
											title={spell.name}
											alt={spell.name}
											className="border-border h-6 w-6 rounded border"
										/>
									) : (
										<div
											key={index}
											title={spell.name}
											className="border-border/50 bg-muted/30 h-6 w-6 rounded border"
										/>
									),
								)}
							</div>

							<div className="flex shrink-0 items-center gap-0.5">
								{items.map((itemId, index) =>
									itemId > 0 ? (
										<img
											key={index}
											src={getItemImage(itemId)}
											loading="lazy"
											title={`Item ${itemId}`}
											alt=""
											className="border-border h-6 w-6 rounded border"
										/>
									) : (
										<div
											key={index}
											className="border-border/50 bg-muted/20 h-6 w-6 rounded border"
										/>
									),
								)}
								<div className="w-1" />
								{player.item6 > 0 ? (
									<img
										src={getItemImage(player.item6)}
										loading="lazy"
										title={`Item ${player.item6}`}
										alt=""
										className="border-border h-6 w-6 rounded border"
									/>
								) : (
									<div className="border-border/50 bg-muted/20 h-6 w-6 rounded border" />
								)}
							</div>

							<div className="text-muted-foreground ml-auto flex flex-wrap justify-end gap-x-3 gap-y-1 text-xs">
								<span title="Damage to champions">
									<span className="text-foreground font-medium">
										{compact(damage)}
									</span>{" "}
									dmg
									{damageShare ? ` (${Math.round(damageShare * 100)}%)` : ""}
								</span>
								{typeof killParticipation === "number" && (
									<span title="Kill participation">
										<span className="text-foreground font-medium">
											{Math.round(killParticipation * 100)}%
										</span>{" "}
										KP
									</span>
								)}
								<span title="Gold earned">
									<span className="text-foreground font-medium">
										{compact(player.goldEarned)}
									</span>{" "}
									gold
								</span>
								<span title="Minions and jungle monsters killed">
									<span className="text-foreground font-medium">{cs}</span> cs (
									{csPerMinute}/min)
								</span>
								<span title="Vision score">
									<span className="text-foreground font-medium">
										{player.visionScore}
									</span>{" "}
									vision
								</span>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default MatchTable;
