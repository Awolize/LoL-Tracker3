import * as Sentry from "@sentry/tanstackstart-react";
import { createFileRoute } from "@tanstack/react-router";
import sharp from "sharp";
import { minio } from "@/server/external/minio";

const DEBUG = process.env.IMAGE_DEBUG === "true" || process.env.IMAGE_DEBUG === "1";
const log = (...args: any[]) => {
	if (DEBUG) console.log(...args);
};

const readStream = (s: NodeJS.ReadableStream) =>
	new Promise<Buffer>((res, rej) => {
		const bufs: Buffer[] = [];
		s.on("data", (c) => bufs.push(c));
		s.on("end", () => res(Buffer.concat(bufs)));
		s.on("error", rej);
	});

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
				const bucket = "images";
				const url = new URL(request.url);
				const path = url.pathname.replace("/api/images/", "");
				const ext = path.split(".").pop()?.toLowerCase() || "png";

				log("Incoming request:", path, "extension:", ext);

				// 1. Try MinIO first
				try {
					const stream = await minio.getObject(bucket, path);
					const buf = await readStream(stream);
					log("Cache hit:", path, buf.length);
					return new Response(buf, {
						headers: {
							"Content-Type": mime(ext),
							"Cache-Control": "public, max-age=31536000, immutable",
						},
					});
				} catch (err: any) {
					if (err.code !== "NotFound") {
						Sentry.captureException(err);
						log("MinIO error:", err);
					}
					log("Cache miss, fetching from upstream:", path);
				}

				let original: Buffer;

				// 2. Fetch Upstream
				try {
					const isChallenge = path.includes("img/challenges/");

					if (isChallenge) {
						// Logic: /img/challenges/12345-iron.webp
						const [fileName] = path.split("/").slice(-1);
						const match = fileName?.match(/(\d+)-([a-zA-Z]+)\.(webp|png)$/);

						if (!match) throw new Error("Invalid challenge path format");

						let challengeId = match[1];
						const requestedTier = match[2].toLowerCase();

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
							log(`Redirecting asset lookup: ${challengeId} -> ${ASSET_REDIRECTS[challengeId]}`);
							challengeId = ASSET_REDIRECTS[challengeId];
						}

						// Helper to try fetching a specific tier
						const fetchTier = async (tier: string) => {
							const cDragonUrl = `https://raw.communitydragon.org/latest/game/assets/challenges/config/${challengeId}/tokens/${tier}.png`;
							const res = await fetch(cDragonUrl);
							if (res.ok) return Buffer.from(await res.arrayBuffer());
							return null;
						};

						// A. Try the requested tier (e.g., 'master')
						let buf = await fetchTier(requestedTier);

						// B. Fallback: If failed and we aren't already asking for iron, try 'iron'
						// (Many seasonal/single-state challenges only have an 'iron.png' asset)
						if (!buf && requestedTier !== "iron") {
							log(`Tier '${requestedTier}' not found for ${challengeId}, trying 'iron' fallback...`);
							buf = await fetchTier("iron");
						}

						if (!buf) throw new Error(`CommunityDragon 404 for ${challengeId} (checked ${requestedTier} & iron)`);

						original = buf;
						log("Fetched challenge from CommunityDragon");

					} else {
						// Fetch from DDragon
						const riotPath = path.endsWith(".webp")
							? path.replace(/\.webp$/, ".png")
							: path;

						const res = await fetch(
							`https://ddragon.leagueoflegends.com/${riotPath}`,
						);
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

				// 4. Store in MinIO (non-blocking)
				// Note: We use the ORIGINAL 'path' here, so it's saved under the NEW ID
				minio.putObject(bucket, path, out, out.length).catch((err) => {
					Sentry.captureException(err);
					log("Failed to store in MinIO:", path, err);
				});

				return new Response(out, {
					headers: {
						"Content-Type": mime(ext),
						"Cache-Control": "public, max-age=31536000, immutable",
					},
				});
			},
		},
	},
});