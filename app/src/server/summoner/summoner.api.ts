// app/server/summoner.ts
import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq } from "drizzle-orm";
import type { Regions } from "twisted/dist/constants";
import { db } from "@/db";
import { championMastery, summoner } from "@/db/schema";
import { regionToConstant } from "@/features/shared/champs";
import { getSummonerByUsernameRateLimit } from "@/server/summoner/get-summoner-by-username-rate-limit";

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
				summonerData: user.summoner,
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
		return await getUserByNameAndRegionFn({
			data: { ...data, forceRefresh: true },
		});
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
			const currentGameName = freshUser.summoner.gameName?.toLowerCase();
			const currentTagLine = freshUser.summoner.tagLine?.toLowerCase();

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
