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
} from "@/db/schema";
import { regionToConstant } from "@/features/shared/champs";
import type { Summoner } from "@/features/shared/types";
import { getUserByNameAndRegion } from "@/server/api/get-user-by-name-and-region";
import {
	getArenaMatches,
	getMatches,
	getSRMatches,
} from "@/server/matches/get-matches";

export const runAllChallengeUpdates = async (data: {
	username: string;
	region: string;
}) => {
	try {
		await updateJackOfAllChamps({ data });
		await updateChampionOcean({ data });
		await updateChampionOcean2024Split3({ data });
		await updateAdaptToAllSituations({ data });
		await updateInvincible({ data });

		return { success: true, message: "All challenge data updated" };
	} catch (err) {
		console.error("Error updating challenges:", err);
		return { success: false, message: "Failed to update challenges" };
	}
};

const clearChallenge = async (user: Summoner, challenge: string) => {
	const tableMap = {
		challengeHeroes,
		challengesChampionOceans: challengesChampionOcean,
		challengesChampionOcean2024Split3s: challengesChampionOcean2024Split3,
		challengesAdaptToAllSituations,
		challengesInvincibles: challengesInvincible,
	} as const;

	const table = tableMap[challenge as keyof typeof tableMap];
	if (table) await db.delete(table).where(eq(table.a, user.puuid));
};

const createChallengeUpdater = (
	tableName: string,
	getMatchesFn: (user: Summoner) => Promise<any[]>,
	filterFn?: (p: any) => boolean,
) =>
	createServerFn()
		.inputValidator((input: { username: string; region: string }) => input)
		.handler(async ({ data }) => {
			const username = data.username.replace("-", "#").toLowerCase();
			const region = regionToConstant(data.region);
			const user = await getUserByNameAndRegion(username, region);

			if (!user) return { success: false, message: "User not found" };

			const matches = await getMatchesFn(user);
			if (!matches) return { success: false, message: "No matches found" };

			const participations = matches.flatMap((match) => {
				const participants =
					(match.matchInfos?.[0]?.participants as any[]) || [];
				return participants.filter(
					(p) => !filterFn || (filterFn(p) && p.puuid === user.puuid),
				);
			});

			const uniqueChampIds = [
				...new Set(participations.map((p) => p.championId)),
			];

			await clearChallenge(user, tableName);

			await db
				.insert(challenges)
				.values({ puuid: user.puuid })
				.onConflictDoNothing();

			if (uniqueChampIds.length > 0) {
				const tableMapInsert = {
					challengeHeroes,
					challengesChampionOceans: challengesChampionOcean,
					challengesChampionOcean2024Split3s: challengesChampionOcean2024Split3,
					challengesAdaptToAllSituations,
					challengesInvincibles: challengesInvincible,
				} as const;
				await db
					.insert(tableMapInsert[tableName as keyof typeof tableMapInsert])
					.values(uniqueChampIds.map((id) => ({ a: user.puuid, b: id })))
					.onConflictDoNothing();
			}

			console.log(
				`${user.gameName}#${user.tagLine} (${user.region}) updated ${tableName} with ${uniqueChampIds.length} champions`,
			);
			return {
				success: true,
				message: `Updated ${tableName} with ${uniqueChampIds.length} champions`,
			};
		});

const updateJackOfAllChamps = createChallengeUpdater(
	"challengeHeroes",
	getSRMatches,
	(p) => p.win,
);
const updateChampionOcean = createChallengeUpdater(
	"challengesChampionOceans",
	getArenaMatches,
	(p) => p.win,
);
const updateChampionOcean2024Split3 = createChallengeUpdater(
	"challengesChampionOcean2024Split3s",
	(user) =>
		getMatches(user, {
			gameStartTimestampGte: new Date("2024-09-18T00:00:00.000Z"),
		}),
	(p) => p.win,
);
const updateAdaptToAllSituations = createChallengeUpdater(
	"challengesAdaptToAllSituations",
	getArenaMatches,
	(p) => p.placement === 1,
);
const updateInvincible = createChallengeUpdater(
	"challengesInvincibles",
	getSRMatches,
	(p) => p.win && p.deaths === 0,
);
