import { createServerFn } from "@tanstack/react-start";

import { regionToConstant } from "~/features/shared/champs";
import { sortQueueIds } from "~/features/shared/queues";
import { parseRiotId } from "~/features/shared/riot-id";
import type { Summoner } from "~/features/shared/types";
import { getUserByNameAndRegion } from "~/server/api/get-user-by-name-and-region";
import { getMatches, type MatchFilterOptions } from "~/server/matches/get-matches";
import {
	getRecentForm,
	getUserChampions,
	getUserQueueIds,
	type FormEntry,
	type UserChampionOption,
} from "~/server/matches/match-participants";

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

/**
 * A resolved match page, or the reason it could not be resolved.
 *
 * A result rather than a throw, so the route can answer a missing profile with a 404 and a
 * rate-limited one with a bounce instead of collapsing both into a 500.
 */
export type MatchesPayload =
	| {
			ok: true;
			user: Summoner;
			matches: any[];
			/**
			 * The queues and champions this user actually has matches in, for the filter UI. Only
			 * computed when asked for: together they measure ~17ms against the live database
			 * (14.8ms for the queue list, 2.6ms for the champions), which a "load more" click
			 * should not pay for.
			 */
			availableQueueIds?: number[];
			availableChampions?: UserChampionOption[];
	  }
	| { ok: false; error: "not_found" | "rate_limit" };

export const getMatchesFn = createServerFn({
	method: "GET",
})
	.validator(
		(
			input: {
				username: string;
				region: string;
				take?: number;
				/** Ask for the filter option lists as well as the matches. */
				withFilterOptions?: boolean;
			} & MatchFilterInput,
		) => input,
	)
	.handler(async ({ data }): Promise<MatchesPayload> => {
		const { username, region, take = 50, withFilterOptions = false, ...filters } = data;
		const regionConst = regionToConstant(region.toUpperCase());

		const resolved = await getUserByNameAndRegion(parseRiotId(username), regionConst);
		if (!resolved.ok) return { ok: false, error: resolved.error };

		const user = resolved.user;
		const [rawMatches, filterOptions] = await Promise.all([
			getMatches(user, toFilterOptions(filters), take),
			withFilterOptions
				? Promise.all([getUserQueueIds(user.puuid), getUserChampions(user.puuid)])
				: Promise.resolve(null),
		]);

		// Transform to expected format
		const completeMatches = rawMatches.map((match) => ({
			gameId: match.gameId,
			MatchInfo: (match.matchInfos as any)?.[0],
			playerCount: match.playerCount,
		}));

		return {
			ok: true,
			user,
			matches: completeMatches,
			availableQueueIds: filterOptions ? sortQueueIds(filterOptions[0]) : undefined,
			availableChampions: filterOptions ? filterOptions[1] : undefined,
		};
	});

/** Recent games, oldest first, for the profile form chart. */
export const getRecentFormFn = createServerFn({ method: "GET" })
	.validator((input: { puuid: string; take?: number; queueId?: number }) => input)
	.handler(({ data }): Promise<FormEntry[]> =>
		getRecentForm(data.puuid, data.take, data.queueId),
	);

/** The queues this user has matches in, for the form panel's dropdown. */
export const getUserQueuesFn = createServerFn({ method: "GET" })
	.validator((input: { puuid: string }) => input)
	.handler(async ({ data }): Promise<number[]> =>
		sortQueueIds(await getUserQueueIds(data.puuid)),
	);
