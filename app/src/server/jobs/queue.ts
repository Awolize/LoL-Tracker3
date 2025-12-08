import * as Sentry from "@sentry/tanstackstart-react";
import { Queue, QueueEvents, Worker } from "bullmq";
import type { Regions } from "twisted/dist/constants";
import { updateChallengesConfigServer } from "@/server/challenges/update-challenges-config";
import { upsertChallenges } from "@/server/challenges/upsertChallenges";
import { updateChampionDetails } from "@/server/champions/update-champion-details";
import { upsertMastery } from "@/server/champions/upsertMastery";
import { fetchMatchIds, updateGamesSingle } from "@/server/matches/updateGames";
import { getSummonerByUsernameRateLimit } from "@/server/summoner/get-summoner-by-username-rate-limit";
import { upsertSummoner } from "@/server/summoner/upsertSummoner";

import { connection } from "./redis";

const QUEUE_NAME = "riot-updates";

export const updateQueue = new Queue(QUEUE_NAME, {
	connection,
	defaultJobOptions: { removeOnComplete: 100, removeOnFail: 500 },
});

export const updateQueueEvents = new QueueEvents(QUEUE_NAME, { connection });

declare global {
	var __riotWorker: Worker | undefined;
}

let worker: Worker;

if (global.__riotWorker) {
	worker = global.__riotWorker;
} else {
	worker = new Worker(
		QUEUE_NAME,
		async (job) => {
			console.log(
				`[Worker]      Processing ${job.name} for ${job.data.gameName || job.data.matchId}`,
			);

			const result = await Sentry.startSpan(
				{ name: `worker-${job.name}` },
				async () => {
					const { gameName, tagLine, region: rawRegion, matchId } = job.data;
					const region = rawRegion as Regions;

					if (job.name === "update-meta") {
						const userData = await getSummonerByUsernameRateLimit(
							`${gameName}#${tagLine}`,
							region,
						);

						if (!userData.summoner) throw new Error("Summoner not found");

						await upsertSummoner(userData.summoner, userData.account, region);

						await Promise.all([
							upsertMastery(userData.account, region),
							upsertChallenges(region, userData.account),
							updateChallengesConfigServer(region),
							updateChampionDetails(),
						]);

						return { success: true, puuid: userData.account.puuid };
					}

					if (job.name === "update-summoner-only") {
						const userData = await getSummonerByUsernameRateLimit(
							`${gameName}#${tagLine}`,
							region,
						);

						if (!userData.summoner) throw new Error("Summoner not found");

						await upsertSummoner(userData.summoner, userData.account, region);

						return { success: true, puuid: userData.account.puuid };
					}

					if (job.name === "process-single-match") {
						await updateGamesSingle(matchId, region);
						return { success: true };
					}

					if (job.name === "update-matches") {
						const userData = await getSummonerByUsernameRateLimit(
							`${gameName}#${tagLine}`,
							region,
						);
						if (!userData.summoner) throw new Error("Summoner not found");
						await upsertSummoner(userData.summoner, userData.account, region);

						const matchIds = await fetchMatchIds(
							userData.account.puuid,
							region,
						);

						for (const id of matchIds) {
							await updateQueue.add(
								"process-single-match",
								{ matchId: id, region },
								{ priority: 50, jobId: matchId },
							);
						}
						return { queuedMatches: matchIds.length };
					}
				},
			);

			console.log(
				`[Worker] Done processing ${job.name} for ${job.data.gameName || job.data.matchId}`,
			);
			return result;
		},
		{
			connection,
			concurrency: 1,
			limiter: { max: 1, duration: 1200 },
		},
	);

	global.__riotWorker = worker;
}

export { worker };
