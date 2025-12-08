import type { Regions } from "twisted/dist/constants";
import type { SummonerV4DTO } from "twisted/dist/models-dto";
import type { AccountDto } from "twisted/dist/models-dto/account/account.dto";
import { db } from "@/db";
import { summoner as summonerTable } from "@/db/schema";
import type { Summoner } from "@/features/shared/types";

export const upsertSummoner = async (
	summoner: SummonerV4DTO,
	account: AccountDto,
	region: Regions,
): Promise<Summoner> => {
	return upsertSummonerBySummoner(summoner, region, account);
};

const upsertSummonerBySummoner = async (
	summoner: SummonerV4DTO,
	region: Regions,
	account: AccountDto,
) => {
	const result = await db
		.insert(summonerTable)
		.values({
			puuid: summoner.puuid,

			region,
			profileIconId: summoner.profileIconId,
			summonerLevel: summoner.summonerLevel,
			revisionDate: new Date(summoner.revisionDate),
			gameName: account.gameName,
			tagLine: account.tagLine,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		.onConflictDoUpdate({
			target: summonerTable.puuid,
			set: {
				profileIconId: summoner.profileIconId,
				summonerLevel: summoner.summonerLevel,
				revisionDate: new Date(summoner.revisionDate),
				gameName: account.gameName,
				tagLine: account.tagLine,
				updatedAt: new Date(),
			},
		})
		.returning();

	return result[0];
};
