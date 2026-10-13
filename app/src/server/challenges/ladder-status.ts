import { connection } from "~/server/jobs/redis";

/**
 * What a cold board should poll while it waits: is the snapshot there yet, and is it named?
 *
 * Its own module, and **not** `api/get-challenge-ladder.api.ts`, because that module is imported by
 * a route and a component and so is served to the browser. TanStack's client transform strips the
 * server-fn handler bodies and the imports only they use, but it keeps every other export intact -
 * and a plain `readLadderStatus` left there kept its `connection` import too, so `ioredis` landed in
 * the client bundle and threw at module-evaluation time (`process.version is undefined`). That
 * killed hydration for the whole page: the ladder rows arrived server-rendered but stayed at their
 * `initial` opacity of 0, so a 1,283-row board rendered as an empty box with the population count
 * above it. Node-only helpers therefore live here, and the api module reaches them with a dynamic
 * import inside the handler - the same boundary `api/get-challenge-leaderboard.api.ts` uses.
 *
 * A plain function rather than only a `createServerFn`, so the status reader can be exercised
 * directly - a `createServerFn` needs a Start context and cannot be called from a script, which
 * would leave this logic verifiable only through a browser.
 *
 * Deliberately not the board. One Redis read and no Riot calls, so polling it costs nothing in
 * rate-limit budget, which is the only reason polling is acceptable here at all.
 *
 * Two conditions rather than one, because the sync publishes rows and names in separate passes:
 * rows land at ~46 s and Account-v1 names another ~40 s later. Stopping at "rows exist" would swap
 * thousands of raw puuids in front of the reader, which is the same problem one step later.
 */
export type LadderStatus = {
	/** True once a snapshot exists, which is when the board has rows to render. */
	ready: boolean;
	rows: number;
	/** Rows already carrying a Riot ID. Zero means the naming pass has not run yet. */
	named: number;
	fetchedAt: string | null;
};

const namedRowCount = (rows: { gameName: string | null; tagLine: string | null }[]): number =>
	rows.filter((row) => row.gameName !== null && row.tagLine !== null).length;

/** See {@link LadderStatus}. Reads Redis only. */
export const readLadderStatus = async (challengeId: number): Promise<LadderStatus> => {
	const cached = await connection.get(`challenge-ladder:v1:${challengeId}`).catch(() => null);
	if (!cached) return { ready: false, rows: 0, named: 0, fetchedAt: null };

	try {
		const snapshot = JSON.parse(cached) as {
			fetchedAt: string;
			global: { gameName: string | null; tagLine: string | null }[];
		};
		return {
			ready: true,
			rows: snapshot.global.length,
			named: namedRowCount(snapshot.global),
			fetchedAt: snapshot.fetchedAt,
		};
	} catch {
		// A corrupt value is not "ready": let the poll keep waiting rather than swap in a broken
		// board, and let the next sync overwrite it.
		return { ready: false, rows: 0, named: 0, fetchedAt: null };
	}
};
