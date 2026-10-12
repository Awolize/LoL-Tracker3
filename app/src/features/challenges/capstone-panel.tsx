import { Card, CardContent, CardHeader } from "~/components/ui/card";
import {
	capstoneTopPercentValue,
	formatCapstoneTopPercent,
} from "~/features/challenges/lib/capstone-percentile";
import { tierTextColor } from "~/features/challenges/lib/profile-challenge-stats";
import { useDataDragonPath } from "~/features/shared/hooks/useDataDragonPath";
import type { CapstoneAggregate, ProfileCapstones } from "~/server/challenges/capstone-progress";

/**
 * The shared per-tier crystal crest behind the six aggregate ids.
 *
 * `getChallengeTierIcon(0, level)` resolves to CommunityDragon's
 * `challenges/config/00_crystals/challengecrystal_<tier>.png`, which the image proxy maps for ids
 * 0-5 (verified: `/api/images/cdn/16.20.1/img/challenges/0-master.webp` answers 200 image/webp).
 * Only the Crystal draws it. There is no published per-category art - CommunityDragon has no
 * per-category token, and its `00_crystals` crest is the *same file for all six ids* - so five
 * copies of the crest would distinguish nothing. Categories are instead told apart by name and the
 * theme's tier colour.
 */
const CRYSTAL_ICON_CHALLENGE_ID = 0;

type CapstoneTile = {
	key: string;
	label: string;
	level: string;
	current: number;
	max: number;
	percentile: number | null;
	playersInLevel: number | null;
	iconSrc?: string;
};

const toTile = (capstone: CapstoneAggregate, label: string, key: string): CapstoneTile => ({
	key,
	label,
	level: capstone.level,
	current: capstone.current,
	max: capstone.max,
	percentile: capstone.percentile,
	playersInLevel: capstone.playersInLevel,
});

/** 12000/24000 -> 50. A tile with no usable max shows no bar at all. */
function progressPercent(current: number, max: number): number | null {
	if (!Number.isFinite(current) || !Number.isFinite(max) || max <= 0) return null;
	return Math.min(100, Math.max(0, Math.round((current / max) * 100)));
}

/**
 * "Top 0.1% · 579 in tier", or the part of it we actually have.
 *
 * Riot only publishes `playersInLevel` for some challenges, so it is usually absent - the rank line
 * then carries the percentile alone rather than a zero.
 */
function rankLine(tile: CapstoneTile): string | null {
	const label = formatCapstoneTopPercent(tile.percentile);
	const players =
		tile.playersInLevel !== null && tile.playersInLevel > 0
			? `${tile.playersInLevel.toLocaleString()} in tier`
			: null;

	if (label === null) return players;
	if (players === null) return label;
	return `Top ${capstoneTopPercentValue(label)}% · ${players}`;
}

function CapstoneCard({ tile }: { tile: CapstoneTile }) {
	const percent = progressPercent(tile.current, tile.max);
	const rank = rankLine(tile);

	return (
		<div className="border-border bg-muted/30 flex flex-col gap-2 rounded-lg border p-3">
			<div className="flex items-center gap-2">
				{tile.iconSrc ? (
					<img src={tile.iconSrc} alt="" className="size-8 shrink-0 object-contain" />
				) : null}
				<div className="min-w-0">
					<div className="truncate text-sm font-semibold">{tile.label}</div>
					<div
						className="text-xs font-bold tracking-wide uppercase"
						style={{ color: tierTextColor(tile.level) }}
					>
						{tile.level}
					</div>
				</div>
			</div>

			<div className="text-sm font-semibold tabular-nums">
				{tile.current.toLocaleString()}
				<span className="text-muted-foreground font-normal">
					{" / "}
					{tile.max.toLocaleString()}
				</span>
			</div>

			{percent === null ? null : (
				<div
					className="bg-muted h-1.5 w-full overflow-hidden rounded-full"
					role="progressbar"
					aria-valuenow={percent}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-label={`${tile.label} progress`}
				>
					<div
						className="bg-primary h-full rounded-full"
						style={{ width: `${percent}%` }}
					/>
				</div>
			)}

			{rank ? <div className="text-muted-foreground text-xs tabular-nums">{rank}</div> : null}
		</div>
	);
}

/**
 * The six capstone aggregates, for the profile hub.
 *
 * These are the only challenge surfaces that read `TotalPoints` / `CategoryPoints`: aggregate rows
 * are not `Challenge` rows, so they never reach the challenge list's payload. The six config rows
 * stay in that list - this is an extra surface, deliberately not a replacement.
 *
 * Renders nothing without stored aggregates: a summoner who has never been synced must not be shown
 * a card of zeros that reads like a real score.
 */
export function CapstonePanel({
	capstones,
	dataDragonVersion,
}: {
	capstones: ProfileCapstones;
	dataDragonVersion: string;
}) {
	const { getChallengeTierIcon } = useDataDragonPath(dataDragonVersion);

	const crystalTile = capstones.crystal
		? {
				...toTile(capstones.crystal, "Challenges Crystal", "crystal"),
				iconSrc: getChallengeTierIcon(CRYSTAL_ICON_CHALLENGE_ID, capstones.crystal.level),
			}
		: null;

	const categoryTiles = capstones.categories.map((category) =>
		toTile(category, category.label, category.key),
	);

	return (
		<Card className="gap-4 py-4">
			<CardHeader className="px-4 pb-0">
				<h3 className="text-lg font-semibold">Capstones</h3>
				<p className="text-muted-foreground text-sm">
					The Challenges Crystal and the five categories it is scored from
				</p>
			</CardHeader>
			<CardContent className="px-4">
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
					{crystalTile ? (
						<div className="col-span-2 sm:col-span-3">
							<CapstoneCard tile={crystalTile} />
						</div>
					) : null}
					{categoryTiles.map((tile) => (
						<CapstoneCard key={tile.key} tile={tile} />
					))}
				</div>
			</CardContent>
		</Card>
	);
}
