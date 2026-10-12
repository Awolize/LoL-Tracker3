import { createServerFn } from "@tanstack/react-start";
import { and, count, desc, eq, gt, sql } from "drizzle-orm";

import { db } from "~/db";
import { challenge, challengesDetails, summoner } from "~/db/schema";
import { regionToConstant } from "~/features/shared/champs";
import { parseRiotId } from "~/features/shared/riot-id";

const getChallengeUserRank = createServerFn()
	.validator((input: { challengeId: number; puuid: string }) => input)
	.handler(async ({ data: { challengeId, puuid } }) => {
		// Get the user's challenge value
		const userChallenge = await db
			.select({ value: challenge.value })
			.from(challenge)
			.innerJoin(
				challengesDetails,
				eq(challenge.challengesDetailsId, challengesDetails.puuid),
			)
			.where(and(eq(challenge.challengeId, challengeId), eq(challengesDetails.puuid, puuid)))
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
	.validator((input: { challengeId: number; username?: string; region?: string }) => input)
	.handler(async ({ data: { challengeId, username, region } }) => {
		// The board ranks only the summoners whose rows survive these joins, so the honest population
		// is that same join counted - never a hardcoded total and never the "top 100" the list is
		// capped at. `Challenge` covers 400+ challenge ids but only a handful of tracked summoners
		// each, so this number is real and usually small.
		const populationQuery = db
			.select({ population: count() })
			.from(challenge)
			.innerJoin(
				challengesDetails,
				eq(challenge.challengesDetailsId, challengesDetails.puuid),
			)
			.innerJoin(summoner, eq(challengesDetails.puuid, summoner.puuid))
			.where(eq(challenge.challengeId, challengeId));

		// Always fetch top 100
		const top100Query = db
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

		const [top100, populationRows] = await Promise.all([top100Query, populationQuery]);
		const population = populationRows[0]?.population ?? 0;

		// If no username/region provided, return top 100
		if (!username || !region) {
			return { leaderboard: top100, hasSections: false, population };
		}

		// Check if user is in top 100
		const normalizedUsername = parseRiotId(username).toLowerCase();
		const regionEnum = regionToConstant(region.toUpperCase());

		const userInTop100 = top100.find(
			(entry) =>
				`${entry.summoner.gameName}#${entry.summoner.tagLine}`.toLowerCase() ===
					normalizedUsername &&
				entry.summoner.region.toLowerCase() === region.toLowerCase(),
		);

		if (userInTop100) {
			// User is in top 100, return normal leaderboard
			return { leaderboard: top100, hasSections: false, population };
		}

		// User is not in top 100, get their rank and fetch area around them
		const { getUserByNameAndRegion } = await import("~/server/api/get-user-by-name-and-region");
		const resolved = await getUserByNameAndRegion(normalizedUsername, regionEnum);
		if (!resolved.ok) {
			// Unresolvable user - there is no rank to build a highlight section around.
			return { leaderboard: top100, hasSections: false, population };
		}

		const userRank = await getChallengeUserRank({
			data: { challengeId, puuid: resolved.user.puuid },
		});

		if (!userRank) {
			// User has no challenge data, return top 100
			return { leaderboard: top100, hasSections: false, population };
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

		return { leaderboard: finalLeaderboard, hasSections: true, population };
	});
