import * as Sentry from "@sentry/tanstackstart-react";
import { createFileRoute } from "@tanstack/react-router";
import sharp from "sharp";

import { isClassicChampion } from "~/features/shared/champs";
import {
	classicChampionIconUrl,
	fetchClassicChampions,
} from "~/server/champions/classic-champions";
import { getObject, putObject } from "~/server/external/s3";

const DEBUG = process.env.IMAGE_DEBUG === "true" || process.env.IMAGE_DEBUG === "1";
const log = (...args: any[]) => {
	if (DEBUG) console.log(...args);
};

const CHALLENGE_ASSETS = "https://raw.communitydragon.org/latest/game/assets/challenges/config";

/**
 * How long the classic alias -> id map is reused.
 *
 * Riot only adds a champion to the classic set every few weeks, and this sits in front of every
 * image request, so the summary file is read once per process per day rather than per icon.
 */
const CLASSIC_ID_TTL_MS = 24 * 60 * 60 * 1000;

const globalForClassicChampions = globalThis as unknown as {
	classicChampionIds?: { at: number; ids: Map<string, number> };
	classicChampionIdsPromise?: Promise<Map<string, number>>;
};

/**
 * `Jade_Akali` -> 60084, from CommunityDragon's client data.
 *
 * The classic champions have no Data Dragon art (their set stopped being exported after 16.15.1),
 * but CommunityDragon publishes a square icon per id, which is what the branch below serves.
 *
 * The in-flight promise is shared: a mastery page requests ~80 icons at once, and without it every
 * one of them would fetch the summary on the first load after a deploy.
 */
const getClassicChampionIds = async (): Promise<Map<string, number>> => {
	const cached = globalForClassicChampions.classicChampionIds;
	if (cached && Date.now() - cached.at < CLASSIC_ID_TTL_MS) return cached.ids;

	const pending = globalForClassicChampions.classicChampionIdsPromise;
	if (pending) return pending;

	const request = fetchClassicChampions()
		.then((champions) => {
			const ids = new Map(champions.map((champion) => [champion.alias, champion.id]));
			globalForClassicChampions.classicChampionIds = { at: Date.now(), ids };
			return ids;
		})
		.finally(() => {
			globalForClassicChampions.classicChampionIdsPromise = undefined;
		});

	globalForClassicChampions.classicChampionIdsPromise = request;
	return request;
};

const getClassicChampionId = async (alias: string): Promise<number | undefined> =>
	(await getClassicChampionIds()).get(alias);

/**
 * Ids 0-5 are not challenges. They are the six category aggregates (CRYSTAL, IMAGINATION,
 * EXPERTISE, VETERANCY, TEAMWORK, COLLECTION) whose thresholds are category points, and Riot marks
 * them with an empty `levelToIconPath`. CommunityDragon publishes no `tokens/` art for them - only
 * one shared, per-tier crystal crest under `00_crystals/`.
 *
 * The range stays a hardcoded set rather than a `ChallengesConfig.tags->>'isCategory'` lookup: this
 * route serves every image on the site, and a Postgres round trip per image request is exactly what
 * it must not do. Riot's six aggregate ids are fixed, so the constant is the whole answer.
 */
const CATEGORY_AGGREGATE_IDS: ReadonlySet<string> = new Set(["0", "1", "2", "3", "4", "5"]);
const CATEGORY_CREST_DIR = "00_crystals";

const toWebp = (buf: Buffer) => sharp(buf).webp({ quality: 85 }).toBuffer();

const mime = (ext: string) =>
	ext === "png"
		? "image/png"
		: ext === "jpg" || ext === "jpeg"
			? "image/jpeg"
			: ext === "svg"
				? "image/svg+xml"
				: "image/webp";

export const Route = createFileRoute("/api/images/$")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const url = new URL(request.url);
				const path = url.pathname.replace("/api/images/", "");
				const ext = path.split(".").pop()?.toLowerCase() || "png";

				log("Incoming request:", path, "extension:", ext);

				// 1. Try object storage first
				try {
					const cached = await getObject(path);
					if (cached) {
						log("Cache hit:", path, cached.length);
						// Copy into a plain Uint8Array: @types/node 26 types Buffer as
						// Buffer<ArrayBufferLike>, which is no longer assignable to BodyInit.
						return new Response(new Uint8Array(cached), {
							headers: {
								"Content-Type": mime(ext),
								"Cache-Control": "public, max-age=31536000, immutable",
							},
						});
					}
					log("Cache miss, fetching from upstream:", path);
				} catch (err) {
					// A missing key returns null; anything thrown here is a real storage failure.
					Sentry.captureException(err);
					log("Object storage error:", path, err);
				}

				let original: Buffer;

				// 2. Fetch Upstream
				try {
					const isChallenge = path.includes("img/challenges/");
					// `/cdn/<version>/img/champion/Jade_Akali.webp` -> `Jade_Akali`. Current
					// champions fall through to Data Dragon; only the classic prefix is served
					// from CommunityDragon.
					const championFileName = path.match(
						/\/img\/champion\/([^/]+?)\.(?:png|webp)$/i,
					)?.[1];

					if (isChallenge) {
						// Logic: /img/challenges/12345-iron.webp
						const [fileName] = path.split("/").slice(-1);
						const match = fileName?.match(/(\d+)-([a-zA-Z]+)\.(webp|png)$/);

						if (!match) throw new Error("Invalid challenge path format");

						let challengeId = match[1];
						const requestedTier = match[2].toLowerCase();
						const isCategoryAggregate = CATEGORY_AGGREGATE_IDS.has(challengeId);

						// --- ASSET REDIRECTS ---
						// Maps New Mastery 10 IDs to the Legacy Mastery 7 asset IDs
						// (Because C-Dragon/Riot reuses the old art but puts it under the old IDs)
						const ASSET_REDIRECTS: Record<string, string> = {
							"401207": "401201", // Assassin
							"401208": "401202", // Fighter
							"401209": "401203", // Mage
							"401210": "401204", // Marksman
							"401211": "401205", // Support
							"401212": "401206", // Tank
							"401107": "401101", // Master the Enemy
						};

						if (ASSET_REDIRECTS[challengeId]) {
							log(
								`Redirecting asset lookup: ${challengeId} -> ${ASSET_REDIRECTS[challengeId]}`,
							);
							challengeId = ASSET_REDIRECTS[challengeId];
						}

						// Helper to try fetching a specific tier
						const fetchTier = async (tier: string) => {
							const cDragonUrl = isCategoryAggregate
								? `${CHALLENGE_ASSETS}/${CATEGORY_CREST_DIR}/challengecrystal_${tier}.png`
								: `${CHALLENGE_ASSETS}/${challengeId}/tokens/${tier}.png`;
							const res = await fetch(cDragonUrl);
							// A missing piece of cosmetic art is a normal outcome, not a failure:
							// only a genuine problem (network error, unexpected status) is worth an
							// error-level event, and `fetch` itself throws for the former.
							if (res.status === 404) return null;
							if (!res.ok)
								throw new Error(`CommunityDragon ${res.status} for ${cDragonUrl}`);
							return Buffer.from(await res.arrayBuffer());
						};

						// A. Try the requested tier (e.g., 'master')
						let buf = await fetchTier(requestedTier);

						// B. Fallback: If failed and we aren't already asking for iron, try 'iron'
						// (Many seasonal/single-state challenges only have an 'iron.png' asset)
						if (!buf && requestedTier !== "iron") {
							log(
								`Tier '${requestedTier}' not found for ${challengeId}, trying 'iron' fallback...`,
							);
							buf = await fetchTier("iron");
						}

						if (!buf) {
							// The browser gets the same deliberate 404 this route always answered a
							// miss with, but a missing token is not an error worth alerting on.
							log(
								`No CommunityDragon art for ${challengeId} (checked ${requestedTier} & iron)`,
							);
							return new Response("Image not found", { status: 404 });
						}

						original = buf;
						log("Fetched challenge from CommunityDragon");
					} else if (
						championFileName !== undefined &&
						isClassicChampion(championFileName)
					) {
						// Classic champions keep their `Jade_` names in the URL but have no Data
						// Dragon art after 16.15.1; CommunityDragon serves the square icon by id.
						const id = await getClassicChampionId(championFileName);
						if (id === undefined) {
							log(`No CommunityDragon id for classic champion ${championFileName}`);
							return new Response("Image not found", { status: 404 });
						}

						const res = await fetch(classicChampionIconUrl(id));
						if (res.status === 404) {
							log(`No CommunityDragon art for classic champion ${championFileName}`);
							return new Response("Image not found", { status: 404 });
						}
						if (!res.ok) throw new Error(`CommunityDragon ${res.status}`);
						original = Buffer.from(await res.arrayBuffer());

						log("Fetched classic champion from CommunityDragon:", championFileName);
					} else {
						// Fetch from DDragon
						const riotPath = path.endsWith(".webp")
							? path.replace(/\.webp$/, ".png")
							: path;

						const res = await fetch(`https://ddragon.leagueoflegends.com/${riotPath}`);
						// Riot's CDN answers 403 for a path it does not have and 200 for one it
						// does, so both statuses mean "missing art", not breakage. Anything else
						// is a real problem worth an error-level event.
						if (res.status === 404 || res.status === 403) {
							log(`No DDragon art for ${riotPath} (${res.status})`);
							return new Response("Image not found", { status: 404 });
						}
						if (!res.ok) throw new Error(`DDragon ${res.status}`);
						original = Buffer.from(await res.arrayBuffer());

						log("Fetched from DDragon:", riotPath);
					}
				} catch (err) {
					Sentry.captureException(err);
					log("Failed to fetch image:", path, err);
					return new Response("Image not found", { status: 404 });
				}

				// 3. Convert to WebP if needed
				let out: Buffer = original;

				if (ext === "webp") {
					try {
						out = await toWebp(original);
						log("Converted to WebP, size:", out.length);
					} catch (e) {
						log("WebP conversion failed, serving original", e);
					}
				}

				// 4. Store in object storage (non-blocking)
				// Note: We use the ORIGINAL 'path' here, so it's saved under the NEW ID
				putObject(path, out, mime(ext)).catch((err) => {
					Sentry.captureException(err);
					log("Failed to store in object storage:", path, err);
				});

				return new Response(new Uint8Array(out), {
					headers: {
						"Content-Type": mime(ext),
						"Cache-Control": "public, max-age=31536000, immutable",
					},
				});
			},
		},
	},
});
