import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, ilike } from "drizzle-orm";

import { db } from "~/db";
import { championMastery, summoner } from "~/db/schema";
import type { ProfileHubChallengesPayload } from "~/features/challenges/types/profile-challenge-row";
import { regionToConstant } from "~/features/shared/champs";
import { getChallengesConfig } from "~/server/api/get-challenges-config";
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
import {
	getSummonerByPuuidRateLimit,
	getSummonerByUsernameRateLimit,
} from "~/server/summoner/get-summoner-by-username-rate-limit";

const CHECK_INTERVAL_MS = 1000 * 60 * 60; // Check every hour if we should update

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
	.inputValidator((input: { username: string; region: string; forceRefresh?: boolean }) => input)
	.handler(async ({ data }): Promise<SummonerResult> => {
		const { username, region, forceRefresh = false } = data;
		const regionEnum = regionToConstant(region);
		// Keep lowercase only for DB lookup — never store this
		const [gameNameLower, tagLineLower] = username.toLowerCase().split("#");

		const now = new Date();

		// Helper to get version/profileIconUrl (called in multiple paths)
		const getProfileIconUrl = async (profileIconId: number | null) => {
			if (!profileIconId) return null;
			const versionRow = await db.query.championDetails.findFirst({
				columns: { version: true },
			});
			const version = versionRow?.version ?? "latest";
			return `/api/images/cdn/${version}/img/profileicon/${profileIconId}.webp`;
		};

		try {
			// 1. Look up by lowercased name in DB
			const cachedUser = await db.query.summoner.findFirst({
				where: and(
					eq(summoner.gameName, gameNameLower),
					eq(summoner.tagLine, tagLineLower),
					eq(summoner.region, regionEnum),
				),
			});

			const shouldUpdate =
				forceRefresh ||
				!cachedUser ||
				(cachedUser.updatedAt &&
					now.getTime() - cachedUser.updatedAt.getTime() > CHECK_INTERVAL_MS);

			// 2. Cache is fresh — return early
			if (cachedUser && !shouldUpdate) {
				return {
					summonerData: {
						puuid: cachedUser.puuid,
						gameName: cachedUser.gameName,
						tagLine: cachedUser.tagLine,
						profileIconId: cachedUser.profileIconId,
						summonerLevel: cachedUser.summonerLevel,
					},
					profileIconUrl: await getProfileIconUrl(cachedUser.profileIconId),
					error: null,
					isCached: true,
					lastUpdated: cachedUser.updatedAt,
				};
			}

			// 3. Try Riot API by name
			let riotUser: Awaited<ReturnType<typeof getSummonerByUsernameRateLimit>> | null = null;
			try {
				riotUser = await getSummonerByUsernameRateLimit(username.toLowerCase(), regionEnum);
			} catch (err: any) {
				// Name returned 404 — if we have a PUUID, try resolving by that instead
				if (err?.status === 404 && cachedUser?.puuid) {
					const freshAccount = await getSummonerByPuuidRateLimit(
						cachedUser.puuid,
						regionEnum,
					);

					if (!freshAccount?.account) throw new Error("Summoner not found");

					const newGameName = freshAccount.account.gameName;
					const newTagLine = freshAccount.account.tagLine;

					// ✅ Store canonical casing from Riot
					await db
						.insert(summoner)
						.values({
							puuid: cachedUser.puuid,
							gameName: newGameName.toLowerCase(),
							tagLine: newTagLine.toLowerCase(),
							region: regionEnum,
							profileIconId:
								freshAccount.summoner?.profileIconId ?? cachedUser.profileIconId,
							summonerLevel:
								freshAccount.summoner?.summonerLevel ?? cachedUser.summonerLevel,
							summonerId: freshAccount.summoner?.id ?? cachedUser.summonerId,
							accountId: freshAccount.summoner?.accountId ?? cachedUser.accountId,
							revisionDate: freshAccount.summoner?.revisionDate
								? new Date(freshAccount.summoner.revisionDate)
								: cachedUser.revisionDate,
							updatedAt: now,
						})
						.onConflictDoUpdate({
							target: summoner.puuid,
							set: {
								gameName: newGameName.toLowerCase(),
								tagLine: newTagLine.toLowerCase(),
								updatedAt: now,
							},
						});

					// Signal to the route to redirect to the new name
					return {
						summonerData: null,
						profileIconUrl: null,
						error: "name_changed",
						newUsername: `${newGameName}#${newTagLine}`,
						isCached: false,
						lastUpdated: null,
					};
				}
				throw err; // 429, 500, etc — fall through to outer catch
			}

			if (!riotUser?.summoner) throw new Error("Summoner not found");

			// ✅ Use Riot's canonical casing for display, lowercase for DB lookup
			const canonicalGameName = riotUser.account.gameName;
			const canonicalTagLine = riotUser.account.tagLine;

			// 4. Upsert with lowercased name for consistent lookups
			await db
				.insert(summoner)
				.values({
					puuid: riotUser.summoner.puuid,
					gameName: canonicalGameName.toLowerCase(),
					tagLine: canonicalTagLine.toLowerCase(),
					region: regionEnum,
					profileIconId: riotUser.summoner.profileIconId,
					summonerLevel: riotUser.summoner.summonerLevel,
					summonerId: riotUser.summoner.id,
					accountId: riotUser.summoner.accountId,
					revisionDate: new Date(riotUser.summoner.revisionDate),
					updatedAt: now,
				})
				.onConflictDoUpdate({
					target: summoner.puuid,
					set: {
						gameName: canonicalGameName.toLowerCase(),
						tagLine: canonicalTagLine.toLowerCase(),
						profileIconId: riotUser.summoner.profileIconId,
						summonerLevel: riotUser.summoner.summonerLevel,
						updatedAt: now,
					},
				});

			return {
				summonerData: {
					puuid: riotUser.summoner.puuid,
					gameName: canonicalGameName, // ✅ canonical for display
					tagLine: canonicalTagLine,
					profileIconId: riotUser.summoner.profileIconId,
					summonerLevel: riotUser.summoner.summonerLevel,
				},
				profileIconUrl: await getProfileIconUrl(riotUser.summoner.profileIconId),
				error: null,
				isCached: false,
				lastUpdated: now,
			};
		} catch (err: any) {
			console.error("Error fetching summoner:", err);
			const error = err?.status === 429 ? "rate_limit" : "not_found";
			return {
				summonerData: null,
				profileIconUrl: null,
				error,
				isCached: false,
				lastUpdated: null,
			};
		}
	});

export const getLastMasteryUpdate = createServerFn({
	method: "GET",
})
	.inputValidator((input: { puuid: string }) => input)
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
	.inputValidator(
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
	.inputValidator((data: { username: string; region: string }) => ({
		username: data.username,
		region: data.region,
	}))
	.handler(async ({ data: { username, region } }) => {
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
	.inputValidator((input: { username: string; region: string }) => input)
	.handler(async ({ data }) => {
		const { username: rawUsername, region: rawRegion } = data;

		const username = rawUsername.replace("-", "#").toLowerCase();
		const region = regionToConstant(rawRegion.toUpperCase());

		const user = await getUserByNameAndRegion(username, region);

		const [completeChampionsData, challenges] = await Promise.all([
			getCompleteChampionData(region, user),
			getChallengesConfig(),
		]);
		return {
			user,
			playerChampionInfo: completeChampionsData.completeChampionsData,
			challenges,
			version: completeChampionsData.completeChampionsData[0]?.version || "latest",
		};
	});

/** Profile hub: all challenges + Riot progress (same module as other profile serverFns). */
export const getProfileHubChallengesFn = createServerFn({ method: "GET" })
	.inputValidator((input: { puuid: string }) => input)
	.handler(async ({ data }): Promise<ProfileHubChallengesPayload> => {
		const [configs, progressMap, versionRow] = await Promise.all([
			getChallengesConfig(),
			getChallengesProgressMapForPuuid(data.puuid),
			db.query.championDetails.findFirst({ columns: { version: true } }),
		]);

		return {
			rows: buildProfileChallengeRows(configs, progressMap),
			challengesSynced: progressMap !== null,
			dataDragonVersion: versionRow?.version ?? "latest",
		};
	});
