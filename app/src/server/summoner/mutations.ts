import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, ilike } from "drizzle-orm";
import type { Regions } from "twisted/dist/constants";
import { db } from "@/db";
import { championMastery, summoner } from "@/db/schema";
import { regionToConstant } from "@/features/shared/champs";
import { getChallengesConfig } from "@/server/api/get-challenges-config";
import { getUserByNameAndRegion } from "@/server/api/get-user-by-name-and-region";
import { getCompleteChampionData } from "@/server/champions/get-complete-champion-data";
import { updateQueue, updateQueueEvents } from "@/server/jobs/queue";
import { getSummonerByUsernameRateLimit } from "@/server/summoner/get-summoner-by-username-rate-limit";

type NameChangeResult =
	| { found: false; newUsername?: never }
	| { found: true; newUsername: string };

export const checkNameChangeFn = createServerFn({ method: "POST" })
	.inputValidator((data: { username: string; region: Regions }) => data)
	.handler(
		async ({ data: { username, region } }): Promise<NameChangeResult> => {
			const [gameName, tagLine] = username.toLowerCase().split("#");

			// Check DB for old username
			const oldCachedUser = await db.query.summoner.findFirst({
				where: and(
					eq(summoner.gameName, gameName),
					eq(summoner.tagLine, tagLine),
					eq(summoner.region, region),
				),
			});

			if (!oldCachedUser) {
				return { found: false };
			}

			try {
				// Fetch fresh data using PUUID
				const freshUser = await getSummonerByUsernameRateLimit(
					oldCachedUser.puuid,
					region,
				);

				if (freshUser.summoner) {
					const newUsername = `${freshUser.account.gameName}-${freshUser.account.tagLine}`;

					// Update DB
					await db
						.update(summoner)
						.set({
							gameName: freshUser.account.gameName,
							tagLine: freshUser.account.tagLine,
							profileIconId: freshUser.summoner.profileIconId,
							summonerLevel: freshUser.summoner.summonerLevel,
							updatedAt: new Date(),
						})
						.where(eq(summoner.puuid, oldCachedUser.puuid));

					return { found: true, newUsername };
				}
			} catch (error) {
				console.error("Error migrating user:", error);
			}

			return { found: false };
		},
	);

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
	error: "rate_limit" | "not_found" | null;
	isCached: boolean;
	lastUpdated: Date | null;
};

export const getUserByNameAndRegionFn = createServerFn({
	method: "GET",
})
	.inputValidator(
		(input: { username: string; region: string; forceRefresh?: boolean }) =>
			input,
	)
	.handler(async ({ data }): Promise<SummonerResult> => {
		const { username, region, forceRefresh = false } = data;
		const regionEnum = regionToConstant(region);
		const [gameName, tagLine] = username.toLowerCase().split("#");

		try {
			// 1. Try to find in database by current username
			const cachedUser = await db.query.summoner.findFirst({
				where: and(
					eq(summoner.gameName, gameName),
					eq(summoner.tagLine, tagLine),
					eq(summoner.region, regionEnum),
				),
			});

			const now = new Date();
			const shouldUpdate =
				forceRefresh ||
				!cachedUser ||
				(cachedUser.updatedAt &&
					now.getTime() - cachedUser.updatedAt.getTime() > CHECK_INTERVAL_MS);

			// 2. If cache is fresh and no force refresh, return cached data
			if (cachedUser && !shouldUpdate) {
				const versionRow = await db.query.championDetails.findFirst({
					columns: { version: true },
				});
				const version = versionRow?.version ?? "latest";

				const profileIconUrl = cachedUser.profileIconId
					? `/api/images/cdn/${version}/img/profileicon/${cachedUser.profileIconId}.webp`
					: null;

				return {
					summonerData: {
						puuid: cachedUser.puuid,
						gameName: cachedUser.gameName,
						tagLine: cachedUser.tagLine,
						profileIconId: cachedUser.profileIconId,
						summonerLevel: cachedUser.summonerLevel,
					},
					profileIconUrl,
					error: null,
					isCached: true,
					lastUpdated: cachedUser.updatedAt,
				};
			}

			// 3. Fetch from Riot API
			const user = await getSummonerByUsernameRateLimit(
				username.toLowerCase(),
				regionEnum,
			);

			if (!user.summoner) {
				throw new Error("Summoner not found");
			}

			const versionRow = await db.query.championDetails.findFirst({
				columns: { version: true },
			});
			const version = versionRow?.version ?? "latest";

			const profileIconUrl = user.summoner.profileIconId
				? `/api/images/cdn/${version}/img/profileicon/${user.summoner.profileIconId}.webp`
				: null;

			// 4. Upsert into database
			await db
				.insert(summoner)
				.values({
					puuid: user.summoner.puuid,
					gameName: gameName,
					tagLine: tagLine,
					region: regionEnum,
					profileIconId: user.summoner.profileIconId,
					summonerLevel: user.summoner.summonerLevel,
					summonerId: user.summoner.id,
					accountId: user.summoner.accountId,
					revisionDate: new Date(user.summoner.revisionDate),
					updatedAt: now,
				})
				.onConflictDoUpdate({
					target: summoner.puuid,
					set: {
						gameName: gameName,
						tagLine: tagLine,
						profileIconId: user.summoner.profileIconId,
						summonerLevel: user.summoner.summonerLevel,
						updatedAt: now,
					},
				});

			return {
				summonerData: {
					puuid: user.summoner.puuid,
					gameName: user.account.gameName,
					tagLine: user.account.tagLine,
					profileIconId: user.summoner.profileIconId,
					summonerLevel: user.summoner.summonerLevel,
				},
				profileIconUrl,
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

		// Use Drizzle's aggregate function to get MAX updatedAt
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
		(input: {
			gameName: string;
			tagLine: string;
			region: string;
			awaitMatches?: boolean;
		}) => input,
	)
	.handler(async ({ data }) => {
		const { gameName, tagLine, region, awaitMatches = true } = data;
		const regionEnum = regionToConstant(region);
		const jobData = { gameName, tagLine, region: regionEnum };

		console.log(
			`[API] Update request for ${gameName}#${tagLine} (Await Matches: ${awaitMatches})`,
		);

		// Make jobId unique per request to avoid collisions
		const makeId = (type: string) =>
			`${type}-${gameName}-${tagLine}-${Date.now()}`;

		const jobPromises = [
			updateQueue.add("update-summoner-only", jobData, {
				priority: 1,
				jobId: makeId("update-summoner"),
			}),
			updateQueue.add("update-champion-details", jobData, {
				priority: 2,
				jobId: makeId("update-champion-details"),
			}),
			updateQueue.add("update-challenges-config", jobData, {
				priority: 3,
				jobId: makeId("update-challenges-config"),
			}),
			updateQueue.add("update-mastery", jobData, {
				priority: 4,
				jobId: makeId("update-mastery"),
			}),
			updateQueue.add("update-matches", { ...jobData, waitForMatches: awaitMatches }, {
				priority: 5,
				jobId: makeId("update-matches"),
			}),
			updateQueue.add("update-challenges", jobData, {
				priority: 20,
				jobId: makeId("update-challenges"),
			}),
			updateQueue.add("run-challenges-computation", jobData, {
				priority: 21,
				jobId: makeId("run-challenges-computation"),
			}),
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

			await Promise.all(
				jobsToAwait.map((j) => j.waitUntilFinished(updateQueueEvents)),
			);

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
		const [gameNamePart = "", tagLinePart = ""] = query
			.split("#")
			.map((s) => s.trim());

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
			version:
				completeChampionsData.completeChampionsData[0]?.version || "latest",
		};
	});
