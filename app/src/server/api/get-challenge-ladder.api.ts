import { createServerFn } from "@tanstack/react-start";
import { and, count, desc, eq } from "drizzle-orm";

import { db } from "~/db";
import { challenge, challengesDetails, summoner } from "~/db/schema";
import type { LadderBoardRow } from "~/features/challenges/challenge-leaderboard";
import { regionToConstant } from "~/features/shared/champs";
import {
	LADDER_REGIONS,
	type LadderRegionId,
	type LadderRow,
	isLadderRegionId,
	readCachedLadder,
} from "~/server/challenges/riot-challenge-ladder";
import { updateQueue } from "~/server/jobs/queue";
import { stableGlobalJobOpts } from "~/server/jobs/queue-stable-job-opts";

export type ChallengeLadderResult =
	| {
			source: "riot";
			/** How many rows we hold for the selected board. */
			population: number;
			/** Rows we can show; the board is capped, `population` is not. */
			rows: LadderBoardRow[];
			/** True when Riot truncated a tier at its page size. */
			truncated: boolean;
			/** Shards with no apex ladder for this challenge. */
			emptyRegions: string[];
			fetchedAt: string;
	  }
	| { source: "tracked"; population: number; rows: LadderBoardRow[] };

/**
 * The board cap.
 *
 * Riot's own regional ladders are capped and this page has no paging affordance, so we show the
 * top stretch of the merged board. `population` always reports the real count.
 */
export const LADDER_BOARD_LIMIT = 100;

/** The region filter as a Riot platform id, or undefined for "every region". */
const boardRegion = (region?: string | null): LadderRegionId | null =>
	region && isLadderRegionId(region) ? region : null;

const toBoardRow = (row: LadderRow): LadderBoardRow => ({
	position: row.position,
	puuid: row.puuid,
	value: row.value,
	region: row.region,
	regionalPosition: row.regionalPosition,
	tier: row.tier,
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
		if (!snapshot) {
			// A deterministic job id means a stampede of page views collapses into one pending job
			// per challenge; the TTL of the snapshot it writes is what bounds how often it re-runs.
			await updateQueue
				.add(
					"ladder-sync",
					{ challengeId },
					stableGlobalJobOpts(`ladder-sync__${challengeId}`, { priority: 60 }),
				)
				.catch((error) =>
					console.error(
						`[Ladder] Could not queue a sync for challenge ${challengeId}:`,
						error,
					),
				);
			return null;
		}

		const board = selected ? (snapshot.byRegion[selected] ?? []) : snapshot.global;

		return {
			source: "riot",
			population: board.length,
			rows: board.slice(0, LADDER_BOARD_LIMIT).map(toBoardRow),
			truncated: snapshot.truncatedTiers.some(
				(entry) => selected === null || entry.region === selected,
			),
			emptyRegions: LADDER_REGIONS.map((r) => r.id).filter(
				(id) => !snapshot.regionsWithData.includes(id),
			),
			fetchedAt: snapshot.fetchedAt,
		};
	});

/**
 * Our own tracked population for a challenge, ranked by value.
 *
 * This is the honest-but-small board the tracker has always shown, kept as the fallback for when
 * Riot's ladder cannot be read. It is also the only board that can carry a name for a player
 * outside the apex tiers, so the region fallback keeps its region filter.
 */
export const getTrackedChallengeBoardFn = createServerFn({ method: "GET" })
	.validator((input: { challengeId: number; region?: string | null }) => input)
	.handler(async ({ data: { challengeId, region } }): Promise<ChallengeLadderResult> => {
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
			source: "tracked",
			population: populationRows[0]?.population ?? 0,
			rows: ranked.map((row, index) => ({
				position: index + 1,
				puuid: row.puuid,
				value: row.value ?? 0,
				region: row.region,
				regionalPosition: null,
				tier: "",
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
