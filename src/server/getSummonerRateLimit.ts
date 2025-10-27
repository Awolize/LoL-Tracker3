import type { InferSelectModel } from "drizzle-orm";
import type { Regions } from "twisted/dist/constants";
import type { summoner } from "@/db/schema";
import { lolApiSummonerByPUUID } from "@/server/lol-api-summoner-by-puuid";
import { riotApiAccountByPUUID } from "@/server/riot-api-account-by-puuid";

type SummonerRow = InferSelectModel<typeof summoner>;

export const getSummonerRateLimit = async (puuid: string, region: Regions) => {
	const account = await riotApiAccountByPUUID(puuid, region);
	const summonerV4DTO = await lolApiSummonerByPUUID(puuid, region);

	const summoner: SummonerRow = {
		summonerId: summonerV4DTO.id,
		accountId: null,
		createdAt: new Date(),
		updatedAt: new Date(),
		region: region,
		profileIconId: summonerV4DTO.profileIconId,
		puuid: summonerV4DTO.puuid,
		summonerLevel: summonerV4DTO.summonerLevel,
		revisionDate: new Date(summonerV4DTO.revisionDate),
		gameName: account.gameName,
		tagLine: account.tagLine,
	};

	return { summoner, account };
};
