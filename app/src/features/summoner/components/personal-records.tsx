import { Card, CardContent, CardHeader } from "~/components/ui/card";
import type { PersonalRecords } from "~/server/summoner/personal-records";

/** 160685 -> "160.7k". */
const compact = (value: number): string => {
	if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
	if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
	return String(value);
};

/** Seconds -> "28:14". */
const duration = (seconds: number | null): string => {
	if (seconds === null || seconds <= 0) return "-";
	const minutes = Math.floor(seconds / 60);
	return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
};

type Tile = { label: string; value: string; hint?: string };

const Tile = ({ label, value, hint }: Tile) => (
	<div className="border-border bg-muted/30 rounded-lg border p-3">
		<div className="text-muted-foreground text-xs tracking-wide uppercase">{label}</div>
		<div className="text-foreground text-lg font-semibold">{value}</div>
		{hint ? <div className="text-muted-foreground truncate text-xs">{hint}</div> : null}
	</div>
);

/**
 * Career records for a summoner.
 *
 * Zero-valued records are dropped: most accounts have no pentakill or unreal kill, and a wall of
 * "0" tiles buries the ones that mean something. Games and win rate always show, so the panel
 * still reads as a summary for a brand-new profile.
 */
export function PersonalRecordsPanel({ records }: { records: PersonalRecords }) {
	const { multikills } = records;

	const tiles: Tile[] = [];

	if (multikills.pentas) tiles.push({ label: "Pentakills", value: String(multikills.pentas) });
	if (multikills.quadras) tiles.push({ label: "Quadrakills", value: String(multikills.quadras) });
	if (multikills.unreal) tiles.push({ label: "Unreal kills", value: String(multikills.unreal) });
	if (multikills.triples)
		tiles.push({ label: "Triple kills", value: String(multikills.triples) });
	if (multikills.doubles)
		tiles.push({ label: "Double kills", value: String(multikills.doubles) });

	if (records.bestSpree) tiles.push({ label: "Best spree", value: String(records.bestSpree) });
	if (records.bestMultikill)
		tiles.push({ label: "Best multikill", value: `${records.bestMultikill}x` });

	if (records.bestKills.value !== null)
		tiles.push({
			label: "Most kills",
			value: String(records.bestKills.value),
			hint: records.bestKills.champion ?? undefined,
		});

	if (records.bestDamage.value !== null)
		tiles.push({
			label: "Most damage",
			value: compact(records.bestDamage.value),
			hint: records.bestDamage.champion ?? undefined,
		});

	if (records.bestKda.value !== null)
		tiles.push({
			label: "Best KDA",
			value: records.bestKda.value.toFixed(2),
			hint: records.bestKda.champion ?? undefined,
		});

	if (records.perfectGames)
		tiles.push({ label: "Perfect games", value: String(records.perfectGames) });

	if (records.bestVision !== null)
		tiles.push({ label: "Best vision", value: String(records.bestVision) });

	if (records.fastestWinSeconds !== null)
		tiles.push({ label: "Fastest win", value: duration(records.fastestWinSeconds) });

	if (records.longestGameSeconds !== null)
		tiles.push({ label: "Longest game", value: duration(records.longestGameSeconds) });

	if (records.objectives.dragons)
		tiles.push({ label: "Dragons", value: String(records.objectives.dragons) });
	if (records.objectives.barons)
		tiles.push({ label: "Barons", value: String(records.objectives.barons) });
	if (records.objectives.turrets)
		tiles.push({ label: "Turrets", value: String(records.objectives.turrets) });
	if (records.objectives.inhibitors)
		tiles.push({ label: "Inhibitors", value: String(records.objectives.inhibitors) });

	const winRate =
		records.games > 0 ? `${Math.round((records.wins / records.games) * 100)}%` : "-";

	return (
		<Card className="gap-4 py-4">
			<CardHeader className="px-4 pb-0">
				<h3 className="text-lg font-semibold">Personal records</h3>
				<p className="text-muted-foreground text-sm">
					Bests and lifetime totals across {records.games.toLocaleString()} stored games
				</p>
			</CardHeader>
			<CardContent className="px-4">
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
					<Tile label="Games" value={records.games.toLocaleString()} />
					<Tile label="Win rate" value={winRate} hint={`${records.wins} wins`} />
					{tiles.map((tile) => (
						<Tile key={tile.label} {...tile} />
					))}
				</div>
			</CardContent>
		</Card>
	);
}
