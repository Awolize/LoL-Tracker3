/**
 * Riot IDs in URLs, route params and store keys.
 *
 * A summoner is addressed as `gameName-tagLine`, because `#` cannot appear in a path segment.
 * The split has to be on the **last** dash, never the first: tag lines do not contain one, but
 * game names can. One stored summoner is literally
 * `2c535cf2-378e-47b5-9822-c3278687db5d`, which `replace("-", "#")` rewrote as the Riot ID
 * `2c535cf2#378e-47b5-9822-c3278687db5d` and made unresolvable. Measured against the live data:
 * 1 of 246,555 game names contains a dash, 0 of 246,555 tag lines do.
 *
 * Case is preserved. `getUserByNameAndRegion` lowercases for its own lookup and compares
 * case-insensitively, so callers do not need to.
 */

/**
 * `gameName-tagLine` → `gameName#tagLine`. Idempotent: input that is already in `#` form is
 * returned untouched, which matters because some callers sit behind a route that already
 * parsed the param (a dash-containing game name would otherwise be split a second time).
 */
export const parseRiotId = (slug: string): string => {
	if (slug.includes("#")) return slug;

	const separator = slug.lastIndexOf("-");
	if (separator === -1) return slug;

	return `${slug.slice(0, separator)}#${slug.slice(separator + 1)}`;
};

/**
 * The inverse: the `gameName-tagLine` form used in links, route params and store keys.
 *
 * Both parts are optional in the Match-V5 payload, so a missing one becomes empty here rather
 * than the literal `"undefined"` a bare template literal used to produce.
 */
export const formatRiotId = (gameName: string | undefined, tagLine: string | undefined): string =>
	`${gameName ?? ""}-${tagLine ?? ""}`;
