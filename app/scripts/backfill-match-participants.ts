/**
 * One-off backfill: project `MatchInfo.participants` (jsonb) into `MatchParticipant`.
 *
 * Idempotent and resumable — safe to re-run. `MatchInfo` stays the source of truth,
 * so this only ever derives rows; it never deletes or rewrites match data.
 *
 * Usage (from `app/`):
 *   pnpm tsx scripts/backfill-match-participants.ts
 *
 * Env: reads the repo-root `.env` for DATABASE_URL. Optional:
 *   PARTICIPANT_BACKFILL_BATCH (default 200)
 */
import { fileURLToPath } from "node:url";

import { config } from "dotenv";

config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

const BATCH_SIZE = Number.parseInt(process.env.PARTICIPANT_BACKFILL_BATCH ?? "200", 10);

const { db } = await import("../src/db/index.ts");
const { matchInfo, matchParticipant } = await import("../src/db/schema.ts");
const { projectMatchesParticipants } = await import("../src/server/matches/match-participants.ts");
const { asc, count, gt } = await import("drizzle-orm");

async function main() {
	console.log("Projecting MatchInfo.participants -> MatchParticipant ...");

	let cursor = "";
	let processedMatches = 0;

	for (;;) {
		const batch = await db
			.select({ gameId: matchInfo.gameId })
			.from(matchInfo)
			.where(gt(matchInfo.gameId, cursor))
			.orderBy(asc(matchInfo.gameId))
			.limit(BATCH_SIZE);

		if (batch.length === 0) break;

		const gameIds = batch.map((row) => row.gameId);
		await projectMatchesParticipants(gameIds);

		const last = gameIds[gameIds.length - 1];
		if (!last) break;
		cursor = last;
		processedMatches += gameIds.length;

		if (processedMatches % (BATCH_SIZE * 10) < BATCH_SIZE) {
			console.log(`  ${processedMatches} matches processed (cursor ${cursor})`);
		}
	}

	const [{ projected }] = await db.select({ projected: count() }).from(matchParticipant);
	const [{ matches }] = await db.select({ matches: count() }).from(matchInfo);

	console.log(`Done. ${processedMatches} matches scanned.`);
	console.log(`MatchParticipant rows: ${projected} (from ${matches} matches)`);
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
