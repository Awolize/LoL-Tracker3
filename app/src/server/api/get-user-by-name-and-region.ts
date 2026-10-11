import { and, eq, inArray, notInArray, sql } from "drizzle-orm";

import { db } from "~/db";
import { summoner } from "~/db/schema";
import type { Summoner } from "~/features/shared/types";
import type { Regions } from "~/server/external/riot/twisted";
import {
	getSummonerByPuuidRateLimit,
	getSummonerByUsernameRateLimit,
} from "~/server/summoner/get-summoner-by-username-rate-limit";

/**
 * How long a stored summoner is trusted before Riot is asked again.
 *
 * One policy for the whole app: the profile hub used to refresh hourly while every other caller
 * used a day, so the same summoner was cached under two different rules depending on which of
 * the two resolvers answered.
 */
export const RESOLUTION_TTL_MS = 60 * 60 * 1000;

/**
 * The outcome of resolving a Riot ID.
 *
 * A result type rather than a throw, because the failure cases are part of the interface the UI
 * renders — the profile route redirects on a rename, 404s on `not_found` and sends the user back
 * to the landing page on `rate_limit`.
 *
 * `renamedTo` is set when the requested name 404'd but the account was found by PUUID. Riot IDs
 * can change, so the caller needs to know the account answered under a different name.
 */
export type SummonerResolution =
	| {
			ok: true;
			user: Summoner;
			/** True when the answer came from the stored row rather than a fresh Riot lookup. */
			isCached: boolean;
			lastUpdated: Date | null;
			renamedTo?: string;
	  }
	| { ok: false; error: "not_found" | "rate_limit" };

/**
 * Resolves `gameName#tagLine` within a region, refreshing from Riot when the stored row is
 * missing or older than `RESOLUTION_TTL_MS`.
 *
 * This is the app's single resolution pipeline. It used to exist twice — here, with a one-day
 * window and a throw, and again in `summoner/mutations.ts` with an hourly window and an error
 * string — and the two disagreed on how they matched the stored row: this one compares
 * case-insensitively, the other used `eq()` against a lowercased input, so a row stored as
 * `EUW` was invisible to it. That divergence is why one profile 404'd while its row sat in the
 * database; the case-insensitive comparison here is the correct behaviour and the copy is gone.
 */
export async function getUserByNameAndRegion(
	username: string,
	region: Regions,
	options?: { forceRefresh?: boolean },
): Promise<SummonerResolution> {
	const [gameName, tagLine] = username.toLowerCase().split("#");

	try {
		const user = await db.query.summoner.findFirst({
			where: (s) =>
				and(
					sql`lower(${s.gameName}) = lower(${gameName})`,
					sql`lower(${s.tagLine}) = lower(${tagLine})`,
					eq(s.region, region),
				),
		});

		const isFresh =
			user?.updatedAt !== null &&
			user?.updatedAt !== undefined &&
			Date.now() - user.updatedAt.getTime() <= RESOLUTION_TTL_MS;

		if (user && isFresh && !options?.forceRefresh) {
			return { ok: true, user, isCached: true, lastUpdated: user.updatedAt };
		}

		console.log("Could not find summoner in DB", username, region);

		let riotSummoner;
		let account;
		let renamedTo: string | undefined;

		try {
			// Primary path: resolve by Riot ID.
			const resolvedByName = await getSummonerByUsernameRateLimit(username, region);
			riotSummoner = resolvedByName.summoner;
			account = resolvedByName.account;
		} catch (error: any) {
			// Rename fallback: the old Riot ID 404s, but we know the PUUID.
			if (error?.status !== 404 || !user?.puuid) throw error;

			try {
				const resolvedByPuuid = await getSummonerByPuuidRateLimit(user.puuid, region);
				riotSummoner = resolvedByPuuid.summoner;
				account = resolvedByPuuid.account;
				renamedTo = `${account.gameName}#${account.tagLine}`;
			} catch (puuidError: any) {
				// Name 404'd AND puuid 404'd → the account is genuinely gone. Prune it.
				if (puuidError?.status === 404) {
					await db.delete(summoner).where(eq(summoner.puuid, user.puuid));
					console.log(
						new Date().toLocaleString(),
						`Pruned dead summoner ${gameName}#${tagLine} (puuid ${user.puuid})`,
					);
				}
				throw puuidError; // re-throw either way; the outer catch maps it
			}
		}

		// Find duplicates
		const existingUsers = await db.query.summoner.findMany({
			where: (s) =>
				and(
					sql`lower(${s.gameName}) = lower(${gameName})`,
					sql`lower(${s.tagLine}) = lower(${tagLine})`,
					notInArray(s.puuid, [riotSummoner.puuid]),
					eq(s.region, region),
				),
		});

		// Null out gameName/tagLine for duplicates
		if (existingUsers.length > 0) {
			await db
				.update(summoner)
				.set({ gameName: null, tagLine: null })
				.where(
					inArray(
						summoner.puuid,
						existingUsers.map((u) => u.puuid),
					),
				);
		}

		// Upsert user
		const existing = await db.query.summoner.findFirst({
			where: eq(summoner.puuid, riotSummoner.puuid),
		});

		const data: Summoner = {
			puuid: riotSummoner.puuid,
			region,
			gameName: account.gameName,
			tagLine: account.tagLine,
			profileIconId: riotSummoner.profileIconId,
			summonerLevel: riotSummoner.summonerLevel,
			revisionDate: new Date(riotSummoner.revisionDate),
			updatedAt: new Date(),
			createdAt: existing?.createdAt ?? new Date(),
		};

		let savedUser: Summoner;
		if (existing) {
			await db.update(summoner).set(data).where(eq(summoner.puuid, riotSummoner.puuid));

			savedUser = { ...existing, ...data };
		} else {
			await db.insert(summoner).values(data);
			savedUser = data;
		}

		return {
			ok: true,
			user: savedUser,
			isCached: false,
			lastUpdated: savedUser.updatedAt,
			renamedTo,
		};
	} catch (error: any) {
		console.error("error:", new Date().toLocaleString(), username, region, error);
		return { ok: false, error: error?.status === 429 ? "rate_limit" : "not_found" };
	}
}
