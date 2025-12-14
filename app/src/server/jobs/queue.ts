// jobs/queue.ts
import { Queue, QueueEvents, Worker } from "bullmq";
import type { Regions } from "twisted/dist/constants";
import { runAllChallengeUpdatesWorker } from "@/server/challenges/update-challenges";
import { updateChallengesConfigServer } from "@/server/challenges/update-challenges-config";
import { upsertPlayerChallenges } from "@/server/challenges/update-player-challenges";
import { updateChampionDetails } from "@/server/champions/update-champion-details";
import { upsertMastery } from "@/server/champions/upsertMastery";
import { fetchMatchIds, updateGamesSingle } from "@/server/matches/updateGames";
import { getSummonerByUsernameRateLimit } from "@/server/summoner/get-summoner-by-username-rate-limit";
import { upsertSummoner } from "@/server/summoner/upsertSummoner";
import { connection } from "./redis";

const QUEUE_NAME = "riot-updates";

export const updateQueue = new Queue(QUEUE_NAME, {
	connection,
	defaultJobOptions: { removeOnComplete: true, removeOnFail: true },
});

export const updateQueueEvents = new QueueEvents(QUEUE_NAME, { connection });

updateQueueEvents.on("error", (err) =>
	console.error("[QueueEvents] Error:", err),
);

// --- Helper ---
async function ensureSummoner(
	gameName: string,
	tagLine: string,
	region: Regions,
) {
	const data = await getSummonerByUsernameRateLimit(
		`${gameName}#${tagLine}`,
		region,
	);
	if (!data.summoner)
		throw new Error(`Summoner not found: ${gameName}#${tagLine}`);

	// Always update the DB with the latest account info
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
			const { gameName, tagLine, region: rawRegion, matchId } = data;
			const region = rawRegion as Regions;

			// "Name#Tag" OR "MatchID"
			const identifier = gameName ? `${gameName}#${tagLine}` : matchId;
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
						return { success: true, puuid: account.puuid };
					}

					case "update-summoner-only": {
						const { account } = await ensureSummoner(gameName, tagLine, region);
						return { success: true, puuid: account.puuid };
					}

					case "update-champion-details": {
						await updateChampionDetails();
						return { success: true };
					}

					case "update-mastery": {
						const { account } = await ensureSummoner(gameName, tagLine, region);
						await upsertMastery(account, region);
						return { success: true, puuid: account.puuid };
					}

					case "update-challenges-config": {
						await updateChallengesConfigServer(region);
						return { success: true };
					}

					case "update-challenges": {
						const { account } = await ensureSummoner(gameName, tagLine, region);
						await upsertPlayerChallenges(region, account);
						return { success: true, puuid: account.puuid };
					}

					case "process-single-match": {
						await updateGamesSingle(matchId, region);
						return { success: true };
					}

					case "update-matches": {
						const { account } = await ensureSummoner(gameName, tagLine, region);
						const matchIds = await fetchMatchIds(account.puuid, region);

						// Optimization: Add all jobs in parallel
						const jobs = await Promise.all(
							matchIds.map((id) =>
								updateQueue.add(
									"process-single-match",
									{ matchId: id, region },
									{ priority: 50, jobId: id },
								),
							),
						);

						await Promise.all(
							jobs.map((j) => j.waitUntilFinished(updateQueueEvents)),
						);
						return { success: true, processedMatches: matchIds.length };
					}

					case "run-challenges-computation": {
						return await runAllChallengeUpdatesWorker({
							username: `${gameName}#${tagLine}`,
							region,
						});
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
