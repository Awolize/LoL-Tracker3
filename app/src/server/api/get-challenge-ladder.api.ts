import { createServerFn } from "@tanstack/react-start";

import type { LadderBoardRow } from "~/features/challenges/challenge-leaderboard";
import type { LadderStatus } from "~/server/challenges/ladder-status";
import { recordLadderRead } from "~/server/challenges/ladder-sweep";
import {
	LADDER_REGIONS,
	type LadderRegionId,
	type LadderRow,
	isLadderRegionId,
	isLadderStale,
	readCachedLadder,
} from "~/server/challenges/riot-challenge-ladder";
import { updateQueue } from "~/server/jobs/queue";
import { stableGlobalJobOpts } from "~/server/jobs/queue-stable-job-opts";

export type { LadderStatus };

/**
 * What the page renders.
 *
 * `preparing` is the never-visited case: Riot will answer, we just have nothing stored yet and a
 * sync is queued. It is deliberately distinct from a board with rows, because the honest thing to
 * show a first visitor is that the board is being built - not our 59-row tracked population dressed
 * up as a ranking, which is the trap this page was rebuilt to avoid.
 */
export type ChallengeLadderResult =
	| {
			state: "preparing";
			/** Riot shards that will be read, for a "preparing N regions" line. */
			regions: number;
	  }
	| ChallengeLadderBoard;

export type ChallengeLadderBoard = {
	state: "ready";
	/** How many rows the selected board holds in total, never just this page's count. */
	population: number;
	/** The rows of {@link page}, nothing else - the board appends these on the client. */
	rows: LadderBoardRow[];
	/** 1-based page of {@link LADDER_PAGE_SIZE}. */
	page: number;
	/** Rows per page, i.e. what one "load more" fetches. */
	pageSize: number;
	/** True while rows beyond this page exist. */
	hasMore: boolean;
	/** True when Riot truncated a tier at its page size - the board ends where Riot stops. */
	truncated: boolean;
	fetchedAt: string;
};

/** Rows one "load more" fetches. One page of the merged board is what the page showed before paging. */
export const LADDER_PAGE_SIZE = 100;

/**
 * The largest page a request may ask for.
 *
 * The snapshot is read whole either way, so this bounds the response, not the work. The page size
 * is no longer a URL param, but the server fn is still callable with any number, so this keeps one
 * call from asking for the entire merged board in a single response.
 */
export const LADDER_MAX_PAGE_SIZE = 1000;

/**
 * Clamp a requested page into existence.
 *
 * A nonsense page is corrected rather than rejected: page 0 and page 99 of a 3-page board both have
 * a sensible answer, and neither should 404 a public page.
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
		}): Promise<ChallengeLadderResult> => {
			const selected = boardRegion(region);
			const snapshot = await readCachedLadder(challengeId);

			// Note the read so the scheduled sweep can keep the boards people actually open fresh
			// first. Awaiting is fine: one Redis increment, and its own failures are swallowed.
			await recordLadderRead(challengeId);

			// Stale-while-revalidate: keep serving a stored snapshot and refresh it behind the reader.
			// A deterministic job id means a stampede of page views collapses into one pending job per
			// challenge, and because the job only replaces the key once it finishes, a sync in flight
			// never empties the board.
			if (snapshot && isLadderStale(snapshot)) {
				await queueLadderRefresh(challengeId, "refresh");
			}

			// Nothing stored: a board nobody has opened before. Queue the sync and say so, rather
			// than degrading to the tracked population - which would show a first-time visitor a
			// 59-row board that looks like a ranking.
			if (!snapshot) {
				await queueLadderRefresh(challengeId, "sync");
				return { state: "preparing", regions: LADDER_REGIONS.length };
			}

			const board = selected ? (snapshot.byRegion[selected] ?? []) : snapshot.global;
			const { currentPage: requestedPage, size } = resolvePaging(page, pageSize);
			// Clamp into range rather than returning an empty board: a hand-edited page number is a
			// reader looking for the end of the list, and an empty page reads as "no players".
			const lastPage = Math.max(1, Math.ceil(board.length / size));
			const currentPage = Math.min(requestedPage, lastPage);
			const start = (currentPage - 1) * size;

			return {
				state: "ready",
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
 * Poll target for a board with no snapshot yet.
 *
 * The reader is imported here, inside the handler, rather than at the top of the module: this file
 * is served to the browser (a route imports its constants and its two server-fn bindings), and the
 * transform only strips what the handler bodies use. A top-level import of the Redis-backed reader
 * survived that strip and put `ioredis` in the client bundle, which threw while the client graph
 * evaluated and left every ladder row at its `initial` opacity of 0 - an empty-looking board. Same
 * boundary as `api/get-challenge-leaderboard.api.ts`; see `challenges/ladder-status.ts`.
 */
export const getChallengeLadderStatusFn = createServerFn({ method: "GET" })
	.validator((input: { challengeId: number }) => input)
	.handler(async ({ data: { challengeId } }): Promise<LadderStatus> => {
		const { readLadderStatus } = await import("~/server/challenges/ladder-status");
		return readLadderStatus(challengeId);
	});
