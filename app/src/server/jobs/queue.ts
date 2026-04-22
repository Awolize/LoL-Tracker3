// jobs/queue.ts
import { Queue, QueueEvents, Worker } from "bullmq";
import { and, eq, ilike } from "drizzle-orm";
import type { Regions } from "twisted/dist/constants";

import { db } from "~/db";
import { challengesConfig, summoner } from "~/db/schema";
import { runAllChallengeUpdatesWorker } from "~/server/challenges/update-challenges";
import { updateChallengesConfigServer } from "~/server/challenges/update-challenges-config";
import { upsertPlayerChallenges } from "~/server/challenges/update-player-challenges";
import { updateChampionDetails } from "~/server/champions/update-champion-details";
import { upsertMastery } from "~/server/champions/upsertMastery";
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
}

export const worker = global.__riotWorker;
