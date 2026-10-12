import { isChallengeAtHighestTier } from "~/features/challenges/lib/profile-challenge-stats";
import type {
	ProfileChallengeRow,
	ProfileChallengesProgressInput,
} from "~/features/challenges/types/profile-challenge-row";

/**
 * Shape produced by `getChallengesConfig()` - local type only (no `~/features/shared/types` → schema).
 */
type ChallengesConfigEntry = {
	config: { id: number; thresholds: unknown };
	localization: {
		name: string;
		shortDescription: string;
		description: string;
	} | null;
};

/**
 * Retired seasonal challenges can never be completed again, so a seasonal one the summoner never
 * touched would sit in "left to max" forever - permanently misleading. Drop those, but keep a
 * seasonal challenge that was actually earned: it is a trophy, and it correctly counts as finished.
 *
 * The name is the only reliable marker. The seasonal families happen to use 7-digit ids
 * (`2023000`, `2024100`…), but ordinary, still-active challenges use 6-digit ids that merely start
 * with a year (`202300` "Perfection", `202301` "Immortal"), so an id-prefix rule would delete live
 * challenges. Matching the year or the word "Seasonal" in the name does not.
 */
const RETIRED_SEASONAL_NAME_PATTERN = /20\d\d|seasonal/i;

function isRetiredSeasonalChallengeName(name: string): boolean {
	return RETIRED_SEASONAL_NAME_PATTERN.test(name);
}

function rowProgress(
	progressMap: ProfileChallengesProgressInput,
	challengeId: number,
): ProfileChallengeRow["progress"] {
	if (progressMap === null) return null;
	const row = progressMap[challengeId];
	if (!row) {
		return { level: null, value: null, percentile: null };
	}
	return {
		level: row.level,
		value: row.value,
		percentile: row.percentile,
	};
}

export function buildProfileChallengeRows(
	configs: ChallengesConfigEntry[],
	progressMap: ProfileChallengesProgressInput,
): ProfileChallengeRow[] {
	const challengesSynced = progressMap !== null;
	const rows = configs
		.map((c) => {
			const id = c.config.id;
			const name = c.localization?.name?.trim() || `Challenge ${id}`;
			const shortDescription =
				c.localization?.shortDescription ?? c.localization?.description ?? null;
			return {
				id,
				name,
				shortDescription,
				thresholds: (c.config.thresholds ?? {}) as Record<string, number>,
				progress: rowProgress(progressMap, id),
			};
		})
		.filter((r) => r.name.trim().length > 0)
		.filter(
			(r) =>
				!challengesSynced ||
				!isRetiredSeasonalChallengeName(r.name) ||
				isChallengeAtHighestTier(r, challengesSynced),
		);

	rows.sort((a, b) => a.name.localeCompare(b.name));
	return rows;
}
