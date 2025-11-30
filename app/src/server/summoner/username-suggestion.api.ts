// app/server/userSuggestions.ts
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { summoner } from "@/db/schema";
import { eq, like, ilike, and, desc, sql, or, gt } from "drizzle-orm";

export const getUsernameSuggestions = createServerFn({
	method: "POST",
})
	.inputValidator((data: { username: string; region: string }) => ({
		username: data.username,
		region: data.region,
	}))
	.handler(async ({ data: { username, region } }) => {
		const query = username.trim().toLowerCase();

		if (!query) return [];

		console.log("Querying for", query, region);

		const suggestions = await db
			.select({
				gameName: summoner.gameName,
				tagLine: summoner.tagLine,
				summonerLevel: summoner.summonerLevel,
				profileIconId: summoner.profileIconId,
				region: summoner.region,
			})
			.from(summoner)
			.where(
					ilike(summoner.gameName, `%${query}%`),
			)
			.orderBy(desc(summoner.updatedAt))
			.limit(10);

		console.log("Suggestions", suggestions);

		return suggestions.map((entry) => ({
			username: `${entry.gameName}#${entry.tagLine}`,
			level: entry.summonerLevel,
			iconId: entry.profileIconId,
			region: entry.region,
		}));
	});
