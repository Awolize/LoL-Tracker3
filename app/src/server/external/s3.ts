import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { config } from "dotenv";

config();

/**
 * S3-compatible object storage — RustFS in `docker-compose.yml`.
 *
 * Uses the AWS SDK v3 rather than the `minio` client: RustFS ships no first-party JS SDK
 * and documents the AWS SDK as its JavaScript/TypeScript interface. This app only ever
 * needs "fetch one object" and "store one object", so that is all this module exposes.
 *
 * Config prefers the `S3_*` names and falls back to the legacy `MINIO_*` ones, so the
 * application and the deployment env can be renamed independently.
 */
const host = process.env.S3_ENDPOINT ?? process.env.MINIO_ENDPOINT ?? "rustfs";
const port = process.env.S3_PORT ?? process.env.MINIO_PORT ?? "9000";
const useSSL = (process.env.S3_USE_SSL ?? process.env.MINIO_USE_SSL) === "true";
// Accept either a bare host (the compose convention) or a full URL.
const endpoint = /^https?:\/\//.test(host) ? host : `http${useSSL ? "s" : ""}://${host}:${port}`;

/** The app reads/writes this bucket but never creates it; `rustfs-init` does. */
export const bucket = "images";

const globalForS3 = globalThis as unknown as { s3: S3Client | undefined };

// Cached on globalThis so dev HMR does not leak a client per reload.
const s3 =
	globalForS3.s3 ??
	new S3Client({
		region: "us-east-1", // RustFS default region
		endpoint,
		forcePathStyle: true, // RustFS serves path-style URLs by default
		credentials: {
			accessKeyId: process.env.S3_ACCESS_KEY ?? process.env.MINIO_ACCESS_KEY ?? "",
			secretAccessKey: process.env.S3_SECRET_KEY ?? process.env.MINIO_SECRET_KEY ?? "",
		},
	});

if (process.env.NODE_ENV !== "production") {
	globalForS3.s3 = s3;
}

const isMissing = (err: unknown): boolean => {
	const e = err as { name?: string; $metadata?: { httpStatusCode?: number } };
	return (
		e?.name === "NoSuchKey" || e?.name === "NotFound" || e?.$metadata?.httpStatusCode === 404
	);
};

/** The object's bytes, or `null` when the key does not exist. Other errors propagate. */
export async function getObject(key: string): Promise<Buffer | null> {
	try {
		const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
		if (!res.Body) return null;
		return Buffer.from(await res.Body.transformToByteArray());
	} catch (err) {
		if (isMissing(err)) return null;
		throw err;
	}
}

/** Stores an object. `ContentType` has to be explicit — the SDK does not infer it. */
export async function putObject(key: string, body: Buffer, contentType: string): Promise<void> {
	await s3.send(
		new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }),
	);
}
