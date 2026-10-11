import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, ilike } from "drizzle-orm";

import { db } from "~/db";
import { championMastery, summoner } from "~/db/schema";
import type { ProfileHubChallengesPayload } from "~/features/challenges/types/profile-challenge-row";
import { regionToConstant } from "~/features/shared/champs";
import { parseRiotId } from "~/features/shared/riot-id";
import { getChallengesConfig } from "~/server/api/get-challenges-config";
import { getDataDragonVersion } from "~/server/api/get-datadragon-version";
import { getUserByNameAndRegion } from "~/server/api/get-user-by-name-and-region";
import { buildProfileChallengeRows } from "~/server/challenges/build-profile-challenge-rows";
import { getChallengesProgressMapForPuuid } from "~/server/challenges/challenges-progress-map";
import { getCompleteChampionData } from "~/server/champions/get-complete-champion-data";
import { updateQueue, updateQueueEvents } from "~/server/jobs/queue";
import {
	stableGlobalJobOpts,
	stableRegionShardJobOpts,
	stableSummonerJobOpts,
} from "~/server/jobs/queue-stable-job-opts";

type SummonerResult = {
	summonerData: {
		puuid: string;
		gameName: string | null;
		tagLine: string | null;
		profileIconId: number;
		summonerLevel: number;
	} | null;
	profileIconUrl: string | null;
	error: "rate_limit" | "not_found" | "name_changed" | null;
	newUsername?: string;
	isCached: boolean;
	lastUpdated: Date | null;
};

export const getUserByNameAndRegionFn = createServerFn({ method: "GET" })
	.validator((input: { username: string; region: string; forceRefresh?: boolean }) => input)
	.handler(async ({ data }): Promise<SummonerResult> => {
		const { username: rawUsername, region: rawRegion, forceRefresh = false } = data;
		const username = parseRiotId(rawUsername);
		const regionEnum = regionToConstant(rawRegion.toUpperCase());

		const resolved = await getUserByNameAndRegion(username, regionEnum, { forceRefresh });

		if (!resolved.ok) {
			return {
				summonerData: null,
				profileIconUrl: null,
				error: resolved.error,
				isCached: false,
				lastUpdated: null,
			};
		}

		// Riot answered under a different name for this PUUID: the profile route redirects.
		if (resolved.renamedTo) {
			return {
				summonerData: null,
				profileIconUrl: null,
				error: "name_changed",
				newUsername: resolved.renamedTo,
				isCached: false,
				lastUpdated: null,
			};
		}

		const { user } = resolved;

		return {
			summonerData: {
				puuid: user.puuid,
				gameName: user.gameName,
				tagLine: user.tagLine,
				profileIconId: user.profileIconId,
				summonerLevel: user.summonerLevel,
			},
			profileIconUrl: user.profileIconId
				? `/api/images/cdn/${await getDataDragonVersion()}/img/profileicon/${user.profileIconId}.webp`
				: null,
			error: null,
			isCached: resolved.isCached,
			lastUpdated: resolved.lastUpdated,
		};
	});

export const getLastMasteryUpdate = createServerFn({
	method: "GET",
})
	.validator((input: { puuid: string }) => input)
	.handler(async ({ data }) => {
		const { puuid } = data;

		const result = await db
			.select({ max: championMastery.updatedAt })
			.from(championMastery)
			.where(eq(championMastery.puuid, puuid))
			.orderBy(desc(championMastery.updatedAt))
			.limit(1);

		return result[0]?.max ?? null;
	});

export const fullUpdateSummoner = createServerFn({ method: "POST" })
	.validator(
		(input: { gameName: string; tagLine: string; region: string; awaitMatches?: boolean }) =>
			input,
	)
	.handler(async ({ data }) => {
		const { gameName, tagLine, region, awaitMatches = true } = data;
		const regionEnum = regionToConstant(region);
		const jobData = { gameName, tagLine, region: regionEnum };

		console.log(
			`[API] Update request for ${gameName}#${tagLine} (Await Matches: ${awaitMatches})`,
		);

		const jobPromises = [
			updateQueue.add(
				"update-summoner-only",
				jobData,
				stableSummonerJobOpts("update-summoner-only", jobData, { priority: 1 }),
			),
			updateQueue.add(
				"update-champion-details",
				jobData,
				stableGlobalJobOpts("update-champion-details", { priority: 2 }),
			),
			updateQueue.add(
				"update-challenges-config",
				jobData,
				stableRegionShardJobOpts("update-challenges-config", String(regionEnum), {
					priority: 3,
				}),
			),
			updateQueue.add(
				"update-mastery",
				jobData,
				stableSummonerJobOpts("update-mastery", jobData, { priority: 4 }),
			),
			updateQueue.add(
				"update-matches",
				{ ...jobData, waitForMatches: awaitMatches },
				stableSummonerJobOpts(
					"update-matches",
					jobData,
					{ priority: 5 },
					String(awaitMatches),
				),
			),
			updateQueue.add(
				"update-challenges",
				jobData,
				stableSummonerJobOpts("update-challenges", jobData, { priority: 20 }),
			),
			updateQueue.add(
				"run-challenges-computation",
				jobData,
				stableSummonerJobOpts("run-challenges-computation", jobData, { priority: 21 }),
			),
		];

		try {
			const enqueuedJobs = await Promise.all(jobPromises);

			enqueuedJobs.forEach((job) => {
				console.log(`[API] Job enqueued: ${job.id} (${job.name})`);
			});

			const criticalJobNames = [
				"update-summoner-only",
				"update-champion-details",
				"update-challenges-config",
				"update-mastery",
			];

			if (awaitMatches) {
				criticalJobNames.push("update-matches", "run-challenges-computation");
			}

			const jobsToAwait = enqueuedJobs.filter(
				(job) => job && criticalJobNames.includes(job.name),
			);

			await Promise.all(jobsToAwait.map((j) => j.waitUntilFinished(updateQueueEvents)));

			Sentry.metrics.count("profile_update_server", 1, {
				attributes: {
					region,
					username: `${gameName}#${tagLine}`,
					awaitMatches: awaitMatches.toString(),
				},
			});

			return { success: true };
		} catch (error) {
			console.error("Update failed", error);
			return { success: false };
		}
	});

export const getUsernameSuggestions = createServerFn({
	method: "POST",
})
	.validator((data: { username: string; region: string }) => ({
		username: data.username,
		region: data.region,
	}))
	.handler(async ({ data: { username } }) => {
		const query = username.trim().toLowerCase();
		if (!query || query.length > 50) return [];

		// Split query on # to handle gameName#tagLine format
		const [gameNamePart = "", tagLinePart = ""] = query.split("#").map((s) => s.trim());

		let whereConditions;
		if (gameNamePart && tagLinePart) {
			whereConditions = and(
				ilike(summoner.gameName, `%${gameNamePart}%`),
				ilike(summoner.tagLine, `%${tagLinePart}%`),
			);
		} else if (gameNamePart) {
			whereConditions = ilike(summoner.gameName, `%${gameNamePart}%`);
		} else if (tagLinePart) {
			whereConditions = ilike(summoner.tagLine, `%${tagLinePart}%`);
		} else {
			return [];
		}

		const suggestions = await db
			.select({
				gameName: summoner.gameName,
				tagLine: summoner.tagLine,
				summonerLevel: summoner.summonerLevel,
				profileIconId: summoner.profileIconId,
				region: summoner.region,
			})
			.from(summoner)
			.where(whereConditions)
			.orderBy(desc(summoner.updatedAt))
			.limit(10);

		return suggestions.map((entry) => ({
			username: `${entry.gameName}#${entry.tagLine}`,
			level: entry.summonerLevel,
			iconId: entry.profileIconId,
			region: entry.region,
		}));
	});

export const getSummonerByNameRegion = createServerFn({
	method: "GET",
})
	.validator((input: { username: string; region: string }) => input)
	.handler(async ({ data }) => {
		const { username: rawUsername, region: rawRegion } = data;

		const username = parseRiotId(rawUsername);
		const region = regionToConstant(rawRegion.toUpperCase());

		const resolved = await getUserByNameAndRegion(username, region);
		if (!resolved.ok) {
			// The mastery and challenge routes read this, so an unresolvable summoner has to fail
			// loudly and 404 rather than render an empty profile.
			throw new Error(`Summoner not found: ${username}`);
		}

		const [completeChampionsData, challenges] = await Promise.all([
			getCompleteChampionData(region, resolved.user),
			getChallengesConfig(),
		]);
		return {
			user: resolved.user,
			playerChampionInfo: completeChampionsData.completeChampionsData,
			challenges,
			version: completeChampionsData.version,
		};
	});

/** Profile hub: all challenges + Riot progress (same module as other profile serverFns). */
export const getProfileHubChallengesFn = createServerFn({ method: "GET" })
	.validator((input: { puuid: string }) => input)
	.handler(async ({ data }): Promise<ProfileHubChallengesPayload> => {
		const [configs, progressMap, version] = await Promise.all([
			getChallengesConfig(),
			getChallengesProgressMapForPuuid(data.puuid),
			getDataDragonVersion(),
		]);

		return {
			rows: buildProfileChallengeRows(configs, progressMap),
			challengesSynced: progressMap !== null,
			dataDragonVersion: version,
		};
	});
