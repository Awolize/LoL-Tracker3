import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

import { db } from "~/db";
import { challenges } from "~/db/schema";
import { regionToConstant } from "~/features/shared/champs";
import { parseRiotId } from "~/features/shared/riot-id";
import type { ChampionDetails } from "~/features/shared/types";
import { getUserByNameAndRegion } from "~/server/api/get-user-by-name-and-region";
import { getChallengesProgressMapForPuuid } from "~/server/challenges/challenges-progress-map";

type ChallengeReaderInput = { username: string; region: string };

/**
 * Reads one of the champion-list relations hanging off `Challenges` for a summoner.
 *
 * The five challenges below were the same body five times; only the relation name differed.
 * They stay separate `createServerFn` declarations rather than a factory, because TanStack's
 * compiler discovers server functions from the exported declaration itself - building them
 * from a factory leaves the five client bindings out of the bundle. Only the body is shared,
 * which is where the duplication actually was.
 */
const readChallengeRelation = async (
	data: ChallengeReaderInput,
	relation: string,
): Promise<ChampionDetails[]> => {
	const username = parseRiotId(data.username);
	const region = regionToConstant(data.region);
	const resolved = await getUserByNameAndRegion(username, region);
	if (!resolved.ok) return [];

	// Drizzle cannot type a computed relation key, so the `with` clause is the one place the
	// dynamic access needs an assertion; the result is typed by the shape we ask for.
	const withRelations = { [relation]: { with: { championDetail: true } } } as any;
	const result = (await db.query.challenges.findFirst({
		where: eq(challenges.puuid, resolved.user.puuid),
		with: withRelations,
	})) as Record<string, { championDetail: ChampionDetails }[]> | undefined;

	return result?.[relation]?.map((ch) => ch.championDetail) ?? [];
};

export const getJackOfAllChamps = createServerFn()
	.validator((input: ChallengeReaderInput) => input)
	.handler(({ data }) => readChallengeRelation(data, "challengeHeroes"));

export const getChampionOcean = createServerFn()
	.validator((input: ChallengeReaderInput) => input)
	.handler(({ data }) => readChallengeRelation(data, "challengesChampionOceans"));

export const getChampionOcean2024Split3 = createServerFn()
	.validator((input: ChallengeReaderInput) => input)
	.handler(({ data }) => readChallengeRelation(data, "challengesChampionOcean2024Split3s"));

export const getAdaptToAllSituations = createServerFn()
	.validator((input: ChallengeReaderInput) => input)
	.handler(({ data }) => readChallengeRelation(data, "challengesAdaptToAllSituations"));

export const getInvincible = createServerFn()
	.validator((input: ChallengeReaderInput) => input)
	.handler(({ data }) => readChallengeRelation(data, "challengesInvincibles"));

export const getPlayerChallengesProgress = createServerFn()
	.validator((input: ChallengeReaderInput) => input)
	.handler(async ({ data }) => {
		const username = parseRiotId(data.username);
		const region = regionToConstant(data.region);
		const resolved = await getUserByNameAndRegion(username, region);
		if (!resolved.ok) return null;

		try {
			return await getChallengesProgressMapForPuuid(resolved.user.puuid);
		} catch (error) {
			console.error("Failed to fetch player challenges progress from database:", error);
			return null;
		}
	});
