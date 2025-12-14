import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { challenges, challengesDetails } from "@/db/schema";
import { regionToConstant } from "@/features/shared/champs";
import type { ChampionDetails } from "@/features/shared/types";
import { getUserByNameAndRegion } from "@/server/api/get-user-by-name-and-region";

export const getJackOfAllChamps = createServerFn()
	.inputValidator((input: { username: string; region: string }) => input)
	.handler(async ({ data }) => {
		const { username: rawUsername, region: rawRegion } = data;
		const username = rawUsername.replace("-", "#").toLowerCase();
		const region = regionToConstant(rawRegion);
		const user = await getUserByNameAndRegion(username, region);

		const result = await db.query.challenges.findFirst({
			where: eq(challenges.puuid, user.puuid),
			with: { challengeHeroes: { with: { championDetail: true } } },
		});

		return (
			(result?.challengeHeroes as any)?.map(
				(ch: any) => ch.championDetail as ChampionDetails,
			) ?? []
		);
	});

export const getChampionOcean = createServerFn()
	.inputValidator((input: { username: string; region: string }) => input)
	.handler(async ({ data }) => {
		const { username: rawUsername, region: rawRegion } = data;
		const username = rawUsername.replace("-", "#").toLowerCase();
		const region = regionToConstant(rawRegion);
		const user = await getUserByNameAndRegion(username, region);

		const result = await db.query.challenges.findFirst({
			where: eq(challenges.puuid, user.puuid),
			with: { challengesChampionOceans: { with: { championDetail: true } } },
		});

		return (
			(result?.challengesChampionOceans as any)?.map(
				(ch: any) => ch.championDetail as ChampionDetails,
			) ?? []
		);
	});

export const getChampionOcean2024Split3 = createServerFn()
	.inputValidator((input: { username: string; region: string }) => input)
	.handler(async ({ data }) => {
		const { username: rawUsername, region: rawRegion } = data;
		const username = rawUsername.replace("-", "#").toLowerCase();
		const region = regionToConstant(rawRegion);
		const user = await getUserByNameAndRegion(username, region);

		const result = await db.query.challenges.findFirst({
			where: eq(challenges.puuid, user.puuid),
			with: {
				challengesChampionOcean2024Split3s: { with: { championDetail: true } },
			},
		});

		return (
			(result?.challengesChampionOcean2024Split3s as any)?.map(
				(ch: any) => ch.championDetail as ChampionDetails,
			) ?? []
		);
	});

export const getAdaptToAllSituations = createServerFn()
	.inputValidator((input: { username: string; region: string }) => input)
	.handler(async ({ data }) => {
		const { username: rawUsername, region: rawRegion } = data;
		const username = rawUsername.replace("-", "#").toLowerCase();
		const region = regionToConstant(rawRegion);
		const user = await getUserByNameAndRegion(username, region);

		const result = await db.query.challenges.findFirst({
			where: eq(challenges.puuid, user.puuid),
			with: {
				challengesAdaptToAllSituations: { with: { championDetail: true } },
			},
		});

		return (
			(result?.challengesAdaptToAllSituations as any)?.map(
				(ch: any) => ch.championDetail as ChampionDetails,
			) ?? []
		);
	});

export const getInvincible = createServerFn()
	.inputValidator((input: { username: string; region: string }) => input)
	.handler(async ({ data }) => {
		const { username: rawUsername, region: rawRegion } = data;
		const username = rawUsername.replace("-", "#").toLowerCase();
		const region = regionToConstant(rawRegion);
		const user = await getUserByNameAndRegion(username, region);

		const result = await db.query.challenges.findFirst({
			where: eq(challenges.puuid, user.puuid),
			with: { challengesInvincibles: { with: { championDetail: true } } },
		});

		return (
			(result?.challengesInvincibles as any)?.map(
				(ch: any) => ch.championDetail as ChampionDetails,
			) ?? []
		);
	});

export const getPlayerChallengesProgress = createServerFn()
	.inputValidator((input: { username: string; region: string }) => input)
	.handler(async ({ data }) => {
		const { username: rawUsername, region: rawRegion } = data;
		const username = rawUsername.replace("-", "#").toLowerCase();
		const region = regionToConstant(rawRegion);
		const user = await getUserByNameAndRegion(username, region);

		if (!user) {
			console.error("User not found for challenges progress");
			return null;
		}

		try {
			// Get the challenge progress from our database instead of Riot API
			const userChallengesDetails = await db.query.challengesDetails.findFirst({
				where: eq(challengesDetails.puuid, user.puuid),
				with: { challenges: true },
			});

			if (!userChallengesDetails) {
				console.error(`Could not find challenge data for user ${user.puuid}`);
				return null;
			}

			// Return challenges as a Record<number, any> where key is challengeId
			const challengesMap = userChallengesDetails.challenges.reduce(
				(map: Record<number, any>, challenge) => {
					map[challenge.challengeId as number] = {
						challengeId: challenge.challengeId,
						percentile: challenge.percentile,
						level: challenge.level,
						value: challenge.value,
						achievedTime: challenge.achievedTime,
					};
					return map;
				},
				{} as Record<number, any>,
			);

			return challengesMap;
		} catch (error) {
			console.error(
				"Failed to fetch player challenges progress from database:",
				error,
			);
			return null;
		}
	});
