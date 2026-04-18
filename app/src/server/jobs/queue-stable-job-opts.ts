import type { JobsOptions } from "bullmq";
import type { Regions } from "twisted/dist/constants";

/** Payload shape used by `riot-updates` summoner jobs. */
export type SummonerQueueJobData = {
	gameName: string;
	tagLine: string;
	region: Regions;
};

function summonerKey(data: SummonerQueueJobData): string {
	// BullMQ forbids ":" in custom `jobId` — use "__" as the segment delimiter.
	return `${String(data.region)}__${encodeURIComponent(data.gameName)}__${encodeURIComponent(data.tagLine)}`;
}

/**
 * Deterministic BullMQ `jobId` per (job `name`, summoner [, extra segment]).
 * If a job with that id already exists, BullMQ does not create a second one — it returns the
 * existing id and emits a `duplicated` event. Job `name` stays the worker switch key; `jobId` is only identity.
 */
export function stableSummonerJobOpts(
	jobName: string,
	data: SummonerQueueJobData,
	opts: JobsOptions,
	extraSegment?: string,
): JobsOptions {
	const jobId = extraSegment
		? `${jobName}__${summonerKey(data)}__${extraSegment}`
		: `${jobName}__${summonerKey(data)}`;
	return { ...opts, jobId };
}

/** `updateChampionDetails` is global — one pending refresh at a time across all users. */
export function stableGlobalJobOpts(jobName: string, opts: JobsOptions): JobsOptions {
	return { ...opts, jobId: jobName };
}

/** Challenge config sync is per Riot shard. */
export function stableRegionShardJobOpts(
	jobName: string,
	regionShard: string,
	opts: JobsOptions,
): JobsOptions {
	return { ...opts, jobId: `${jobName}__${regionShard}` };
}
