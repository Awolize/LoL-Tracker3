import { and, eq, ilike, inArray, notInArray } from "drizzle-orm";
import type { Regions } from "twisted/dist/constants";
import { db } from "@/db";
import { summoner } from "@/db/schema";
import type { Summoner } from "@/features/shared/types";
import { getSummonerByUsernameRateLimit } from "@/server/summoner/get-summoner-by-username-rate-limit";

export async function getUserByNameAndRegion(
	username: string,
	region: Regions,
) {
	function isWithinThreshold(date: Date) {
		const oneDayInMillis = 24 * 60 * 60 * 1000;
		return Date.now() - date.getTime() <= oneDayInMillis;
	}

	const [gameName, tagLine] = username.split("#");

	try {
		// Fetch existing user
		const user = await db.query.summoner.findFirst({
			where: (s) =>
				and(
					ilike(s.gameName, gameName),
					ilike(s.tagLine, tagLine),
					eq(s.region, region),
				),
		});

		if (user && isWithinThreshold(user.updatedAt)) {
			return user;
		}

		console.log("Could not find summoner in DB", username, region);

		// Fetch from Riot API
		const { summoner: riotSummoner, account } =
			await getSummonerByUsernameRateLimit(username, region);

		// Find duplicates
		const existingUsers = await db.query.summoner.findMany({
			where: (s) =>
				and(
					ilike(s.gameName, account.gameName),
					ilike(s.tagLine, account.tagLine),
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
			accountId: null,
			summonerId: null,
		};

		let savedUser: Summoner;
		if (existing) {
			await db
				.update(summoner)
				.set(data)
				.where(eq(summoner.puuid, riotSummoner.puuid));

			savedUser = { ...existing, ...data };
		} else {
			await db.insert(summoner).values(data);
			savedUser = data;
		}

		return savedUser;
	} catch (error) {
		console.error(
			"error:",
			new Date().toLocaleString(),
			username,
			region,
			error,
		);
		throw new Error("Could not fetch summoner", { cause: error });
	}
}
