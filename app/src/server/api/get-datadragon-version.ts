import { desc } from "drizzle-orm";

import { db } from "~/db";
import { championDetails } from "~/db/schema";
import { lolApi } from "~/server/external/riot/lol-api";

/** How long the resolved version is reused — it only changes when a patch ships. */
const CACHE_MS = 15 * 60 * 1000;

/**
 * Kept on `globalThis` so dev HMR does not drop the cache on every reload, matching the
 * S3 client in `~/server/external/s3`.
 */
const globalForVersion = globalThis as unknown as {
	dataDragonVersion?: { at: number; version: string };
};

/**
 * The newest Data Dragon version present in `ChampionDetails`, read with an explicit order.
 *
 * The table holds a row per champion and more than one version can be present at a time (at
 * the time of writing 16.20.1 and 16.15.1), so an unordered `findFirst` would sometimes
 * return the older one. This is the fallback for `getDataDragonVersion` when Data Dragon
 * itself cannot be reached; the sort is a top-N heapsort over 233 rows (~0.2ms).
 */
const getStoredDataDragonVersion = async (): Promise<string> => {
	const result = await db.query.championDetails.findFirst({
		columns: { version: true },
		orderBy: desc(championDetails.version),
	});

	return result?.version ?? "15.24.1";
};

/**
 * The Data Dragon version the app should build asset URLs against, cached for 15 minutes.
 *
 * Data Dragon is asked live so a version bump is picked up the moment a patch ships, rather
 * than waiting for the next `updateChampionDetails()` sync. The stored version is the
 * fallback for when Data Dragon cannot be reached, so callers always get a usable value.
 *
 * A plain function, not a server function, so server-side callers (the lane patch window)
 * can read it without a Start request context. `getDataDragonVersion` in `./mutations` is
 * the server-function wrapper the client uses; both resolve through here.
 */
export const getDataDragonVersion = async (): Promise<string> => {
	const cached = globalForVersion.dataDragonVersion;
	if (cached && Date.now() - cached.at < CACHE_MS) return cached.version;

	let version: string | undefined;
	try {
		[version] = await lolApi.DataDragon.getVersions();
	} catch {
		// Offline or Data Dragon down: fall back to the version the last sync stored.
	}

	const resolved = version ?? (await getStoredDataDragonVersion());
	globalForVersion.dataDragonVersion = { at: Date.now(), version: resolved };

	return resolved;
};
