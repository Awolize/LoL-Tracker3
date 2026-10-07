import { rateLimitWrapper } from "~/server/api/rate-limit-wrapper";
import { lolApi } from "~/server/external/riot/lol-api";
import type { Regions } from "~/server/external/riot/twisted";

export const lolApiSummonerByPUUID = async (puuid: string, region: Regions) => {
	return (await rateLimitWrapper(() => lolApi.Summoner.getByPUUID(puuid, region))).response;
};
