import { eq } from "drizzle-orm";
import type { Regions } from "twisted/dist/constants";
import { db } from "@/db";
import { summoner as summonerTable } from "@/db/schema";

export const createSummoner = async (puuid: string, region: Regions) => {
	// Check if summoner exists
	const existingSummoner = await db
		.select()
		.from(summonerTable)
		.where(eq(summonerTable.puuid, puuid))
		.limit(1)
		.then((rows) => rows[0]);

	if (existingSummoner) return existingSummoner;

	// Insert new summoner
	const [upsertedSummoner] = await db
		.insert(summonerTable)
		.values({
			puuid,
			region,
			profileIconId: 0,
			revisionDate: new Date(0),
			summonerId: "unknown",
			summonerLevel: 0,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		.returning();

	return upsertedSummoner;
};
