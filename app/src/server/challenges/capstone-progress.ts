import { and, asc, eq, inArray, sql } from "drizzle-orm";

import { db } from "~/db";
import { categoryPoints, challenge, totalPoints } from "~/db/schema";

/**
 * The six "capstone" challenge ids - Riot's own aggregates rather than challenges a player earns.
 *
 * `0` is the overall Challenges Crystal: the five category totals above it sum into its score.
 * `1`-`5` are the categories. They live in `ChallengesConfig` with real thresholds (which is why
 * the challenge list can and does render them) but their progress is published as aggregates, not
 * as `Challenge` rows, so it can only come from `TotalPoints` and `CategoryPoints`.
 */
export const CRYSTAL_CHALLENGE_ID = 0;

/**
 * The five category aggregates, in Riot's own display order.
 *
 * Names, not the category ids: `CategoryPoints.category` and the API's own aggregate payload are
 * keyed by these strings, so a tags-driven list (`tags->>'isCategory' = 'true'` on ids 0-5) would
 * have to join name to id on every read for no gain. The five names are fixed by Riot.
 */
export const CAPSTONE_CATEGORY_ORDER = [
	"IMAGINATION",
	"EXPERTISE",
	"VETERANCY",
	"TEAMWORK",
	"COLLECTION",
] as const;

export type CapstoneCategoryKey = (typeof CAPSTONE_CATEGORY_ORDER)[number];

/**
 * Title-cased labels for the category keys the API publishes.
 *
 * The categories have no published art - CommunityDragon ships a challenge token per challenge and
 * one shared per-tier crystal crest under `00_crystals/`, and nothing per category - so a legible
 * name is the only thing that distinguishes the five cards. They are labelled here rather than in
 * the component so the raw key never reaches the page.
 */
const CATEGORY_LABELS = {
	IMAGINATION: "Imagination",
	EXPERTISE: "Expertise",
	VETERANCY: "Veterancy",
	TEAMWORK: "Teamwork",
	COLLECTION: "Collection",
} as const satisfies Record<CapstoneCategoryKey, string>;

export type CapstoneAggregate = {
	level: string;
	current: number;
	max: number;
	/**
	 * `percentile` as Riot publishes it *for the aggregates*: a percentage, so `0.001` is the top
	 * 0.1%. `Challenge.percentile` carries the same player's figure as a 0-1 *fraction* (verified
	 * against the DB: challenge 0 is `0.001`, `TotalPoints` is `0.001`, `CategoryPoints` falls in
	 * `0.001`-`0.413`, while the same rows in `Challenge` fall in `0.001`-`1`). The panel divides by
	 * 100 before labelling, so it must not assume this is already a fraction.
	 */
	percentile: number | null;
	/**
	 * `Challenge.playersInLevel` for the Crystal row. Riot only publishes it for a handful of
	 * challenges, so it is usually null; null is drawn as nothing rather than a zero.
	 */
	playersInLevel: number | null;
};

export type CapstoneCategoryEntry = CapstoneAggregate & {
	key: CapstoneCategoryKey;
	label: string;
};

/**
 * The capstone progress a profile can show.
 *
 * Not a nullable wrapper: the three tables are written together, but the panel copes when only
 * some of them carry rows.
 */
export type ProfileCapstones = {
	crystal: CapstoneAggregate | null;
	categories: CapstoneCategoryEntry[];
};

/** A `CategoryPoints.category` value is only useful to us when it is one of the five we know. */
function isCapstoneCategoryKey(value: string): value is CapstoneCategoryKey {
	return (CAPSTONE_CATEGORY_ORDER as readonly string[]).includes(value);
}

/** Read the Crystal aggregate. Null means `TotalPoints` has no row for this puuid. */
async function getTotalPointsForPuuid(puuid: string): Promise<CapstoneAggregate | null> {
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

	if (!row) return null;
	return { ...row, playersInLevel: await getCrystalPlayersInLevel(puuid) };
}

/**
 * How many players sit in the Crystal's tier, from the Crystal's own `Challenge` row.
 *
 * Only the Crystal has this: the five category aggregates have no `Challenge` row of their own, so
 * `playersInLevel` is null for them by construction rather than by a missing fetch.
 */
async function getCrystalPlayersInLevel(puuid: string): Promise<number | null> {
	const [row] = await db
		.select({ playersInLevel: challenge.playersInLevel })
		.from(challenge)
		.where(
			and(
				eq(challenge.challengesDetailsId, puuid),
				eq(challenge.challengeId, CRYSTAL_CHALLENGE_ID),
			),
		)
		.limit(1);

	return row?.playersInLevel ?? null;
}

/**
 * Read the five category aggregates.
 *
 * The ordering expression is a documented input here rather than a parameter, so the case can only
 * carry the five keys this module knows and the builder cannot be handed something unchecked.
 */
function capstoneCategoryRank() {
	return sql<number>`case ${categoryPoints.category}
		when 'IMAGINATION' then 1
		when 'EXPERTISE' then 2
		when 'VETERANCY' then 3
		when 'TEAMWORK' then 4
		when 'COLLECTION' then 5
		else 99
	end`;
}

async function getCategoryPointsForPuuid(puuid: string): Promise<CapstoneCategoryEntry[]> {
	const rows = await db
		.select({
			category: categoryPoints.category,
			level: categoryPoints.level,
			current: categoryPoints.current,
			max: categoryPoints.max,
			percentile: categoryPoints.percentile,
		})
		.from(categoryPoints)
		.where(
			and(
				eq(categoryPoints.challengesDetailsId, puuid),
				inArray(categoryPoints.category, [...CAPSTONE_CATEGORY_ORDER]),
			),
		)
		.orderBy(asc(capstoneCategoryRank()));

	const entries: CapstoneCategoryEntry[] = [];
	for (const row of rows) {
		if (!isCapstoneCategoryKey(row.category)) continue;
		entries.push({
			key: row.category,
			label: CATEGORY_LABELS[row.category],
			level: row.level,
			current: row.current,
			max: row.max,
			percentile: row.percentile,
			playersInLevel: null,
		});
	}
	return entries;
}

/**
 * Capstone progress for one summoner, or null when nothing has been synced for them yet.
 *
 * Null is the "not synced" signal the panel renders as nothing - a summoner whose aggregates were
 * never fetched must not be shown zeros that look like real scores.
 */
export async function getProfileCapstones(puuid: string): Promise<ProfileCapstones | null> {
	const [crystal, categories] = await Promise.all([
		getTotalPointsForPuuid(puuid),
		getCategoryPointsForPuuid(puuid),
	]);

	if (crystal === null && categories.length === 0) return null;

	return { crystal, categories };
}
