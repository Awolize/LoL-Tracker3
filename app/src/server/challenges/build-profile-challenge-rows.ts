import type { ChallengeTags } from "~/db/schema";
import type { ChallengeTagsById } from "~/features/challenges/lib/challenge-ancestry";
import { isChallengeAtHighestTier } from "~/features/challenges/lib/profile-challenge-stats";
import type {
	ProfileChallengeRow,
	ProfileChallengesProgressInput,
} from "~/features/challenges/types/profile-challenge-row";
import { isRetiredSeasonalChallenge } from "~/server/challenges/challenge-tags";

/**
 * Shape produced by `getChallengesConfig()` - local type only (no `~/features/shared/types` → schema).
 */
type ChallengesConfigEntry = {
	config: { id: number; thresholds: unknown; tags: ChallengeTags | null };
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

/**
 * Retired seasonal challenges can never be completed again, so a seasonal one the summoner never
 * touched would sit in "left to max" forever - permanently misleading. Drop those, but keep a
 * seasonal challenge that was actually earned: it is a trophy, and it correctly counts as finished.
 *
 * The marker is Riot's own `tags`, not the localized name. The old rule matched
 * `/20\d\d|seasonal/i` and happened to select the right set - the seasonal families are the only
 * names carrying a year - but a rename or a localization edit would silently change what is
 * dropped, while the tag says it outright. Measured against the old rule over the 405-row catalog:
 * 67 selected either way, 0 in the symmetric difference, and for the reference puuid 49 kept /
 * 18 dropped, so the profile counts are unchanged.
 */
export function buildProfileChallengeRows(
	configs: ChallengesConfigEntry[],
	progressMap: ProfileChallengesProgressInput,
): ProfileChallengeRow[] {
	const challengesSynced = progressMap !== null;
	const tagsById: ChallengeTagsById = new Map(
		configs.map((c) => [c.config.id, c.config.tags ?? null]),
	);
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
				!isRetiredSeasonalChallenge(r.id, tagsById) ||
				isChallengeAtHighestTier(r, challengesSynced),
		);

	rows.sort((a, b) => a.name.localeCompare(b.name));
	return rows;
}
