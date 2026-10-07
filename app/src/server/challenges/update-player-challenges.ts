import { db } from "~/db";
import {
	categoryPoints,
	challenge,
	challengesDetails,
	preferences,
	totalPoints,
} from "~/db/schema";
import { lolApi } from "~/server/external/riot/lol-api";
import type {
	AccountDto,
	PlayerChallengeDTO,
	PlayerPreferencesDTO,
	Regions,
} from "~/server/external/riot/twisted";

export const upsertPlayerChallenges = async (region: Regions, user: AccountDto) => {
	const response = (await lolApi.Challenges.PlayerChallenges(user.puuid, region)).response;

	// Upsert challengesDetails
	await db
		.insert(challengesDetails)
		.values({
			puuid: user.puuid,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		.onConflictDoUpdate({
			target: challengesDetails.puuid,
			set: { updatedAt: new Date() },
		});

	// Upsert totalPoints
	await db
		.insert(totalPoints)
		.values({
			challengesDetailsId: user.puuid,
			current: response.totalPoints.current,
			level: response.totalPoints.level,
			max: response.totalPoints.max,
			percentile: response.totalPoints.percentile ?? null,
		})
		.onConflictDoUpdate({
			target: totalPoints.challengesDetailsId,
			set: {
				current: response.totalPoints.current,
				level: response.totalPoints.level,
				max: response.totalPoints.max,
				percentile: response.totalPoints.percentile ?? null,
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
	// The upstream preferences DTO predates `crestBorder` / `prestigeCrestBorderLevel`.
	const preferencesDto = response.preferences as PlayerPreferencesDTO & {
		crestBorder?: string;
		prestigeCrestBorderLevel?: number;
	};
	// Riot documents `challengeIds` as `List[string]` (Twisted types it as number[]),
	// so coerce to the integer[] column either way.
	const challengeIds = preferencesDto.challengeIds?.map(Number) ?? null;
	await db
		.insert(preferences)
		.values({
			challengesDetailsId: user.puuid,
			bannerAccent: preferencesDto.bannerAccent,
			title: preferencesDto.title,
			challengeIds,
			crestBorder: preferencesDto.crestBorder ?? null,
			prestigeCrestBorderLevel: preferencesDto.prestigeCrestBorderLevel ?? null,
		})
		.onConflictDoUpdate({
			target: preferences.challengesDetailsId,
			set: {
				bannerAccent: preferencesDto.bannerAccent,
				title: preferencesDto.title,
				challengeIds,
				crestBorder: preferencesDto.crestBorder ?? null,
				prestigeCrestBorderLevel: preferencesDto.prestigeCrestBorderLevel ?? null,
			},
		});

	// Upsert individual challenges
	// The upstream challenge DTO predates `playersInLevel` / `position`.
	for (const ch of response.challenges as (PlayerChallengeDTO & {
		playersInLevel?: number;
		position?: number;
	})[]) {
		await db
			.insert(challenge)
			.values({
				challengesDetailsId: user.puuid,
				challengeId: ch.challengeId,
				percentile: ch.percentile,
				level: ch.level,
				value: ch.value,
				achievedTime: ch.achievedTime ? new Date(ch.achievedTime) : null,
				playersInLevel: ch.playersInLevel ?? null,
				position: ch.position ?? null,
			})
			.onConflictDoUpdate({
				target: [challenge.challengesDetailsId, challenge.challengeId],
				set: {
					percentile: ch.percentile,
					level: ch.level,
					value: ch.value,
					achievedTime: ch.achievedTime ? new Date(ch.achievedTime) : null,
					playersInLevel: ch.playersInLevel ?? null,
					position: ch.position ?? null,
				},
			});
	}
};
