import * as Sentry from "@sentry/tanstackstart-react";
import { createFileRoute } from "@tanstack/react-router";
import sharp from "sharp";
import { minio } from "@/server/lib/minio";

// Toggle debug logs
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

				// Try MinIO first
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
					log("Cache miss, fetching from Data Dragon:", path);
				}

				// Fetch from Data Dragon
				const riotPath = path.endsWith(".webp")
					? path.replace(/\.webp$/, ".png")
					: path;
				let original: Buffer;
				try {
					const res = await fetch(
						`https://ddragon.leagueoflegends.com/${riotPath}`,
					);
					if (!res.ok) throw new Error(`ddragon ${res.status}`);
					original = Buffer.from(await res.arrayBuffer());
					log("Fetched from Data Dragon, size:", original.length);
				} catch (err) {
					Sentry.captureException(err);
					log("Failed to fetch from Data Dragon:", riotPath, err);
					return new Response("Image not found", { status: 404 });
				}

				// Convert to WebP if needed
				const out: Buffer =
					ext === "webp" && riotPath.endsWith(".png")
						? await toWebp(original)
						: original;
				if (out !== original) log("Converted PNG -> WebP, size:", out.length);

				// Store in MinIO (non-blocking)
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
