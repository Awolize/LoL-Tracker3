import * as Sentry from "@sentry/tanstackstart-react";
import { Queue, QueueEvents, Worker } from "bullmq";
import type { Regions } from "twisted/dist/constants";
import { regionToRegionGroupForAccountAPI } from "twisted/dist/constants";
import { updateChallengesConfigServer } from "@/server/challenges/update-challenges-config";
import { upsertChallenges } from "@/server/challenges/upsertChallenges";
import { updateChampionDetails } from "@/server/champions/update-champion-details";
import { upsertMastery } from "@/server/champions/upsertMastery";
import { riotApi } from "@/server/lib/riot-api";
import { updateGames } from "@/server/matches/updateGames";
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
			console.log(`[Worker]      Processing ${job.name} for ${job.data.gameName}`);

			const result = Sentry.startSpan({ name: `worker-${job.name}` }, async () => {
				const { gameName, tagLine, region: rawRegion } = job.data;
				const region = rawRegion as Regions;
				const regionGroup = regionToRegionGroupForAccountAPI(region);

				if (job.name === "update-meta") {
					const user = (
						await riotApi.Account.getByRiotId(gameName, tagLine, regionGroup)
					).response;

					if (!user.puuid) throw new Error("User does not exist");

					await Promise.all([
						updateChallengesConfigServer(region),
						updateChampionDetails(),
					]);

					const updatedUser = await upsertSummoner(user.puuid, region);

					if (!updatedUser) throw new Error("Could not update user");

					await Promise.all([
						upsertMastery(updatedUser, region),
						upsertChallenges(region, updatedUser),
					]);

					return { success: true, puuid: user.puuid };
				}

				if (job.name === "update-matches") {
					const userResponse = await riotApi.Account.getByRiotId(
						gameName,
						tagLine,
						regionGroup,
					);
					const user = userResponse.response;

					const updatedUser = await upsertSummoner(user.puuid, region);

					if (!updatedUser) throw new Error("User not found for match update");

					await updateGames(updatedUser, region);

					return { success: true };
				}
			});

			console.log(`[Worker] Done processing ${job.name} for ${job.data.gameName}`);

			return result;
		},
		{
			connection,
			concurrency: 1,
			limiter: {
				max: 1,
				duration: 1200,
			},
		},
	);

	global.__riotWorker = worker;
}

export { worker };
