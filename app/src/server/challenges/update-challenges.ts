import { and, eq, type SQL } from "drizzle-orm";

import { db } from "~/db";
import {
	challengeHeroes,
	challenges,
	challengesAdaptToAllSituations,
	challengesChampionOcean,
	challengesChampionOcean2024Split3,
	challengesInvincible,
	matchParticipant,
} from "~/db/schema";
import { regionToConstant } from "~/features/shared/champs";
import { parseRiotId } from "~/features/shared/riot-id";
import type { Summoner } from "~/features/shared/types";
import { getUserByNameAndRegion } from "~/server/api/get-user-by-name-and-region";
import {
	ARENA_MATCH_FILTERS,
	type MatchFilterOptions,
	SR_MATCH_FILTERS,
} from "~/server/matches/get-matches";
import { getChampionIdsForUser } from "~/server/matches/match-participants";

export const runAllChallengeUpdatesWorker = async (data: { username: string; region: string }) => {
	try {
		await updateJackOfAllChampsWorker(data);
		await updateChampionOceanWorker(data);
		await updateChampionOcean2024Split3Worker(data);
		await updateAdaptToAllSituationsWorker(data);
		await updateInvincibleWorker(data);

		return { success: true, message: "All challenge data updated" };
	} catch (err) {
		console.error("Error updating challenges:", err);
		return { success: false, message: "Failed to update challenges" };
	}
};

/**
 * The five champion-list tables, keyed by the relation name Drizzle exposes. Both the insert
 * side and `clearChallenge` need this map; it used to be written out twice.
 */
const challengeTableMap = {
	challengeHeroes,
	challengesChampionOceans: challengesChampionOcean,
	challengesChampionOcean2024Split3s: challengesChampionOcean2024Split3,
	challengesAdaptToAllSituations,
	challengesInvincibles: challengesInvincible,
} as const;

// Worker-safe challenge updater factory.
// Participant predicates now run in SQL against the MatchParticipant projection,
// instead of loading every match (and its participant blob) into Node.
const createChallengeUpdaterWorker =
	(tableName: string, matchFilters: MatchFilterOptions, participantCondition?: SQL) =>
	async (data: { username: string; region: string }) => {
		const username = parseRiotId(data.username);
		const region = regionToConstant(data.region);
		const user = await getUserByNameAndRegion(username, region);

		if (!user) return { success: false, message: "User not found" };

		const uniqueChampIds = await getChampionIdsForUser(
			user.puuid,
			matchFilters,
			participantCondition,
		);

		await clearChallenge(user, tableName);

		await db.insert(challenges).values({ puuid: user.puuid }).onConflictDoNothing();

		if (uniqueChampIds.length > 0) {
			await db
				.insert(challengeTableMap[tableName as keyof typeof challengeTableMap])
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
	};

// Clear old challenge entries
const clearChallenge = async (user: Summoner, challenge: string) => {
	const table = challengeTableMap[challenge as keyof typeof challengeTableMap];
	if (table) await db.delete(table).where(eq(table.a, user.puuid));
};

// Worker-safe update functions
const updateJackOfAllChampsWorker = createChallengeUpdaterWorker(
	"challengeHeroes",
	SR_MATCH_FILTERS,
	eq(matchParticipant.win, true),
);
const updateChampionOceanWorker = createChallengeUpdaterWorker(
	"challengesChampionOceans",
	ARENA_MATCH_FILTERS,
	eq(matchParticipant.win, true),
);
const updateChampionOcean2024Split3Worker = createChallengeUpdaterWorker(
	"challengesChampionOcean2024Split3s",
	{ gameStartTimestampGte: new Date("2024-09-18T00:00:00.000Z") },
	eq(matchParticipant.win, true),
);
const updateAdaptToAllSituationsWorker = createChallengeUpdaterWorker(
	"challengesAdaptToAllSituations",
	ARENA_MATCH_FILTERS,
	eq(matchParticipant.placement, 1),
);
const updateInvincibleWorker = createChallengeUpdaterWorker(
	"challengesInvincibles",
	SR_MATCH_FILTERS,
	and(eq(matchParticipant.win, true), eq(matchParticipant.deaths, 0)),
);
