import type {
	ProfileChallengeRow,
	ProfileChallengesProgressInput,
} from "~/features/challenges/types/profile-challenge-row";

/**
 * Shape produced by `getChallengesConfig()` — local type only (no `~/features/shared/types` → schema).
 */
type ChallengesConfigEntry = {
	config: { id: number; thresholds: unknown };
	localization: {
		name: string;
		shortDescription: string;
		description: string;
	} | null;
};

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
		.filter((r) => r.name.trim().length > 0);

	rows.sort((a, b) => a.name.localeCompare(b.name));
	return rows;
}
