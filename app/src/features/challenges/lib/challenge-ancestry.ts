import type { ChallengeTags } from "~/db/schema";

/**
 * Riot's six category aggregates: `ChallengesConfig.tags->>'isCategory' = 'true'` on exactly these
 * ids, whose `ChallengeLocalization` names are CRYSTAL, IMAGINATION, EXPERTISE, VETERANCY, TEAMWORK
 * and COLLECTION.
 */
export const CHALLENGE_CATEGORY_IDS = [0, 1, 2, 3, 4, 5] as const;

/** Challenge id -> its `tags`, or `null` when the id is unknown or carries no markers. */
export type ChallengeTagsById = ReadonlyMap<number, ChallengeTags | null>;

export type ChallengeAncestor = { id: number; tags: ChallengeTags | null };

export function isChallengeCategoryId(id: number): boolean {
	return (CHALLENGE_CATEGORY_IDS as readonly number[]).includes(id);
}

/**
 * `id` followed by each `tags.parent` ancestor, nearest first.
 *
 * `parent` is a string id on the wire, so it is only followed when it is entirely digits - anything
 * else (absent, empty, malformed) ends the walk rather than resolving to 0. A repeated id ends it
 * too: the catalog comes from outside, and a cycle must not spin here.
 */
export function readChallengeAncestry(
	id: number,
	tagsById: ChallengeTagsById,
): ChallengeAncestor[] {
	const ancestry: ChallengeAncestor[] = [];
	const seen = new Set<number>();
	let current: number | undefined = id;

	while (current !== undefined && !seen.has(current)) {
		seen.add(current);
		const tags: ChallengeTags | null = tagsById.get(current) ?? null;
		ancestry.push({ id: current, tags });

		const parent: string | undefined = tags?.parent;
		current =
			parent !== undefined && /^\d+$/.test(parent) ? Number.parseInt(parent, 10) : undefined;
	}

	return ancestry;
}

/**
 * The category a challenge really belongs to: the first id in 0-5 on its `tags.parent` chain.
 *
 * The first digit of the id is *not* the category. Riot's ids are per family, and they disagree
 * with the categories they hang off: the 3xxxxx families resolve to TEAMWORK (4) and the 4xxxxx
 * families resolve to VETERANCY (3), so 146 of the 399 catalogued challenges land in the wrong tab
 * under the old "first digit" rule.
 *
 * `null` means the chain reached no category at all - the retired seasonal families and the
 * Arena/Swarm ids, which the caller buckets as legacy.
 */
export function resolveChallengeCategoryId(id: number, tagsById: ChallengeTagsById): number | null {
	for (const ancestor of readChallengeAncestry(id, tagsById)) {
		if (isChallengeCategoryId(ancestor.id)) return ancestor.id;
	}
	return null;
}
