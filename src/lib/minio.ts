import { config } from "dotenv";
import { Client } from "minio";

config();

const globalForMinio = globalThis as unknown as {
	minio: Client | undefined;
};

export const minio =
	globalForMinio.minio ??
	new Client({
		endPoint: process.env.MINIO_ENDPOINT,
		port: Number.parseInt(process.env.MINIO_PORT, 10),
		useSSL: false,
		accessKey: process.env.MINIO_ACCESS_KEY,
		secretKey: process.env.MINIO_SECRET_KEY,
	});

if (process.env.NODE_ENV !== "production") {
	globalForMinio.minio = minio;
}
