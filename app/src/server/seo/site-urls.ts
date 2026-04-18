import { regionToDisplay } from "~/features/shared/champs";

const DEFAULT_ORIGIN = "https://lol.awot.dev";

/** Public site origin (no trailing slash). Override with `PUBLIC_SITE_URL` in production. */
export function getSiteOrigin(): string {
	const raw = process.env.PUBLIC_SITE_URL ?? process.env.SITE_URL ?? DEFAULT_ORIGIN;
	try {
		return new URL(raw.startsWith("http") ? raw : `https://${raw}`).origin;
	} catch {
		return DEFAULT_ORIGIN;
	}
}

/** Hostname for IndexNow payloads (must match URLs in `urlList`). */
export function getSiteHostname(): string {
	try {
		return new URL(getSiteOrigin()).hostname;
	} catch {
		return "lol.awot.dev";
	}
}

/**
 * Canonical summoner HTML URLs — same path rules as `api/sitemap/$page.xml`
 * (`/{displayRegion}/{encodedGame}-{encodedTag}` and sub-routes).
 */
export function summonerSeoUrls(regionShard: string, gameName: string, tagLine: string): string[] {
	const origin = getSiteOrigin();
	const displayRegion = regionToDisplay(regionShard);
	const userSegment = `${encodeURIComponent(gameName)}-${encodeURIComponent(tagLine)}`;
	const base = `${origin}/${displayRegion}/${userSegment}`;
	return [base, `${base}/mastery`, `${base}/matches`, `${base}/challenge`];
}

export function challengeLeaderboardUrl(challengeId: number | string): string {
	return `${getSiteOrigin()}/challenge/${challengeId}`;
}
