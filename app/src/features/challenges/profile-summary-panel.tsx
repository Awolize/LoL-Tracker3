import { Card, CardContent } from "~/components/ui/card";
import {
	formatChallengeTopPercentLabel,
	tierTextColor,
} from "~/features/challenges/lib/profile-challenge-stats";
import { useDataDragonPath } from "~/features/shared/hooks/useDataDragonPath";
import type { ProfileSummary, ProfileSummaryPin } from "~/server/challenges/profile-summary";

function PinToken({
	pin,
	getChallengeTierIcon,
}: {
	pin: ProfileSummaryPin;
	getChallengeTierIcon: (challengeId: number, tier: string | null) => string;
}) {
	return (
		<li className="border-border bg-muted/30 flex min-w-0 items-center gap-2 rounded-lg border p-2">
			<img
				src={getChallengeTierIcon(pin.id, pin.level)}
				alt=""
				className="size-9 shrink-0 object-contain"
				loading="lazy"
			/>
			<div className="min-w-0">
				<div className="truncate text-xs font-semibold">{pin.name}</div>
				<div
					className="text-[10px] font-bold tracking-wide uppercase"
					style={{ color: tierTextColor(pin.level) }}
				>
					{pin.level ?? "Unranked"}
				</div>
			</div>
		</li>
	);
}

/**
 * The profile hub's header section: challenge score with rank, the title the player wears, and the
 * three challenges they pinned, drawn as per-tier tokens.
 *
 * The hub's own header directly above already draws the profile icon, Riot ID, region and level, so
 * this panel starts at the score rather than repeating them. The score and pins come from
 * `TotalPoints` and `Preferences` - the latter read here for the first time - and only the title
 * needs a name that Riot ships outside the player payload, which is what `ChallengeTitle` is for. A
 * title that backfill has not seen is omitted rather than guessed at.
 */
export function ProfileSummaryPanel({
	summary,
	dataDragonVersion,
}: {
	summary: ProfileSummary;
	dataDragonVersion: string;
}) {
	const { getChallengeTierIcon } = useDataDragonPath(dataDragonVersion);

	const score = summary.score;
	const topLabel =
		score?.percentile != null ? formatChallengeTopPercentLabel(score.percentile) : null;

	return (
		<Card className="gap-4 py-4">
			<CardContent className="flex flex-col gap-3 px-4">
				<div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
					<div className="min-w-0">
						<div className="text-muted-foreground text-[10px] font-semibold tracking-wide uppercase">
							Challenge score
						</div>
						{score ? (
							<div className="flex items-baseline gap-2">
								<span className="text-3xl font-bold tabular-nums">
									{score.current.toLocaleString()}
								</span>
								<span className="text-muted-foreground text-sm tabular-nums">
									/ {score.max.toLocaleString()}
								</span>
							</div>
						) : (
							<span className="text-muted-foreground text-sm">
								No challenge progress stored yet.
							</span>
						)}
					</div>

					{score ? (
						<div className="flex items-center gap-2">
							<span
								className="text-sm font-bold tracking-wide uppercase"
								style={{ color: tierTextColor(score.level) }}
							>
								{score.level}
							</span>
							{topLabel ? (
								<span className="border-border bg-muted/50 text-muted-foreground rounded-md border px-2 py-0.5 text-xs font-semibold tabular-nums">
									{topLabel}
								</span>
							) : null}
						</div>
					) : null}
				</div>

				{summary.title ? (
					<div className="text-muted-foreground text-xs">
						Title:{" "}
						<span className="text-foreground font-semibold">{summary.title}</span>
					</div>
				) : null}

				{summary.pins.length > 0 ? (
					<ul className="grid grid-cols-1 gap-2 sm:grid-cols-3">
						{summary.pins.map((pin) => (
							<PinToken
								key={pin.id}
								pin={pin}
								getChallengeTierIcon={getChallengeTierIcon}
							/>
						))}
					</ul>
				) : null}
			</CardContent>
		</Card>
	);
}
