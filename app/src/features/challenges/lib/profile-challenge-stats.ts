import type { ProfileChallengeRow } from "~/features/challenges/types/profile-challenge-row";

/** Highest → lowest; must match challenge config / leaderboard tier bars. */
const TIER_ORDER = [
	"CHALLENGER",
	"GRANDMASTER",
	"MASTER",
	"DIAMOND",
	"PLATINUM",
	"GOLD",
	"SILVER",
	"BRONZE",
	"IRON",
] as const;

/** Iron → Challenger; matches leaderboard ladder order. */
const TIER_ORDER_ASC = [...TIER_ORDER].reverse() as readonly string[];

function tierAscIndex(tier: string): number {
	return (TIER_ORDER_ASC as readonly string[]).indexOf(tier.toUpperCase());
}

function formatTierName(tier: string): string {
	const t = tier.toLowerCase();
	return t.charAt(0).toUpperCase() + t.slice(1);
}

/**
 * Riot's per-challenge `percentile` is treated as "percent of players you outperform" (0–100).
 * Maps to an exclusive "Top X%" tail; returns null when the value is not meaningful to show.
 */
export function formatChallengeTopPercentLabel(percentile: number): string | null {
	if (!Number.isFinite(percentile)) return null;
	if (percentile < 0 || percentile > 100) return null;
	const topPct = 100 - percentile;
	// Hide broad buckets (e.g. percentile 0 → "Top 100%").
	if (topPct > 25) return null;
	if (topPct <= 0) return "Top <0.1%";

	const body =
		topPct >= 10
			? String(Math.round(topPct))
			: topPct >= 1
				? (() => {
						const r = Math.round(topPct * 10) / 10;
						return Number.isInteger(r) ? String(r) : r.toFixed(1);
					})()
				: topPct >= 0.1
					? topPct.toFixed(1).replace(/\.?0+$/, "") || "0"
					: topPct >= 0.01
						? topPct.toFixed(2).replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "")
						: "<0.01";

	return `Top ${body}%`;
}

export type ThresholdLadderEntry = { tier: string; points: number };

export type LadderSegment =
	| { kind: "tier"; entry: ThresholdLadderEntry; index: number }
	| { kind: "score"; value: number };

/** Places the live score between threshold pills in point order (low → high). */
export function buildChallengeLadderSegments(
	entries: readonly ThresholdLadderEntry[],
	currentValue: number | null,
): LadderSegment[] {
	const out: LadderSegment[] = [];
	if (entries.length === 0) return out;
	if (currentValue == null || !Number.isFinite(currentValue)) {
		for (let i = 0; i < entries.length; i++) {
			out.push({ kind: "tier", entry: entries[i]!, index: i });
		}
		return out;
	}
	const v = currentValue;
	if (v < entries[0]!.points) {
		out.push({ kind: "score", value: v });
	}
	for (let i = 0; i < entries.length; i++) {
		const e = entries[i]!;
		out.push({ kind: "tier", entry: e, index: i });
		const aboveThis = v >= e.points;
		const belowNext = i + 1 >= entries.length || v < entries[i + 1]!.points;
		if (aboveThis && belowNext) {
			out.push({ kind: "score", value: v });
		}
	}
	return out;
}

export type TierPillState = "cleared" | "current" | "next" | "upcoming";

/** Positive thresholds only, sorted low tier → high tier (Iron → Challenger). */
export function getOrderedChallengeThresholds(
	thresholds: Record<string, number>,
): ThresholdLadderEntry[] {
	const list: ThresholdLadderEntry[] = [];
	for (const [k, v] of Object.entries(thresholds)) {
		if (v > 0) list.push({ tier: k.toUpperCase(), points: v });
	}
	return list.sort((a, b) => {
		const ia = tierAscIndex(a.tier);
		const ib = tierAscIndex(b.tier);
		const fa = ia === -1 ? 999 : ia;
		const fb = ib === -1 ? 999 : ib;
		if (fa !== fb) return fa - fb;
		return a.points - b.points;
	});
}

export type ProfileChallengeThresholdStripModel = {
	entries: ThresholdLadderEntry[];
	pillStates: TierPillState[];
	/** One-line hint under the ladder (score / points to next / top tier). */
	footerHint: string | null;
	/** Synced numeric score from the API, when present. */
	currentValue: number | null;
};

export function getProfileChallengeThresholdStripModel(
	row: ProfileChallengeRow,
	challengesSynced: boolean,
): ProfileChallengeThresholdStripModel {
	const entries = getOrderedChallengeThresholds(row.thresholds);
	if (entries.length === 0) {
		return { entries, pillStates: [], footerHint: null, currentValue: null };
	}

	const progress = row.progress;
	const value = progress?.value;
	const numericCurrent =
		challengesSynced && value != null && Number.isFinite(value) ? value : null;
	const pillStates: TierPillState[] = [];

	if (challengesSynced && value != null && Number.isFinite(value)) {
		let nextEntry: ThresholdLadderEntry | null = null;
		for (const e of entries) {
			if (value < e.points) {
				nextEntry = e;
				break;
			}
		}
		for (const e of entries) {
			if (value >= e.points) pillStates.push("cleared");
			else if (nextEntry && e.tier === nextEntry.tier) pillStates.push("next");
			else pillStates.push("upcoming");
		}
		let footerHint: string | null = null;
		if (nextEntry) {
			const gap = nextEntry.points - value;
			footerHint = `+${gap.toLocaleString()} → ${formatTierName(nextEntry.tier)} (${nextEntry.points.toLocaleString()})`;
		}
		return { entries, pillStates, footerHint, currentValue: numericCurrent };
	}

	let currentIdx = -1;
	const level = progress?.level?.toUpperCase() ?? null;
	if (challengesSynced && level) {
		const exact = entries.findIndex((e) => e.tier === level);
		if (exact >= 0) {
			currentIdx = exact;
		} else {
			const li = tierAscIndex(level);
			if (li >= 0) {
				for (let i = 0; i < entries.length; i++) {
					const ei = tierAscIndex(entries[i].tier);
					if (ei >= 0 && ei <= li) currentIdx = i;
				}
			}
		}
	}

	for (let i = 0; i < entries.length; i++) {
		if (currentIdx < 0) pillStates.push("upcoming");
		else if (i < currentIdx) pillStates.push("cleared");
		else if (i === currentIdx) pillStates.push("current");
		else if (i === currentIdx + 1) pillStates.push("next");
		else pillStates.push("upcoming");
	}

	let footerHint: string | null = null;
	if (challengesSynced && currentIdx >= 0 && currentIdx + 1 < entries.length) {
		const ne = entries[currentIdx + 1];
		footerHint = `Next: ${formatTierName(ne.tier)} · ${ne.points.toLocaleString()}`;
	} else if (!challengesSynced) {
		footerHint = null;
	}

	return { entries, pillStates, footerHint, currentValue: numericCurrent };
}

function tierIndex(level: string | null): number | null {
	if (!level) return null;
	const u = level.toUpperCase();
	const i = (TIER_ORDER as readonly string[]).indexOf(u);
	return i === -1 ? null : i;
}

/** Best tier that exists for this challenge (thresholds from Riot config). */
export function getHighestTierForChallenge(thresholds: Record<string, number>): string | null {
	const upper: Record<string, number> = {};
	for (const [k, v] of Object.entries(thresholds)) {
		upper[k.toUpperCase()] = v;
	}
	for (const tier of TIER_ORDER) {
		const v = upper[tier];
		if (v !== undefined && v > 0) return tier;
	}
	return null;
}

/**
 * True when synced numeric score meets the ladder's top threshold.
 * Riot sometimes leaves `progress.level` behind the score, so this backs maxed detection.
 */
function isNumericProgressAtOrAboveCap(
	row: ProfileChallengeRow,
	challengesSynced: boolean,
): boolean {
	if (!challengesSynced) return false;
	const value = row.progress?.value;
	if (value == null || !Number.isFinite(value)) return false;
	const entries = getOrderedChallengeThresholds(row.thresholds);
	if (entries.length === 0) return false;
	const capPoints = entries[entries.length - 1]!.points;
	return value >= capPoints;
}

export function isChallengeAtHighestTier(
	row: ProfileChallengeRow,
	challengesSynced: boolean,
): boolean {
	if (!challengesSynced) return false;
	const cap = getHighestTierForChallenge(row.thresholds);
	if (!cap) return false;
	const level = row.progress?.level?.toUpperCase() ?? null;
	if (level != null && level === cap) return true;
	return isNumericProgressAtOrAboveCap(row, challengesSynced);
}

/** Has a tier ladder and is not yet at the top tier (includes no progress yet). */
export function isLeftToMaxChallenge(
	row: ProfileChallengeRow,
	challengesSynced: boolean,
): boolean {
	if (!challengesSynced) return false;
	if (getHighestTierForChallenge(row.thresholds) === null) return false;
	return !isChallengeAtHighestTier(row, challengesSynced);
}

export function computeProfileChallengeStats(
	rows: ProfileChallengeRow[],
	challengesSynced: boolean,
) {
	const total = rows.length;
	let maxed = 0;
	let withTierLadder = 0;

	for (const row of rows) {
		if (getHighestTierForChallenge(row.thresholds) !== null) {
			withTierLadder += 1;
		}
		if (isChallengeAtHighestTier(row, challengesSynced)) {
			maxed += 1;
		}
	}

	const remainingToMax =
		challengesSynced ? Math.max(0, withTierLadder - maxed) : 0;

	return {
		total,
		withTierLadder,
		maxed,
		remainingToMax,
	};
}

/**
 * Ascending sort key: lower = closer to finishing the tier ladder (1 = one tier below cap).
 * Buckets: gaps 1…n, then unknown progress, maxed, no ladder.
 */
function nearCompletionSortKey(
	row: ProfileChallengeRow,
	challengesSynced: boolean,
): number {
	if (!challengesSynced) return 0;
	const cap = getHighestTierForChallenge(row.thresholds);
	if (!cap) return 10_000;
	if (isChallengeAtHighestTier(row, challengesSynced)) return 9000;
	const capIdx = tierIndex(cap);
	if (capIdx === null) return 10_000;
	const curIdx = tierIndex(row.progress?.level ?? null);
	if (curIdx === null) return 500;
	const gap = curIdx - capIdx;
	if (gap <= 0) return 1;
	return Math.min(gap, 499);
}

/** Sort: closest to max tier first, then maxed, then challenges without a tier ladder. */
export function compareProfileChallengesByNearCompletion(
	a: ProfileChallengeRow,
	b: ProfileChallengeRow,
	challengesSynced: boolean,
): number {
	const d =
		nearCompletionSortKey(a, challengesSynced) - nearCompletionSortKey(b, challengesSynced);
	if (d !== 0) return d;
	return a.name.localeCompare(b.name);
}
