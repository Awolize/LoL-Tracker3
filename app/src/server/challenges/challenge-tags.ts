import type { ChallengeTags } from "~/db/schema";

/**
 * Riot's own markers for what a challenge config *is*, read out of `ChallengesConfig.tags`.
 *
 * These replace the id-range guesses the image proxy and the capstone panel used to make. The
 * values are strings on the wire, which is why the comparisons are against `"Y"` and `"true"`:
 * Riot publishes the capstone flag as a Y/N string and the category flag as a lowercase boolean
 * string.
 */
export const CAPSTONE_TAG = "isCapstone";
export const CAPSTONE_TAG_VALUE = "Y";

export const CATEGORY_TAG = "isCategory";
export const CATEGORY_TAG_VALUE = "true";

function isStringRecord(value: unknown): value is Record<string, string> {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
	for (const entry of Object.values(value)) {
		if (typeof entry !== "string") return false;
	}
	return true;
}

/**
 * Read the `tags` object off a payload we did not type.
 *
 * Null and `{}` mean different things and must stay different: `null` is "the payload carried no
 * tags" (so any reader falls back to what it knew before), while `{}` is "the game says this
 * challenge has no markers". A tags object with a non-string value is rejected wholesale rather
 * than half-stored, so a shape change degrades to the fallback instead of to wrong data.
 */
export function parseChallengeTags(value: unknown): ChallengeTags | null {
	if (!isStringRecord(value)) return null;
	return value;
}

export function isCapstoneTags(tags: ChallengeTags | null): boolean {
	return tags?.[CAPSTONE_TAG] === CAPSTONE_TAG_VALUE;
}

export function isCategoryTags(tags: ChallengeTags | null): boolean {
	return tags?.[CATEGORY_TAG] === CATEGORY_TAG_VALUE;
}
