// jobs/queue.ts
import { Queue, QueueEvents, Worker } from "bullmq";
import type { Regions } from "twisted/dist/constants";

import { runAllChallengeUpdatesWorker } from "~/server/challenges/update-challenges";
import { updateChallengesConfigServer } from "~/server/challenges/update-challenges-config";
import { upsertPlayerChallenges } from "~/server/challenges/update-player-challenges";
import { updateChampionDetails } from "~/server/champions/update-champion-details";
import { upsertMastery } from "~/server/champions/upsertMastery";
import { fetchMatchIds, updateGamesSingle } from "~/server/matches/updateGames";
import { getSummonerByUsernameRateLimit } from "~/server/summoner/get-summoner-by-username-rate-limit";
import { upsertSummoner } from "~/server/summoner/upsertSummoner";

import { connection } from "./redis";

const QUEUE_NAME = "riot-updates";
const BASE_URL = "https://lol.awot.dev";

export const updateQueue = new Queue(QUEUE_NAME, {
	connection,
	defaultJobOptions: { removeOnComplete: true, removeOnFail: true },
});

export const updateQueueEvents = new QueueEvents(QUEUE_NAME, { connection });

updateQueueEvents.on("error", (err) => console.error("[QueueEvents] Error:", err));

// --- IndexNow buffer ---
const pendingIndexNowUrls = new Set<string>();

function scheduleIndexNowFlush() {
	updateQueue.add(
		"indexnow-flush",
		{},
		{ jobId: "indexnow-flush", delay: 10 * 60 * 1000 },
	).catch((err) => console.error("[IndexNow] Failed to schedule flush:", err));
}

function queueIndexNowUrl(url: string) {
	const wasEmpty = pendingIndexNowUrls.size === 0;
	pendingIndexNowUrls.add(url);
	if (wasEmpty) scheduleIndexNowFlush();
}

async function notifyIndexNow(urls: string[]) {
	const res = await fetch("https://api.indexnow.org/indexnow", {
		method: "POST",
		headers: { "Content-Type": "application/json; charset=utf-8" },
		body: JSON.stringify({
			host: "lol.awot.dev",
			key: "12cb155ebbb645c9a5eb01992526f734",
			keyLocation: `${BASE_URL}/12cb155ebbb645c9a5eb01992526f734.txt`,
			urlList: urls,
		}),
	});
	console.log(res.status, res.text());
}

// --- Helper ---
async function ensureSummoner(gameName: string, tagLine: string, region: Regions) {
	const data = await getSummonerByUsernameRateLimit(`${gameName}#${tagLine}`, region);
	if (!data.summoner) throw new Error(`Summoner not found: ${gameName}#${tagLine}`);
	await upsertSummoner(data.summoner, data.account, region);
	return data;
}

declare global {
	var __riotWorker: Worker | undefined;
}

if (!global.__riotWorker) {
	global.__riotWorker = new Worker(
		QUEUE_NAME,
		async (job) => {
			const { name, data } = job;
			const { gameName, tagLine, region: rawRegion, matchId, challengeId, waitForMatches = false } = data;
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
						queueIndexNowUrl(`${BASE_URL}/summoner/${region}/${gameName}-${tagLine}`);
						return { success: true, puuid: account.puuid };
					}

					case "update-summoner-only": {
						const { account } = await ensureSummoner(gameName, tagLine, region);
						queueIndexNowUrl(`${BASE_URL}/summoner/${region}/${gameName}-${tagLine}`);
						return { success: true, puuid: account.puuid };
					}

					case "update-champion-details": {
						await updateChampionDetails();
						return { success: true };
					}

					case "update-mastery": {
						const { account } = await ensureSummoner(gameName, tagLine, region);
						await upsertMastery(account, region);
						queueIndexNowUrl(`${BASE_URL}/summoner/${region}/${gameName}-${tagLine}`);
						return { success: true, puuid: account.puuid };
					}

					case "update-challenges-config": {
						await updateChallengesConfigServer(region);
						return { success: true };
					}

					case "update-challenges": {
						const { account } = await ensureSummoner(gameName, tagLine, region);
						await upsertPlayerChallenges(region, account);
						queueIndexNowUrl(`${BASE_URL}/summoner/${region}/${gameName}-${tagLine}`);
						if (challengeId) {
							queueIndexNowUrl(`${BASE_URL}/challenge/${challengeId}`);
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
							console.warn("[IndexNow] Ping failed:", err)
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