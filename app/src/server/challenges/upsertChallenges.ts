import type { Regions } from "twisted/dist/constants";
import type { AccountDto } from "twisted/dist/models-dto/account/account.dto";
import { db } from "@/db";
import {
	categoryPoints,
	challenge,
	challengesDetails,
	preferences,
	totalPoints,
} from "@/db/schema";
import { lolApi } from "@/server/external/riot/lol-api";

export const upsertChallenges = async (region: Regions, user: AccountDto) => {
	const response = (
		await lolApi.Challenges.PlayerChallenges(user.puuid, region)
	).response;

	// Upsert challengesDetails
	await db
		.insert(challengesDetails)
		.values({
			puuid: user.puuid,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		.onConflictDoNothing();

	// Upsert totalPoints
	await db
		.insert(totalPoints)
		.values({
			challengesDetailsId: user.puuid,
			current: response.totalPoints.current,
			level: response.totalPoints.level,
			max: response.totalPoints.max,
		})
		.onConflictDoUpdate({
			target: totalPoints.challengesDetailsId,
			set: {
				current: response.totalPoints.current,
				level: response.totalPoints.level,
				max: response.totalPoints.max,
			},
		});

	// Upsert categoryPoints
	for (const [category, catData] of Object.entries(response.categoryPoints)) {
		await db
			.insert(categoryPoints)
			.values({
				challengesDetailsId: user.puuid,
				category,
				current: catData.current,
				level: catData.level,
				max: catData.max,
				percentile: catData.percentile ?? -1,
			})
			.onConflictDoUpdate({
				target: [categoryPoints.challengesDetailsId, categoryPoints.category],
				set: {
					current: catData.current,
					level: catData.level,
					max: catData.max,
					percentile: catData.percentile ?? -1,
				},
			});
	}

	// Upsert preferences
	await db
		.insert(preferences)
		.values({
			challengesDetailsId: user.puuid,
			bannerAccent: response.preferences.bannerAccent,
			title: response.preferences.title,
			challengeIds: response.preferences.challengeIds,
		})
		.onConflictDoUpdate({
			target: preferences.challengesDetailsId,
			set: {
				bannerAccent: response.preferences.bannerAccent,
				title: response.preferences.title,
				challengeIds: response.preferences.challengeIds,
			},
		});

	// Upsert individual challenges
	for (const ch of response.challenges) {
		await db
			.insert(challenge)
			.values({
				challengesDetailsId: user.puuid,
				challengeId: ch.challengeId,
				percentile: ch.percentile,
				level: ch.level,
				value: ch.value,
				achievedTime: ch.achievedTime ? new Date(ch.achievedTime) : null,
			})
			.onConflictDoUpdate({
				target: [challenge.challengesDetailsId, challenge.challengeId],
				set: {
					percentile: ch.percentile,
					level: ch.level,
					value: ch.value,
					achievedTime: ch.achievedTime ? new Date(ch.achievedTime) : null,
				},
			});
	}
};
