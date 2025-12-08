import type { Regions } from "twisted/dist/constants";
import { rateLimitWrapper } from "@/server/api/rate-limit-wrapper";
import { lolApi } from "@/server/external/riot/lol-api";

export const lolApiSummonerByPUUID = async (puuid: string, region: Regions) => {
	return (
		await rateLimitWrapper(() => lolApi.Summoner.getByPUUID(puuid, region))
	).response;
};
