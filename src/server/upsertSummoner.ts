import type { InferSelectModel } from "drizzle-orm";
import type { Regions } from "twisted/dist/constants";
import type { AccountDto } from "twisted/dist/models-dto/account/account.dto";
import { db } from "@/db";
import { type summoner, summoner as summonerTable } from "@/db/schema";
import { getSummonerRateLimit } from "@/server/getSummonerRateLimit";

type SummonerRow = InferSelectModel<typeof summoner>;
export const upsertSummoner = async (
	puuid: string,
	region: Regions,
): Promise<SummonerRow> => {
	const { account, summoner } = await getSummonerRateLimit(puuid, region);

	if (!summoner) {
		console.log("Could not find summoner", puuid, region);
		return;
	}

	return upsertSummonerBySummoner(summoner, region, account);
};

export const upsertSummonerBySummoner = async (
	summoner: SummonerRow,
	region: Regions,
	account: AccountDto,
) => {
	const upserted = await db
		.insert(summonerTable)
		.values({
			puuid: summoner.puuid,
			summonerId: summoner.summonerId,
			region,
			profileIconId: summoner.profileIconId,
			summonerLevel: summoner.summonerLevel,
			revisionDate: summoner.revisionDate,
			gameName: account.gameName,
			tagLine: account.tagLine,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		.onConflictDoUpdate({
			target: summonerTable.puuid,
			set: {
				summonerId: summoner.summonerId,
				profileIconId: summoner.profileIconId,
				summonerLevel: summoner.summonerLevel,
				revisionDate: summoner.revisionDate,
				gameName: account.gameName,
				tagLine: account.tagLine,
				updatedAt: new Date(),
			},
		});

	return upserted;
};
