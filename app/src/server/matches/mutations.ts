import { createServerFn } from "@tanstack/react-start";

import { regionToConstant } from "~/features/shared/champs";
import { sortQueueIds } from "~/features/shared/queues";
import { parseRiotId } from "~/features/shared/riot-id";
import type { Summoner } from "~/features/shared/types";
import { getUserByNameAndRegion } from "~/server/api/get-user-by-name-and-region";
import { getMatches, type MatchFilterOptions } from "~/server/matches/get-matches";
import { getUserQueueIds } from "~/server/matches/match-participants";

/**
 * Filters as they cross into a server function.
 *
 * Timestamps are ISO strings rather than `Date`s so a URL search param can be passed straight
 * through; they become `Date`s right next to the query.
 */
export type MatchFilterInput = {
	queueIds?: number[];
	championId?: number;
	win?: boolean;
	gameStartTimestampGte?: string;
	gameStartTimestampLt?: string;
	gameIdLt?: string;
};

const toFilterOptions = (input: MatchFilterInput): MatchFilterOptions => ({
	queueIds: input.queueIds,
	championId: input.championId,
	win: input.win,
	gameStartTimestampGte: input.gameStartTimestampGte
		? new Date(input.gameStartTimestampGte)
		: undefined,
	gameStartTimestampLt: input.gameStartTimestampLt
		? new Date(input.gameStartTimestampLt)
		: undefined,
	gameIdLt: input.gameIdLt,
});

export const getMatchesFn = createServerFn({
	method: "GET",
})
	.validator(
		(input: { username: string; region: string; take?: number } & MatchFilterInput) => input,
	)
	.handler(
		async ({
			data,
		}): Promise<{
			user: Summoner;
			matches: any[];
			/** The queues this user actually has matches in, for the filter UI. */
			availableQueueIds: number[];
		}> => {
			const { username, region, take = 50, ...filters } = data;
			const regionConst = regionToConstant(region.toUpperCase());

			const resolved = await getUserByNameAndRegion(parseRiotId(username), regionConst);
			if (!resolved.ok) throw new Error(`Summoner not found: ${username}`);

			const user = resolved.user;
			const [rawMatches, queueIds] = await Promise.all([
				getMatches(user, toFilterOptions(filters), take),
				getUserQueueIds(user.puuid),
			]);

			// Transform to expected format
			const completeMatches = rawMatches.map((match) => ({
				gameId: match.gameId,
				MatchInfo: (match.matchInfos as any)?.[0],
				playerCount: match.playerCount,
			}));

			return { user, matches: completeMatches, availableQueueIds: sortQueueIds(queueIds) };
		},
	);
