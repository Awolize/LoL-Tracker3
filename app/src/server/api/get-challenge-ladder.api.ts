import { createServerFn } from "@tanstack/react-start";
import { and, count, desc, eq } from "drizzle-orm";

import { db } from "~/db";
import { challenge, challengesDetails, summoner } from "~/db/schema";
import type { LadderBoardRow } from "~/features/challenges/challenge-leaderboard";
import { regionToConstant } from "~/features/shared/champs";
import { recordLadderView } from "~/server/challenges/ladder-sweep";
import {
	type LadderRegionId,
	type LadderRow,
	isLadderRegionId,
	isLadderStale,
	readCachedLadder,
} from "~/server/challenges/riot-challenge-ladder";
import { updateQueue } from "~/server/jobs/queue";
import { stableGlobalJobOpts } from "~/server/jobs/queue-stable-job-opts";

/** What the page renders: one page of a board, plus how honest its population number is. */
export type ChallengeLadderResult = {
	/** How many rows the selected board holds in total, never just this page's count. */
	population: number;
	/** The rows for {@link ChallengeLadderResult.page}, already sliced. */
	rows: LadderBoardRow[];
	/** 1-based page of {@link LADDER_PAGE_SIZE}. */
	page: number;
	/** Rows per page. */
	pageSize: number;
	/** True while rows beyond this page exist. */
	hasMore: boolean;
	/** True when Riot truncated a tier at its page size - the board ends where Riot stops. */
	truncated: boolean;
	fetchedAt: string;
};

/**
 * The tracked board: no Riot tiers involved, so nothing to truncate and nothing fetched.
 *
 * Not paged. It is only ever the fallback, and there is no ladder to page through in that state.
 */
export type TrackedChallengeBoard = Pick<ChallengeLadderResult, "population" | "rows">;

/** Rows per page. One page of the merged board is what the page showed before paging existed. */
export const LADDER_PAGE_SIZE = 200;

/**
 * The largest page a request may ask for.
 *
 * The snapshot is read whole either way, so this bounds the response, not the work. It keeps a
 * hand-edited `?limit=` from asking for the entire merged board in one render.
 */
export const LADDER_MAX_PAGE_SIZE = 1000;

/**
 * Clamp a requested page into existence.
 *
 * A hand-edited URL is the only way to get a nonsense page, so it is corrected rather than
 * rejected: page 0 and page 99 of a 3-page board both have a sensible answer, and neither should
 * 404 a public page.
 */
const resolvePaging = (
	page?: number | null,
	pageSize?: number | null,
): { currentPage: number; size: number } => {
	const size = Math.min(
		LADDER_MAX_PAGE_SIZE,
		Math.max(1, Math.trunc(pageSize ?? LADDER_PAGE_SIZE) || LADDER_PAGE_SIZE),
	);
	const currentPage = Math.max(1, Math.trunc(page ?? 1) || 1);
	return { currentPage, size };
};

/**
 * Ask the worker for a ladder snapshot.
 *
 * A deterministic job id collapses a stampede of page views into one pending job per challenge, so
 * a busy board cannot queue a sync per reader. Failures are logged and swallowed: the caller is a
 * page render, and a queue outage should degrade to the data we already have, not a 500.
 */
const queueLadderRefresh = async (
	challengeId: number,
	reason: "sync" | "refresh",
): Promise<void> => {
	await updateQueue
		.add(
			"ladder-sync",
			{ challengeId },
			stableGlobalJobOpts(`ladder-sync__${challengeId}`, { priority: 60 }),
		)
		.catch((error) =>
			console.error(
				`[Ladder] Could not queue a ${reason} for challenge ${challengeId}:`,
				error,
			),
		);
};

/** The region filter as a Riot platform id, or undefined for "every region". */
const boardRegion = (region?: string | null): LadderRegionId | null =>
	region && isLadderRegionId(region) ? region : null;

const toBoardRow = (row: LadderRow): LadderBoardRow => ({
	puuid: row.puuid,
	value: row.value,
	region: row.region,
	riotId:
		row.gameName !== null && row.tagLine !== null
			? { gameName: row.gameName, tagLine: row.tagLine }
			: null,
	summoner: row.tracked
		? {
				puuid: row.puuid,
				gameName: row.gameName,
				tagLine: row.tagLine,
				region: row.region,
				profileIconId: row.profileIconId ?? 0,
			}
		: null,
});

/**
 * Riot's official apex ladder for one shard, or - when `region` is null - every configured shard
 * merged by us and re-ranked.
 *
 * Reads the cached snapshot only; a miss returns null (the route then shows the tracked board) and
 * asks the queue for a refresh. This is the whole cost control: no page view ever reaches Riot, so
 * load on the key is proportional to how many distinct challenges are looked at, not to traffic.
 *
 * A single shard having no ladder for the challenge (VN2 has none for CRYSTAL) is a fact about the
 * data, not an error, so it is reported rather than thrown.
 */
export const getChallengeLadderFn = createServerFn({ method: "GET" })
	.validator(
		(input: {
			challengeId: number;
			region?: string | null;
			page?: number | null;
			pageSize?: number | null;
		}) => input,
	)
	.handler(
		async ({
			data: { challengeId, region, page, pageSize },
		}): Promise<ChallengeLadderResult | null> => {
			const selected = boardRegion(region);
			const snapshot = await readCachedLadder(challengeId);

			// Note the read so the scheduled sweep can keep the boards people actually open fresh
			// first. Awaiting is fine: one Redis increment, and its own failures are swallowed.
			await recordLadderView(challengeId);

			// Stale-while-revalidate: keep serving a stored snapshot and refresh it behind the reader.
			// A deterministic job id means a stampede of page views collapses into one pending job per
			// challenge, and because the job only replaces the key once it finishes, a sync in flight
			// never empties the board.
			if (snapshot && isLadderStale(snapshot)) {
				await queueLadderRefresh(challengeId, "refresh");
			}

			// Only a genuinely empty cache is a miss. `null` here is what makes the route show the
			// tracked fallback, which should mean "we have never read this ladder", not "the freshness
			// window rolled over".
			if (!snapshot) {
				await queueLadderRefresh(challengeId, "sync");
				return null;
			}

			const board = selected ? (snapshot.byRegion[selected] ?? []) : snapshot.global;
			const { currentPage: requestedPage, size } = resolvePaging(page, pageSize);
			// Clamp into range rather than returning an empty board: a hand-edited page number is a
			// reader looking for the end of the list, and an empty page reads as "no players".
			const lastPage = Math.max(1, Math.ceil(board.length / size));
			const currentPage = Math.min(requestedPage, lastPage);
			const start = (currentPage - 1) * size;

			return {
				population: board.length,
				rows: board.slice(start, start + size).map(toBoardRow),
				page: currentPage,
				pageSize: size,
				hasMore: start + size < board.length,
				truncated: snapshot.truncatedTiers.some(
					(entry) => selected === null || entry.region === selected,
				),
				fetchedAt: snapshot.fetchedAt,
			};
		},
	);

/**
 * Our own tracked population for a challenge, ranked by value.
 *
 * This is the honest-but-small board the tracker has always shown, and it is only ever the
 * loader's fallback when Riot's ladder cannot be read - never a mode the page offers. It is also
 * the only board that can carry a name for a player outside the apex tiers, so it keeps the
 * region filter.
 */
export const getTrackedChallengeBoardFn = createServerFn({ method: "GET" })
	.validator((input: { challengeId: number; region?: string | null }) => input)
	.handler(async ({ data: { challengeId, region } }): Promise<TrackedChallengeBoard> => {
		const selected = boardRegion(region);
		const where = selected
			? and(
					eq(challenge.challengeId, challengeId),
					eq(summoner.region, regionToConstant(selected)),
				)
			: eq(challenge.challengeId, challengeId);

		const rankQuery = db
			.select({
				value: challenge.value,
				puuid: summoner.puuid,
				gameName: summoner.gameName,
				tagLine: summoner.tagLine,
				region: summoner.region,
				profileIconId: summoner.profileIconId,
			})
			.from(challenge)
			.innerJoin(
				challengesDetails,
				eq(challenge.challengesDetailsId, challengesDetails.puuid),
			)
			.innerJoin(summoner, eq(challengesDetails.puuid, summoner.puuid))
			.where(where)
			.orderBy(desc(challenge.value))
			.limit(LADDER_PAGE_SIZE);

		const populationQuery = db
			.select({ population: count() })
			.from(challenge)
			.innerJoin(
				challengesDetails,
				eq(challenge.challengesDetailsId, challengesDetails.puuid),
			)
			.innerJoin(summoner, eq(challengesDetails.puuid, summoner.puuid))
			.where(where);

		const [ranked, populationRows] = await Promise.all([rankQuery, populationQuery]);

		return {
			population: populationRows[0]?.population ?? 0,
			rows: ranked.map((row) => ({
				puuid: row.puuid,
				value: row.value ?? 0,
				region: row.region,
				riotId:
					row.gameName !== null && row.tagLine !== null
						? { gameName: row.gameName, tagLine: row.tagLine }
						: null,
				summoner: {
					puuid: row.puuid,
					gameName: row.gameName,
					tagLine: row.tagLine,
					region: row.region,
					profileIconId: row.profileIconId,
				},
			})),
		};
	});
