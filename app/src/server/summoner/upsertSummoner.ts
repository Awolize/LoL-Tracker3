import type { Regions } from "twisted/dist/constants";
import type { AccountDto } from "twisted/dist/models-dto/account/account.dto";
import { db } from "@/db";
import { summoner as summonerTable } from "@/db/schema";
import type { Summoner } from "@/features/shared/types";
import { getSummonerRateLimit } from "@/server/summoner/getSummonerRateLimit";

export const upsertSummoner = async (
	puuid: string,
	region: Regions,
): Promise<Summoner | undefined> => {
	const { account, summoner } = await getSummonerRateLimit(puuid, region);

	if (!summoner) {
		console.log("Could not find summoner", puuid, region);
		return undefined;
	}

	return upsertSummonerBySummoner(summoner, region, account);
};

export const upsertSummonerBySummoner = async (
	summoner: Summoner,
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
			accountId: summoner.accountId,
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
		})
		.returning();

	return upserted[0];
};
