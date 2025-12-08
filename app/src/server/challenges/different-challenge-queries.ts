import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
	challengeHeroes,
	challenges,
	challengesAdaptToAllSituations,
	challengesChampionOcean,
	challengesChampionOcean2024Split3,
	challengesInvincible,
	challengesDetails
} from "@/db/schema";
import { regionToConstant } from "@/features/shared/champs";
import type { ChampionDetails, Summoner } from "@/features/shared/types";
import { getUserByNameAndRegion } from "@/server/api/get-user-by-name-and-region";
import {
	getArenaMatches,
	getMatches,
	getSRMatches,
} from "@/server/matches/get-matches";
import { fullUpdateSummoner } from "@/server/summoner/full-update-summoner.api";

async function clearChallenge(user: Summoner, challenge: string) {
	const tableMap = {
		challengeHeroes,
		challengesChampionOceans: challengesChampionOcean,
		challengesChampionOcean2024Split3s: challengesChampionOcean2024Split3,
		challengesAdaptToAllSituations,
		challengesInvincibles: challengesInvincible,
	};

	const table = tableMap[challenge as keyof typeof tableMap];
	if (table) await db.delete(table).where(eq(table.a, user.puuid));
}

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

export const updateJackOfAllChamps = createServerFn()
	.inputValidator((input: { username: string; region: string }) => input)
	.handler(async ({ data }) => {
		const { username: rawUsername, region: rawRegion } = data;
		const username = rawUsername.replace("-", "#").toLowerCase();
		const region = regionToConstant(rawRegion);
		const user = await getUserByNameAndRegion(username, region);

		if (!user) {
			return { success: false, message: "User not found" };
		}

		const matches = await getSRMatches(user);
		if (!matches) {
			return { success: false, message: "No matches found" };
		}

		const participations = matches.flatMap((match) => {
			const participants = (match.matchInfos?.[0]?.participants as any[]) || [];
			return participants.filter((p) => p.puuid === user.puuid && p.win);
		});

		const uniqueChampIds = [
			...new Set(participations.map((p) => p.championId)),
		];

		await clearChallenge(user, "challengeHeroes");

		// Ensure challenges record exists
		await db
			.insert(challenges)
			.values({ puuid: user.puuid })
			.onConflictDoNothing();

		if (uniqueChampIds.length > 0) {
			await db
				.insert(challengeHeroes)
				.values(uniqueChampIds.map((id) => ({ a: user.puuid, b: id })))
				.onConflictDoNothing();
		}

		console.log(
			`${user.gameName}#${user.tagLine} (${user.region}) updated JackOfAllChamps with ${uniqueChampIds.length} champions`,
		);

		return {
			success: true,
			message: `Updated JackOfAllChamps with ${uniqueChampIds.length} champions`,
		};
	});

export const updateChampionOcean = createServerFn()
	.inputValidator((input: { username: string; region: string }) => input)
	.handler(async ({ data }) => {
		const { username: rawUsername, region: rawRegion } = data;
		const username = rawUsername.replace("-", "#").toLowerCase();
		const region = regionToConstant(rawRegion);
		const user = await getUserByNameAndRegion(username, region);

		if (!user) {
			return { success: false, message: "User not found" };
		}

		const matches = await getArenaMatches(user);
		if (!matches) {
			return { success: false, message: "No matches found" };
		}

		const participations = matches.flatMap((match) => {
			const participants = (match.matchInfos?.[0]?.participants as any[]) || [];
			return participants.filter((p) => p.puuid === user.puuid && p.win);
		});

		const uniqueChampIds = [
			...new Set(participations.map((p) => p.championId)),
		];

		await clearChallenge(user, "challengesChampionOceans");

		// Ensure challenges record exists
		await db
			.insert(challenges)
			.values({ puuid: user.puuid })
			.onConflictDoNothing();

		if (uniqueChampIds.length > 0) {
			await db
				.insert(challengesChampionOcean)
				.values(uniqueChampIds.map((id) => ({ a: user.puuid, b: id })))
				.onConflictDoNothing();
		}

		console.log(
			`${user.gameName}#${user.tagLine} (${user.region}) updated ChampionOcean with ${uniqueChampIds.length} champions`,
		);

		return {
			success: true,
			message: `Updated ChampionOcean with ${uniqueChampIds.length} champions`,
		};
	});

export const updateChampionOcean2024Split3 = createServerFn()
	.inputValidator((input: { username: string; region: string }) => input)
	.handler(async ({ data }) => {
		const { username: rawUsername, region: rawRegion } = data;
		const username = rawUsername.replace("-", "#").toLowerCase();
		const region = regionToConstant(rawRegion);
		const user = await getUserByNameAndRegion(username, region);

		if (!user) {
			return { success: false, message: "User not found" };
		}

		const matches = await getMatches(user, {
			gameStartTimestampGte: new Date("2024-09-18T00:00:00.000Z"),
		});
		if (!matches) {
			return { success: false, message: "No matches found" };
		}

		const participations = matches.flatMap((match) => {
			const participants = (match.matchInfos?.[0]?.participants as any[]) || [];
			return participants.filter((p) => p.puuid === user.puuid && p.win);
		});

		const uniqueChampIds = [
			...new Set(participations.map((p) => p.championId)),
		];

		await clearChallenge(user, "challengesChampionOcean2024Split3s");

		// Ensure challenges record exists
		await db
			.insert(challenges)
			.values({ puuid: user.puuid })
			.onConflictDoNothing();

		if (uniqueChampIds.length > 0) {
			await db
				.insert(challengesChampionOcean2024Split3)
				.values(uniqueChampIds.map((id) => ({ a: user.puuid, b: id })))
				.onConflictDoNothing();
		}

		console.log(
			`${user.gameName}#${user.tagLine} (${user.region}) updated ChampionOcean2024Split3 with ${uniqueChampIds.length} champions`,
		);

		return {
			success: true,
			message: `Updated ChampionOcean2024Split3 with ${uniqueChampIds.length} champions`,
		};
	});

export const updateAdaptToAllSituations = createServerFn()
	.inputValidator((input: { username: string; region: string }) => input)
	.handler(async ({ data }) => {
		const { username: rawUsername, region: rawRegion } = data;
		const username = rawUsername.replace("-", "#").toLowerCase();
		const region = regionToConstant(rawRegion);
		const user = await getUserByNameAndRegion(username, region);

		if (!user) {
			return { success: false, message: "User not found" };
		}

		const matches = await getArenaMatches(user);
		if (!matches) {
			return { success: false, message: "No matches found" };
		}

		const participations = matches.flatMap((match) => {
			const participants = (match.matchInfos?.[0]?.participants as any[]) || [];
			return participants.filter(
				(p) => p.puuid === user.puuid && p.placement === 1,
			);
		});

		const uniqueChampIds = [
			...new Set(participations.map((p) => p.championId)),
		];

		await clearChallenge(user, "challengesAdaptToAllSituations");

		// Ensure challenges record exists
		await db
			.insert(challenges)
			.values({ puuid: user.puuid })
			.onConflictDoNothing();

		if (uniqueChampIds.length > 0) {
			await db
				.insert(challengesAdaptToAllSituations)
				.values(uniqueChampIds.map((id) => ({ a: user.puuid, b: id })))
				.onConflictDoNothing();
		}

		console.log(
			`${user.gameName}#${user.tagLine} (${user.region}) updated AdaptToAllSituations with ${uniqueChampIds.length} champions`,
		);

		return {
			success: true,
			message: `Updated AdaptToAllSituations with ${uniqueChampIds.length} champions`,
		};
	});

export const updateInvincible = createServerFn()
	.inputValidator((input: { username: string; region: string }) => input)
	.handler(async ({ data }) => {
		const { username: rawUsername, region: rawRegion } = data;
		const username = rawUsername.replace("-", "#").toLowerCase();
		const region = regionToConstant(rawRegion);
		const user = await getUserByNameAndRegion(username, region);

		if (!user) {
			return { success: false, message: "User not found" };
		}

		const matches = await getSRMatches(user);
		if (!matches) {
			return { success: false, message: "No matches found" };
		}

		const participations = matches.flatMap((match) => {
			const participants = (match.matchInfos?.[0]?.participants as any[]) || [];
			return participants.filter(
				(p) => p.puuid === user.puuid && p.deaths === 0 && p.win,
			);
		});

		const uniqueChampIds = [
			...new Set(participations.map((p) => p.championId)),
		];

		await clearChallenge(user, "challengesInvincibles");

		// Ensure challenges record exists
		await db
			.insert(challenges)
			.values({ puuid: user.puuid })
			.onConflictDoNothing();

		if (uniqueChampIds.length > 0) {
			await db
				.insert(challengesInvincible)
				.values(uniqueChampIds.map((id) => ({ a: user.puuid, b: id })))
				.onConflictDoNothing();
		}

		console.log(
			`${user.gameName}#${user.tagLine} (${user.region}) updated Invincible with ${uniqueChampIds.length} champions`,
		);

		return {
			success: true,
			message: `Updated Invincible with ${uniqueChampIds.length} champions`,
		};
	});

export const updateAllChallengeData = createServerFn()
	.inputValidator((input: { username: string; region: string }) => input)
	.handler(async ({ data }) => {
		console.log(
			`Updating all challenge data for user ${data.username} (${data.region.toUpperCase()})`,
		);

		// First, ensure we have the latest summoner and match data
		await fullUpdateSummoner({
			data: {
				gameName: data.username.split('#')[0],
				tagLine: data.username.split('#')[1] || '',
				region: data.region,
				includeMatches: true,
			},
		});

		// Call all update functions
		await updateJackOfAllChamps({ data });
		await updateChampionOcean({ data });
		await updateChampionOcean2024Split3({ data });
		await updateAdaptToAllSituations({ data });
		await updateInvincible({ data });

		return { success: true, message: "All challenge data updated" };
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
			const challengesMap = userChallengesDetails.challenges.reduce((map: Record<number, any>, challenge) => {
				map[challenge.challengeId as number] = {
					challengeId: challenge.challengeId,
					percentile: challenge.percentile,
					level: challenge.level,
					value: challenge.value,
					achievedTime: challenge.achievedTime,
				};
				return map;
			}, {} as Record<number, any>);

			return challengesMap;
		} catch (error) {
			console.error("Failed to fetch player challenges progress from database:", error);
			return null;
		}
	});
