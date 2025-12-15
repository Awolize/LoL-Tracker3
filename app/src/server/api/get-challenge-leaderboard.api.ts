import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, gt, sql } from "drizzle-orm";
import { db } from "@/db";
import { challenge, challengesDetails, summoner } from "@/db/schema";
import { regionToConstant } from "@/features/shared/champs";

export const getChallengeUserRank = createServerFn()
	.inputValidator((input: { challengeId: number; puuid: string }) => input)
	.handler(async ({ data: { challengeId, puuid } }) => {
		// Get the user's challenge value
		const userChallenge = await db
			.select({ value: challenge.value })
			.from(challenge)
			.innerJoin(
				challengesDetails,
				eq(challenge.challengesDetailsId, challengesDetails.puuid),
			)
			.where(
				and(
					eq(challenge.challengeId, challengeId),
					eq(challengesDetails.puuid, puuid),
				),
			)
			.limit(1);

		if (!userChallenge.length) {
			return null; // User has no data for this challenge
		}

		const userValue = userChallenge[0].value!; // We know this exists since we got a result

		// Count users with higher values (better rank)
		const higherCountResult = await db
			.select({ count: sql<number>`count(*)` })
			.from(challenge)
			.where(gt(challenge.value, userValue));

		const higherCount = higherCountResult[0]?.count ?? 0;

		return higherCount + 1; // Rank is count of higher + 1
	});

export const getChallengeLeaderboardWithHighlight = createServerFn()
	.inputValidator(
		(input: { challengeId: number; username?: string; region?: string }) =>
			input,
	)
	.handler(async ({ data: { challengeId, username, region } }) => {
		// Always fetch top 100
		const top100 = await db
			.select({
				challenge: challenge,
				summoner: {
					gameName: summoner.gameName,
					tagLine: summoner.tagLine,
					region: summoner.region,
					profileIconId: summoner.profileIconId,
				},
			})
			.from(challenge)
			.innerJoin(
				challengesDetails,
				eq(challenge.challengesDetailsId, challengesDetails.puuid),
			)
			.innerJoin(summoner, eq(challengesDetails.puuid, summoner.puuid))
			.where(eq(challenge.challengeId, challengeId))
			.orderBy(desc(challenge.value))
			.limit(100);

		// If no username/region provided, return top 100
		if (!username || !region) {
			return { leaderboard: top100, hasSections: false };
		}

		// Check if user is in top 100
		const normalizedUsername = username.replace("-", "#").toLowerCase();
		const regionEnum = regionToConstant(region.toUpperCase());

		const userInTop100 = top100.find(
			(entry) =>
				`${entry.summoner.gameName}#${entry.summoner.tagLine}`.toLowerCase() ===
					normalizedUsername &&
				entry.summoner.region.toLowerCase() === region.toLowerCase(),
		);

		if (userInTop100) {
			// User is in top 100, return normal leaderboard
			return { leaderboard: top100, hasSections: false };
		}

		// User is not in top 100, get their rank and fetch area around them
		const { getUserByNameAndRegion } = await import(
			"@/server/api/get-user-by-name-and-region"
		);
		const user = await getUserByNameAndRegion(normalizedUsername, regionEnum);
		const userRank = await getChallengeUserRank({
			data: { challengeId, puuid: user.puuid },
		});

		if (!userRank) {
			// User has no challenge data, return top 100
			return { leaderboard: top100, hasSections: false };
		}

		// Fetch area around user (user-12 to user+12, 25 entries total)
		const offset = Math.max(0, userRank - 13); // 12 before + user + 12 after
		const userArea = await db
			.select({
				challenge: challenge,
				summoner: {
					gameName: summoner.gameName,
					tagLine: summoner.tagLine,
					region: summoner.region,
					profileIconId: summoner.profileIconId,
				},
			})
			.from(challenge)
			.innerJoin(
				challengesDetails,
				eq(challenge.challengesDetailsId, challengesDetails.puuid),
			)
			.innerJoin(summoner, eq(challengesDetails.puuid, summoner.puuid))
			.where(eq(challenge.challengeId, challengeId))
			.orderBy(desc(challenge.value))
			.offset(offset)
			.limit(25);

		// Combine: top 75 + user area (25 entries)
		const finalLeaderboard = [...top100.slice(0, 75), ...userArea];

		return { leaderboard: finalLeaderboard, hasSections: true };
	});

export const getChallengeLeaderboard = createServerFn()
	.inputValidator(
		(input: { challengeId: number; limit?: number; offset?: number }) => input,
	)
	.handler(async ({ data: { challengeId, limit = 100, offset = 0 } }) => {
		const leaderboard = await db
			.select({
				challenge: challenge,
				summoner: {
					gameName: summoner.gameName,
					tagLine: summoner.tagLine,
					region: summoner.region,
					profileIconId: summoner.profileIconId,
				},
			})
			.from(challenge)
			.innerJoin(
				challengesDetails,
				eq(challenge.challengesDetailsId, challengesDetails.puuid),
			)
			.innerJoin(summoner, eq(challengesDetails.puuid, summoner.puuid))
			.where(eq(challenge.challengeId, challengeId))
			.orderBy(desc(challenge.value))
			.offset(offset)
			.limit(limit);

		return leaderboard;
	});
