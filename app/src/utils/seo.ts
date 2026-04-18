const DEFAULT_KEYWORDS =
	"league of legends, tracker, summoner, challenge, player, stats, matches, mastery, champions";

/**
 * Expands or trims meta descriptions to a crawler-friendly length (about 25–160 characters for SERP snippets).
 */
export function metaDescription(primary: string, options?: { min?: number; max?: number }): string {
	const min = options?.min ?? 25;
	const max = options?.max ?? 160;
	const suffix =
		"Mastery, challenges, and recent matches on Awot's Challenge Tracker (Riot League API).";

	let text = primary.trim().replace(/\s+/g, " ");
	if (text.length < min) {
		const needsPeriod = text.length > 0 && !/[.!?…]$/.test(text);
		text = `${text}${needsPeriod ? "." : ""} ${suffix}`;
	}
	if (text.length > max) {
		const hardSlice = text.slice(0, max - 1);
		const lastSpace = hardSlice.lastIndexOf(" ");
		const trimmed =
			lastSpace > max * 0.55 ? hardSlice.slice(0, lastSpace).trimEnd() : hardSlice.trimEnd();
		text = /[.!?…]$/.test(trimmed) ? trimmed : `${trimmed}…`;
	}
	return text;
}

export const seo = ({
	title,
	description,
	keywords,
	image,
}: {
	title: string;
	description?: string;
	image?: string;
	keywords?: string;
}) => {
	const resolvedDescription =
		description !== undefined ? metaDescription(description) : undefined;
	const tags = [
		{ title },
		...(resolvedDescription
			? [
				{ name: "description", content: resolvedDescription },
				{ property: "og:description", content: resolvedDescription },
			]
			: []),
		{ name: "keywords", content: keywords ?? DEFAULT_KEYWORDS },
		{ name: "theme-color", content: "#4FB8B2" },
		{ property: "og:type", content: "website" },
		{ property: "og:title", content: title },
		{ property: "og:site_name", content: "Awot's Challenge Tracker" },
		...(image
			? [
				{ property: "og:image", content: image },
				{ property: "og:image:alt", content: title },
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: title },
				...(resolvedDescription
					? [{ name: "twitter:description", content: resolvedDescription }]
					: []),
			]
			: []),
	];
	return tags;
};
