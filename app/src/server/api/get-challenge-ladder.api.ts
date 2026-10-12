import { createServerFn } from "@tanstack/react-start";
import { and, count, desc, eq } from "drizzle-orm";

import { db } from "~/db";
import { challenge, challengesDetails, summoner } from "~/db/schema";
import type { LadderBoardRow } from "~/features/challenges/challenge-leaderboard";
import { regionToConstant } from "~/features/shared/champs";
import {
	type LadderRegionId,
	type LadderRow,
	isLadderRegionId,
	isLadderStale,
	readCachedLadder,
} from "~/server/challenges/riot-challenge-ladder";
import { updateQueue } from "~/server/jobs/queue";
import { stableGlobalJobOpts } from "~/server/jobs/queue-stable-job-opts";

/** What the page renders: one board, plus how honest its population number is. */
export type ChallengeLadderResult = {
	/** How many rows we hold for the selected board. */
	population: number;
	/** Rows we can show; the board is capped, `population` is not. */
	rows: LadderBoardRow[];
	/** True when Riot truncated a tier at its page size. */
	truncated: boolean;
	fetchedAt: string;
};

/** The tracked board: no Riot tiers involved, so nothing to truncate and nothing fetched. */
export type TrackedChallengeBoard = Pick<ChallengeLadderResult, "population" | "rows">;

/**
 * The board cap.
 *
 * Riot's own regional ladders are capped and this page has no paging affordance, so we show the
 * top stretch of the merged board. `population` always reports the real count.
 */
export const LADDER_BOARD_LIMIT = 200;

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
	.validator((input: { challengeId: number; region?: string | null }) => input)
	.handler(async ({ data: { challengeId, region } }): Promise<ChallengeLadderResult | null> => {
		const selected = boardRegion(region);
		const snapshot = await readCachedLadder(challengeId);

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

		return {
			population: board.length,
			rows: board.slice(0, LADDER_BOARD_LIMIT).map(toBoardRow),
			truncated: snapshot.truncatedTiers.some(
				(entry) => selected === null || entry.region === selected,
			),
			fetchedAt: snapshot.fetchedAt,
		};
	});

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
			.limit(LADDER_BOARD_LIMIT);

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
