import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, ilike } from "drizzle-orm";
import type { Regions } from "twisted/dist/constants";
import { db } from "@/db";
import { championMastery, summoner } from "@/db/schema";
import { regionToConstant } from "@/features/shared/champs";
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

export const refreshSummonerDataFn = createServerFn({
	method: "POST",
})
	.inputValidator((input: { username: string; region: Regions }) => input)
	.handler(async ({ data }) => {
		const { username, region } = data;
		const [gameName, tagLine] = username.split("#");

		const jobData = { gameName, tagLine, region };
		console.log(`[API] Refreshing summoner data for ${gameName}#${tagLine}`);

		const updateJob = await updateQueue.add("update-summoner-only", jobData, {
			priority: 1,
			jobId: `update-summoner-only-${gameName}#${tagLine}`,
		});

		try {
			await updateJob.waitUntilFinished(updateQueueEvents, 20000);
			return { success: true };
		} catch (error) {
			console.error("Summoner update timed out or failed", error);
			return { success: false };
		}
	});

// Helper function to check if username changed and get redirect info
export const checkUsernameRedirectFn = createServerFn({
	method: "GET",
})
	.inputValidator((input: { username: string; region: Regions }) => input)
	.handler(async ({ data }) => {
		const { username, region } = data;
		const [gameName, tagLine] = username.toLowerCase().split("#");

		try {
			// Check if we have this user in cache by old username
			const oldCachedUser = await db.query.summoner.findFirst({
				where: and(
					eq(summoner.gameName, gameName),
					eq(summoner.tagLine, tagLine),
					eq(summoner.region, region),
				),
			});

			if (!oldCachedUser) {
				return { shouldRedirect: false, newUsername: null };
			}

			// Try to fetch fresh data using the PUUID
			const freshUser = await getSummonerByUsernameRateLimit(
				oldCachedUser.puuid,
				region,
			);

			if (!freshUser.summoner) {
				return { shouldRedirect: false, newUsername: null };
			}

			// Check if username changed
			const currentGameName = freshUser.account.gameName?.toLowerCase();
			const currentTagLine = freshUser.account.tagLine?.toLowerCase();

			if (currentGameName !== gameName || currentTagLine !== tagLine) {
				// Update DB with new username
				await db
					.update(summoner)
					.set({
						gameName: currentGameName,
						tagLine: currentTagLine,
						profileIconId: freshUser.summoner.profileIconId,
						summonerLevel: freshUser.summoner.summonerLevel,
						updatedAt: new Date(),
					})
					.where(eq(summoner.puuid, oldCachedUser.puuid));

				return {
					shouldRedirect: true,
					newUsername: `${currentGameName}-${currentTagLine}`,
				};
			}

			return { shouldRedirect: false, newUsername: null };
		} catch (err) {
			console.error("Error checking username redirect:", err);
			return { shouldRedirect: false, newUsername: null };
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
			includeMatches?: boolean;
		}) => input,
	)
	.handler(async ({ data }) => {
		return Sentry.startSpan({ name: "queue-dispatch-update" }, async () => {
			const { gameName, tagLine, region, includeMatches = true } = data;
			const regionEnum = regionToConstant(region);
			const jobData = { gameName, tagLine, region: regionEnum };
			console.log(`[API] Received update request for ${gameName}#${tagLine}`);

			const metaJob = await updateQueue.add("update-meta", jobData, {
				priority: 1,
				jobId: `update-meta-${gameName}#${tagLine}`,
			});

			try {
				await metaJob.waitUntilFinished(updateQueueEvents, 20000);
			} catch (error) {
				console.error("Meta update timed out or failed", error);
				return false;
			}

			if (includeMatches) {
				try {
					const matchJob = await updateQueue.add("update-matches", jobData, {
						priority: 5,
						jobId: `update-matches-${gameName}#${tagLine}`,
					});

					await matchJob.waitUntilFinished(updateQueueEvents, 60000);
				} catch (error) {
					console.error("Match update timed out or failed", error);
					return true;
				}
			}

			return true;
		});
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
