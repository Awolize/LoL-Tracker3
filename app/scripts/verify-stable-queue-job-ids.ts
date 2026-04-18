/**
 * Verifies BullMQ stable `jobId` behavior: two `add()` calls with the same opts
 * should resolve to the same job id (second is a duplicate, not a second row).
 *
 * Prefer stopping the worker while running this, so the test job stays in `wait`
 * and you see `duplicated` semantics clearly. If the worker consumes the job first,
 * ids should still match because the custom `jobId` string is reused.
 *
 * Usage (from `app/`):
 *   pnpm run queue:verify-stable-ids
 *
 * Env: `VALKEY_HOST` (default 127.0.0.1), `VALKEY_PORT` (default 6379)
 */
import { Queue } from "bullmq";
import IORedis from "ioredis";
import type { Regions } from "twisted/dist/constants";

import { stableSummonerJobOpts } from "../src/server/jobs/queue-stable-job-opts";

const connection = new IORedis({
	host: process.env.VALKEY_HOST ?? "127.0.0.1",
	port: Number.parseInt(process.env.VALKEY_PORT ?? "6379", 10),
	maxRetriesPerRequest: null,
});

const jobData = {
	gameName: "__dedupe_test__",
	tagLine: "0000",
	region: "EUW1" as Regions,
};

async function main() {
	const q = new Queue("riot-updates", { connection });
	const opts = stableSummonerJobOpts("update-mastery", jobData, { priority: 4 });

	const j1 = await q.add("update-mastery", jobData, opts);
	const j2 = await q.add("update-mastery", jobData, opts);

	console.log("First add id:", j1.id);
	console.log("Second add id:", j2.id);
	console.log("Same id:", j1.id === j2.id);

	const counts = await q.getJobCounts("wait", "active", "delayed", "paused");
	console.log("Queue counts:", counts);

	const same = j1.id === j2.id;
	await j1.remove().catch(() => {});
	await j2.remove().catch(() => {});
	await q.close();
	await connection.quit();

	if (!same) {
		console.error("Expected duplicate add to return the same job id.");
		process.exit(1);
	}
	console.log("OK");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
