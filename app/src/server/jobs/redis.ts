import IORedis from "ioredis";

const host = process.env.VALKEY_HOST || "valkey";
const port = parseInt(process.env.VALKEY_PORT || "6379", 10);

const connection = new IORedis({
	host,
	port,
	maxRetriesPerRequest: null,
});

export { connection };
