import { createServerFn } from "@tanstack/react-start";
import { regionToConstant } from "@/features/shared/champs";
import type { Summoner } from "@/features/shared/types";
import { getUserByNameAndRegion } from "@/server/api/get-user-by-name-and-region";
import { getMatches } from "@/server/matches/get-matches";

export const getMatchesFn = createServerFn({
	method: "GET",
})
	.inputValidator(
		(input: { username: string; region: string; take?: number }) => input,
	)
	.handler(async ({ data }): Promise<{ user: Summoner; matches: any[] }> => {
		const { username, region, take = 50 } = data;
		const regionConst = regionToConstant(region.toUpperCase());

		const user = await getUserByNameAndRegion(username, regionConst);
		const rawMatches = await getMatches(user, {}, take);

		// Transform to expected format
		const completeMatches = rawMatches.map((match) => ({
			gameId: match.gameId,
			MatchInfo: (match.matchInfos as any)?.[0],
			participants:
				(match.matchSummoners as any)?.map((ms: any) => ms.summoner) || [],
		}));

		return { user, matches: completeMatches };
	});
