import type { Regions } from "twisted/dist/constants";
import type { Summoner } from "@/lib/types";
import { lolApiSummonerByPUUID } from "@/server/lol-api-summoner-by-puuid";
import { riotApiAccountByPUUID } from "@/server/riot-api-account-by-puuid";

export const getSummonerRateLimit = async (puuid: string, region: Regions) => {
	const account = await riotApiAccountByPUUID(puuid, region);
	const summonerV4DTO = await lolApiSummonerByPUUID(puuid, region);

	const summoner: Summoner = {
		summonerId: null,
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
