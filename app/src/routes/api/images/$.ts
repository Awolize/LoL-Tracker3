import { createFileRoute } from "@tanstack/react-router";
import sharp from "sharp";
import { minio } from "@/server/lib/minio";
import * as Sentry from "@sentry/tanstackstart-react";

// Toggle debug logs
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

        // Try cached
        try {
          log("Checking MinIO cache for:", path);
          const stream = await minio.getObject(bucket, path);
          const buf = await readStream(stream);
          log("Cache hit for:", path, "size:", buf.length);
          return new Response(new Uint8Array(buf), {
            headers: {
              "Content-Type": mime(ext),
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        } catch (err) {
          log("Cache miss for:", path);
        }

        // Fetch from Riot
        const riotPath = path.endsWith(".webp")
          ? path.replace(/\.webp$/, ".png")
          : path;
        const src = `https://ddragon.leagueoflegends.com/${riotPath}`;

        log("Fetching from Data Dragon:", src);

        let original: Buffer;
        try {
          const res = await fetch(src);
          if (!res.ok) throw new Error(`ddragon ${res.status}`);
          original = Buffer.from(await res.arrayBuffer());
          log("Fetched from Data Dragon, size:", original.length);
        } catch (err) {
          Sentry.captureException(err);
          log("Failed to fetch from Data Dragon:", src, err);
          return new Response("Image not found", { status: 404 });
        }

        // Convert only if requested
        const out: Buffer =
          ext === "webp" && riotPath.endsWith(".png")
            ? await toWebp(original)
            : original;

        if (out !== original) log("Converted PNG -> WebP, size:", out.length);

        // Store in MinIO
        try {
          log("Writing to MinIO:", bucket, path, "size:", out.length);
          await minio.putObject(bucket, path, out, out.length);
          log("Successfully stored in MinIO:", path);
        } catch (err) {
          Sentry.captureException(err);
          log("Failed to store in MinIO:", path, err);
        }

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
