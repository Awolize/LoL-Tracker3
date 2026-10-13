// jobs/queue.ts
import { Queue, QueueEvents, Worker } from "bullmq";
import { and, eq, ilike } from "drizzle-orm";

import { db } from "~/db";
import { challengesConfig, summoner } from "~/db/schema";
import {
	LADDER_SWEEP_CHALLENGES,
	LADDER_SWEEP_INTERVAL_MS,
	selectSweepChallenges,
} from "~/server/challenges/ladder-sweep";
import { nameStoredLadder, syncChallengeLadder } from "~/server/challenges/riot-challenge-ladder";
import { runAllChallengeUpdatesWorker } from "~/server/challenges/update-challenges";
import { updateChallengesConfigServer } from "~/server/challenges/update-challenges-config";
import { upsertPlayerChallenges } from "~/server/challenges/update-player-challenges";
import { updateChampionDetails } from "~/server/champions/update-champion-details";
import { upsertMastery } from "~/server/champions/upsertMastery";
import type { Regions } from "~/server/external/riot/twisted";
import { stableGlobalJobOpts } from "~/server/jobs/queue-stable-job-opts";
import { fetchMatchIds, updateGamesSingle } from "~/server/matches/updateGames";
import {
	challengeLeaderboardUrl,
	getSiteHostname,
	getSiteOrigin,
	summonerSeoUrls,
} from "~/server/seo/site-urls";
import {
	getSummonerByPuuidRateLimit,
	getSummonerByUsernameRateLimit,
} from "~/server/summoner/get-summoner-by-username-rate-limit";
import { upsertSummoner } from "~/server/summoner/upsertSummoner";

import { connection } from "./redis";

const QUEUE_NAME = "riot-updates";

export const updateQueue = new Queue(QUEUE_NAME, {
	connection,
	defaultJobOptions: { removeOnComplete: true, removeOnFail: true },
});

export const updateQueueEvents = new QueueEvents(QUEUE_NAME, { connection });

updateQueueEvents.on("error", (err) => console.error("[QueueEvents] Error:", err));

/**
 * Keep the most-read ladder boards fresh without waiting for a visit.
 *
 * Idempotent by scheduler id, so importing this module more than once (web and worker both do)
 * leaves one schedule rather than stacking them. The handler only *queues* the sweeps; the single
 * worker above runs them, so the cadence cannot accidentally run a sweep per process.
 *
 * Registered here rather than in a route because a schedule is queue infrastructure, and this is
 * the module that already owns the queue's lifecycle.
 */
const LADDER_SWEEP_SCHEDULER_ID = "ladder-sweep";

updateQueue
	.upsertJobScheduler(
		LADDER_SWEEP_SCHEDULER_ID,
		{ every: LADDER_SWEEP_INTERVAL_MS },
		{ name: "ladder-sweep", data: {} },
	)
	.catch((err) => console.error("[Ladder] Could not register the sweep schedule:", err));

// --- IndexNow buffer ---
const pendingIndexNowUrls = new Set<string>();

function scheduleIndexNowFlush() {
	updateQueue
		.add("indexnow-flush", {}, { jobId: "indexnow-flush", delay: 10 * 60 * 1000 })
		.catch((err) => console.error("[IndexNow] Failed to schedule flush:", err));
}

function queueIndexNowUrl(url: string) {
	const wasEmpty = pendingIndexNowUrls.size === 0;
	pendingIndexNowUrls.add(url);
	if (wasEmpty) scheduleIndexNowFlush();
}

function queueSummonerSeoIndexNow(regionShard: string, gameName: string, tagLine: string) {
	for (const url of summonerSeoUrls(regionShard, gameName, tagLine)) {
		queueIndexNowUrl(url);
	}
}

async function queueLeaderboardChallengeUrls() {
	const rows = await db
		.select({ id: challengesConfig.id })
		.from(challengesConfig)
		.where(eq(challengesConfig.leaderboard, true));
	for (const row of rows) {
		queueIndexNowUrl(challengeLeaderboardUrl(row.id));
	}
}

async function notifyIndexNow(urls: string[]) {
	const origin = getSiteOrigin();
	const res = await fetch("https://api.indexnow.org/indexnow", {
		method: "POST",
		headers: { "Content-Type": "application/json; charset=utf-8" },
		body: JSON.stringify({
			host: getSiteHostname(),
			key: "12cb155ebbb645c9a5eb01992526f734",
			keyLocation: `${origin}/12cb155ebbb645c9a5eb01992526f734.txt`,
			urlList: urls,
		}),
	});
	const body = await res.text();
	console.log(res.status, body);
}

// --- Helper ---
async function ensureSummoner(gameName: string, tagLine: string, region: Regions) {
	try {
		const data = await getSummonerByUsernameRateLimit(`${gameName}#${tagLine}`, region);
		if (!data.summoner) throw new Error(`Summoner not found: ${gameName}#${tagLine}`);
		await upsertSummoner(data.summoner, data.account, region);
		return data;
	} catch (error: any) {
		// Old Riot IDs can 404 after rename; fall back via cached PUUID.
		if (error?.status !== 404) throw error;

		const knownUser = await db.query.summoner.findFirst({
			where: and(
				ilike(summoner.gameName, gameName),
				ilike(summoner.tagLine, tagLine),
				eq(summoner.region, region),
			),
		});
		if (!knownUser?.puuid) throw error;

		const data = await getSummonerByPuuidRateLimit(knownUser.puuid, region);
		if (!data.summoner) throw new Error(`Summoner not found by PUUID: ${knownUser.puuid}`);
		await upsertSummoner(data.summoner, data.account, region);
		return data;
	}
}

declare global {
	var __riotWorker: Worker | undefined;
}

if (!global.__riotWorker) {
	global.__riotWorker = new Worker(
		QUEUE_NAME,
		async (job) => {
			const { name, data } = job;
			const {
				gameName,
				tagLine,
				region: rawRegion,
				matchId,
				challengeId,
				waitForMatches = false,
			} = data;
			const region = rawRegion as Regions;

			const identifier = gameName ? `${gameName}#${tagLine}` : (matchId ?? challengeId);
			console.log(`[Worker] Start: ${name} (${identifier})`);

			try {
				switch (name) {
					case "update-meta": {
						const { account } = await ensureSummoner(gameName, tagLine, region);
						await Promise.all([
							upsertMastery(account, region),
							upsertPlayerChallenges(region, account),
							updateChallengesConfigServer(region),
							updateChampionDetails(),
						]);
						queueSummonerSeoIndexNow(region, gameName, tagLine);
						await queueLeaderboardChallengeUrls();
						return { success: true, puuid: account.puuid };
					}

					case "update-summoner-only": {
						const { account } = await ensureSummoner(gameName, tagLine, region);
						queueSummonerSeoIndexNow(region, gameName, tagLine);
						return { success: true, puuid: account.puuid };
					}

					case "update-champion-details": {
						await updateChampionDetails();
						return { success: true };
					}

					case "update-mastery": {
						const { account } = await ensureSummoner(gameName, tagLine, region);
						await upsertMastery(account, region);
						queueSummonerSeoIndexNow(region, gameName, tagLine);
						return { success: true, puuid: account.puuid };
					}

					case "update-challenges-config": {
						await updateChallengesConfigServer(region);
						await queueLeaderboardChallengeUrls();
						return { success: true };
					}

					case "update-challenges": {
						const { account } = await ensureSummoner(gameName, tagLine, region);
						await upsertPlayerChallenges(region, account);
						queueSummonerSeoIndexNow(region, gameName, tagLine);
						if (challengeId) {
							queueIndexNowUrl(challengeLeaderboardUrl(challengeId));
						}
						return { success: true, puuid: account.puuid };
					}

					case "process-single-match": {
						await updateGamesSingle(matchId, region);
						return { success: true };
					}

					case "update-matches": {
						const { account } = await ensureSummoner(gameName, tagLine, region);
						const matchIds = await fetchMatchIds(account.puuid, region);

						matchIds.forEach(async (id) => {
							const job = await updateQueue.add(
								"process-single-match",
								{ matchId: id, region },
								{ priority: waitForMatches ? 10 : 50, jobId: id },
							);
							job.waitUntilFinished(updateQueueEvents).catch((err) =>
								console.error(`[Queue] Error in match ${id}:`, err),
							);
						});

						queueSummonerSeoIndexNow(region, gameName, tagLine);

						return { success: true, queuedMatches: matchIds.length };
					}

					case "run-challenges-computation": {
						return await runAllChallengeUpdatesWorker({
							username: `${gameName}#${tagLine}`,
							region,
						});
					}

					// Queues a small number of refreshes on a schedule. It does no Riot work itself:
					// a repeatable job that swept inline would double the allowance it is trying to
					// stay inside, and could not be paced by the single worker.
					case "ladder-sweep": {
						const { selected } = await selectSweepChallenges(LADDER_SWEEP_CHALLENGES);
						for (const challengeToSync of selected) {
							await updateQueue.add(
								"ladder-sync",
								{ challengeId: challengeToSync },
								stableGlobalJobOpts(`ladder-sync__${challengeToSync}`, {
									priority: 70,
								}),
							);
						}
						return { success: true, queued: selected };
					}

					// Riot's official apex ladder for one challenge, across the configured shards.
					// Debounced by job id, so a busy leaderboard page queues at most one of these.
					// Publishes the board and returns; naming is queued as its own job below so the
					// worker slot is not held for the naming pass.
					case "ladder-sync": {
						const challengeToSync = data.challengeId as number;
						const snapshot = await syncChallengeLadder(challengeToSync);
						await updateQueue.add(
							"ladder-name",
							{ challengeId: challengeToSync },
							stableGlobalJobOpts(`ladder-name__${challengeToSync}`, {
								priority: 80,
							}),
						);
						return {
							success: true,
							rows: snapshot.global.length,
							regions: snapshot.regionsWithData.length,
						};
					}

					// The slow half of a refresh: up to 100 Account-v1 calls, paced by the key's app
					// budget. Lower priority than everything above it, so names never delay the board
					// or a player's own refresh.
					case "ladder-name": {
						const named = await nameStoredLadder(data.challengeId as number);
						return {
							success: true,
							named: named?.global.filter((row) => row.gameName !== null).length ?? 0,
						};
					}

					case "indexnow-flush": {
						const urls = [...pendingIndexNowUrls];
						pendingIndexNowUrls.clear();
						if (urls.length === 0) return { success: true, submitted: 0 };
						await notifyIndexNow(urls).catch((err) =>
							console.warn("[IndexNow] Ping failed:", err),
						);
						console.log(`[IndexNow] Submitted ${urls.length} URLs`);
						return { success: true, submitted: urls.length };
					}

					default:
						throw new Error(`Unknown job name: ${name}`);
				}
			} finally {
				console.log(`[Worker] Done:  ${name} (${identifier})`);
			}
		},
		{
			connection,
			concurrency: 2,
			limiter: { max: 2, duration: 1200 },
		},
	);

	/**
	 * Say so when a job fails.
	 *
	 * Without this a failure was completely silent: the default job options remove failed jobs, so
	 * the only trace was a `failed` event nobody was listening to. The scheduled `ladder-sweep`
	 * failed every ten minutes for four hours that way - 26 times - because the worker running at the
	 * time predated the `case` for it, and nothing said so. A new job type is matched inside the
	 * worker's closure, so adding one needs a **restart** in dev: this module can be edited without the
	 * live worker being rebuilt.
	 */
	global.__riotWorker.on("failed", (job, error) => {
		console.error(
			`[Worker] FAILED: ${job?.name ?? "unknown"} (${job?.id ?? "no id"}): ${error?.message ?? error}`,
		);
	});
}
