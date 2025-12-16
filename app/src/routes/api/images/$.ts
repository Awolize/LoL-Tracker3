import * as Sentry from "@sentry/tanstackstart-react";
import { createFileRoute } from "@tanstack/react-router";
import sharp from "sharp";
import { minio } from "@/server/external/minio";

const DEBUG =
	process.env.IMAGE_DEBUG === "true" || process.env.IMAGE_DEBUG === "1";
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
				let isSourcePng = false; // Track if the upstream gave us a PNG

				// 2. Fetch Upstream
				try {
					const isChallenge = path.includes("img/challenges/");

					if (isChallenge) {
						// Logic: /img/challenges/12345-iron.webp
						const [fileName] = path.split("/").slice(-1);
						// Updated Regex: Handles .webp OR .png in the request path
						const match = fileName?.match(/(\d+)-([a-zA-Z]+)\.(webp|png)$/);

						if (!match) throw new Error("Invalid challenge path format");

						const challengeId = match[1];
						const tier = match[2].toLowerCase();

						const cDragonUrl = `https://raw.communitydragon.org/latest/game/assets/challenges/config/${challengeId}/tokens/${tier}.png`;

						const res = await fetch(cDragonUrl);
						if (!res.ok) throw new Error(`CommunityDragon ${res.status}`);
						original = Buffer.from(await res.arrayBuffer());
						isSourcePng = true; // CDragon tokens are PNGs

						log("Fetched challenge from CommunityDragon:", cDragonUrl);
					} else {
						// Fetch from DDragon
						// If asking for webp, we ask DDragon for png
						const riotPath = path.endsWith(".webp")
							? path.replace(/\.webp$/, ".png")
							: path;

						const res = await fetch(
							`https://ddragon.leagueoflegends.com/${riotPath}`,
						);
						if (!res.ok) throw new Error(`DDragon ${res.status}`);
						original = Buffer.from(await res.arrayBuffer());

						if (riotPath.endsWith(".png")) isSourcePng = true;

						log("Fetched from DDragon:", riotPath);
					}
				} catch (err) {
					Sentry.captureException(err);
					log("Failed to fetch image:", path, err);
					return new Response("Image not found", { status: 404 });
				}

				// 3. Convert to WebP if needed
				// Fix: We convert if the user requested 'webp', regardless of what the file path string says
				let out: Buffer = original;

				if (ext === "webp") {
					try {
						// If the source was PNG (or we just want to ensure webp), convert it
						out = await toWebp(original);
						log("Converted to WebP, size:", out.length);
					} catch (e) {
						log("WebP conversion failed, serving original", e);
						// Fallback: If conversion fails, you might want to switch content-type header back to png
						// or just let it fail. For now, we assume success.
					}
				}

				// 4. Store in MinIO (non-blocking)
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
