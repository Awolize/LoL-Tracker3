import { and, eq, inArray } from "drizzle-orm";

import { db } from "~/db";
import {
	challenge,
	challengeLocalization,
	challengeTitle,
	preferences,
	totalPoints,
} from "~/db/schema";

/** The challenge score: Riot's `TotalPoints` row for one summoner. */
export type ProfileSummaryScore = {
	level: string;
	current: number;
	max: number;
	/** Riot publishes this as a 0-1 *top fraction* (0.001 = top 0.1%). */
	percentile: number | null;
};

/** One challenge the summoner pinned, with the tier they reached on it. */
export type ProfileSummaryPin = {
	id: number;
	name: string;
	/** `Challenge.level`; null when Riot reports `NONE` or has no row for it at all. */
	level: string | null;
	value: number | null;
};

export type ProfileSummary = {
	/** Null when `TotalPoints` has no row for the puuid. */
	score: ProfileSummaryScore | null;
	/** `Preferences.title` resolved through `ChallengeTitle`; null when unset or unknown. */
	title: string | null;
	/** In the order Riot stores them; empty when nothing is pinned or nothing resolves. */
	pins: ProfileSummaryPin[];
};

/** Ids 0-5 are the category aggregates, and Riot writes -1 for an empty pin slot. */
const FIRST_PINNABLE_CHALLENGE_ID = 6;
const TITLE_ID_PATTERN = /^\d+$/;

function isPinnableChallengeId(id: number): boolean {
	return Number.isInteger(id) && id >= FIRST_PINNABLE_CHALLENGE_ID;
}

/**
 * `Challenge.level` is Riot's tier name, except for `NONE` - what it writes when a challenge has no
 * tier yet. Null is what the icon helper draws as unranked art.
 */
function normalizeLevel(level: string | null | undefined): string | null {
	if (level == null) return null;
	const trimmed = level.trim();
	if (trimmed.length === 0 || trimmed.toUpperCase() === "NONE") return null;
	return trimmed;
}

async function readScore(puuid: string): Promise<ProfileSummaryScore | null> {
	const [row] = await db
		.select({
			level: totalPoints.level,
			current: totalPoints.current,
			max: totalPoints.max,
			percentile: totalPoints.percentile,
		})
		.from(totalPoints)
		.where(eq(totalPoints.challengesDetailsId, puuid))
		.limit(1);

	return row ?? null;
}

/**
 * Resolve `Preferences.title` - which stores the title's numeric `itemId` - to its name.
 *
 * Null is the answer for anything unresolved: an unset preference is the empty string, and a title
 * the backfill never saw must be omitted rather than guessed at. Titles come from CommunityDragon's
 * `titles` map via `pnpm db:backfill-challenge-tags`.
 */
async function readTitleName(titleId: string | null | undefined): Promise<string | null> {
	if (titleId == null || !TITLE_ID_PATTERN.test(titleId)) return null;

	const [row] = await db
		.select({ name: challengeTitle.name })
		.from(challengeTitle)
		.where(eq(challengeTitle.itemId, Number.parseInt(titleId, 10)))
		.limit(1);

	return row?.name ?? null;
}

/**
 * The pinned challenges, in the player's own pin order.
 *
 * An id with no `en_US` localization is not a catalogued challenge, so it is dropped rather than
 * drawn as a token with an invented name; an id with no `Challenge` row is kept and simply has no
 * tier, which the panel draws as unranked.
 */
async function readPins(puuid: string, ids: number[]): Promise<ProfileSummaryPin[]> {
	if (ids.length === 0) return [];

	const [progressRows, localizationRows] = await Promise.all([
		db
			.select({
				challengeId: challenge.challengeId,
				level: challenge.level,
				value: challenge.value,
			})
			.from(challenge)
			.where(
				and(eq(challenge.challengesDetailsId, puuid), inArray(challenge.challengeId, ids)),
			),
		db
			.select({ id: challengeLocalization.id, name: challengeLocalization.name })
			.from(challengeLocalization)
			.where(
				and(
					inArray(challengeLocalization.id, ids),
					eq(challengeLocalization.language, "en_US"),
				),
			),
	]);

	const progressById = new Map(progressRows.map((row) => [row.challengeId, row]));
	const nameById = new Map(localizationRows.map((row) => [row.id, row.name]));

	const pins: ProfileSummaryPin[] = [];
	for (const id of ids) {
		const name = nameById.get(id);
		if (name === undefined) continue;

		const progress = progressById.get(id);
		pins.push({
			id,
			name,
			level: normalizeLevel(progress?.level),
			value: progress?.value ?? null,
		});
	}

	return pins;
}

/**
 * Header summary for the profile hub: the challenge score, the player's pinned challenges and their
 * title. `Preferences` is read here for the first time - it holds the pins and the title id - and
 * `ChallengeTitle` resolves that id to a name.
 *
 * Null means nothing at all is stored for the puuid: a summoner who has never been synced must not
 * be shown a card of zeros that reads like a real score.
 */
export async function getProfileSummary(puuid: string): Promise<ProfileSummary | null> {
	const [[preferencesRow], score] = await Promise.all([
		db
			.select({ title: preferences.title, challengeIds: preferences.challengeIds })
			.from(preferences)
			.where(eq(preferences.challengesDetailsId, puuid))
			.limit(1),
		readScore(puuid),
	]);

	if (preferencesRow === undefined && score === null) return null;

	const pinnedIds = (preferencesRow?.challengeIds ?? []).filter(isPinnableChallengeId);
	const [pins, title] = await Promise.all([
		readPins(puuid, pinnedIds),
		readTitleName(preferencesRow?.title),
	]);

	return { score, title, pins };
}
