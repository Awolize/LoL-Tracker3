import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import type { Regions } from "twisted/dist/constants";
import { db } from "@/db";
import { summoner } from "@/db/schema";
import { getSummonerByUsernameRateLimit } from "@/server/summoner/get-summoner-by-username-rate-limit";

// 1. Define the explicit return type
type NameChangeResult =
	| { found: false; newUsername?: never }
	| { found: true; newUsername: string };

export const checkNameChangeFn = createServerFn({ method: "POST" })
	.inputValidator((data: { username: string; region: Regions }) => data)
	.handler(
		async ({ data: { username, region } }): Promise<NameChangeResult> => {
			const [gameName, tagLine] = username.toLowerCase().split("#");

			// Check DB for old username
			const oldCachedUser = await db.query.summoner.findFirst({
				where: and(
					eq(summoner.gameName, gameName),
					eq(summoner.tagLine, tagLine),
					eq(summoner.region, region),
				),
			});

			if (!oldCachedUser) {
				return { found: false };
			}

			try {
				// Fetch fresh data using PUUID
				const freshUser = await getSummonerByUsernameRateLimit(
					oldCachedUser.puuid,
					region,
				);

				if (freshUser.summoner) {
					const newUsername = `${freshUser.account.gameName}-${freshUser.account.tagLine}`;

					// Update DB
					await db
						.update(summoner)
						.set({
							gameName: freshUser.account.gameName,
							tagLine: freshUser.account.tagLine,
							profileIconId: freshUser.summoner.profileIconId,
							summonerLevel: freshUser.summoner.summonerLevel,
							updatedAt: new Date(),
						})
						.where(eq(summoner.puuid, oldCachedUser.puuid));

					return { found: true, newUsername };
				}
			} catch (error) {
				console.error("Error migrating user:", error);
			}

			return { found: false };
		},
	);
