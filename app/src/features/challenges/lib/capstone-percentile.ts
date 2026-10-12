/**
 * Rank labels for the profile capstone panel.
 *
 * Riot publishes a percentile per challenge, per player. Measured in this database the figure is a
 * *top fraction*: challenge 0 (the Crystal) for puuid `2Fwn3xz…bfA` is `0.001`, and the same player's
 * `TotalPoints.percentile` is `0.001` while every `CategoryPoints.percentile` falls in
 * `0.001`-`0.413` - i.e. the aggregates carry the same number 100x larger, so `0.1` there is the
 * same rank as `0.001` in `Challenge`. `0.069` therefore reads as the top 6.9%, which is the reading
 * the owner confirmed against challenges.darkintaqt.com.
 *
 * `formatChallengeTopPercentLabel` in `./profile-challenge-stats.ts` is deliberately not reused
 * here. It is a different convention: its input is "percentile 0-100" and it computes `100 - input`
 * as the tail, so a genuinely top-0.1% figure (0.1) would come out as the nonsense label "Top 99.9%",
 * and everything in the top 25% is suppressed. Its callers pass the 0-1 `Challenge.percentile`, so
 * the two conventions are already at odds in the challenge list. That is a separate defect to
 * settle on its own; this panel must not inherit it.
 */

/** Broad buckets are not worth a label - a top-40% line says nothing. */
const MAX_LABELLED_TOP_PERCENT = 25;

function formatTopPercentBody(topPercent: number): string {
	if (topPercent >= 10) return String(Math.round(topPercent));
	if (topPercent >= 1) {
		const rounded = Math.round(topPercent * 10) / 10;
		return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
	}
	if (topPercent >= 0.1) return topPercent.toFixed(1).replace(/\.?0+$/, "") || "0";
	if (topPercent >= 0.01) {
		return topPercent
			.toFixed(2)
			.replace(/(\.\d*?)0+$/, "$1")
			.replace(/\.$/, "");
	}
	return "<0.01";
}

/**
 * A top fraction (0.069) as its label ("Top 6.9%"), or null when the value is out of range or too
 * broad to be worth printing. Null is a deliberate "render no rank line", not an error.
 */
export function formatCapstoneTopPercent(percentile: number | null): string | null {
	if (percentile === null || !Number.isFinite(percentile)) return null;
	if (percentile < 0 || percentile > 1) return null;

	const topPercent = percentile * 100;
	if (topPercent > MAX_LABELLED_TOP_PERCENT) return null;
	if (topPercent <= 0) return "Top <0.1%";

	return `Top ${formatTopPercentBody(topPercent)}%`;
}

/** "Top 6.9%" -> "6.9" / "<0.1" / "<0.01", for joining beside a player count. */
export function capstoneTopPercentValue(label: string): string {
	return label.replace(/^Top /, "").replace(/%$/, "");
}
