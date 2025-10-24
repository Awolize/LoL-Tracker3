import type { Regions } from "twisted/dist/constants";
import { lolApi } from "@/server/lol-api";
import { rateLimitWrapper } from "@/server/rate-limit-wrapper";

export const lolApiSummonerByPUUID = async (puuid: string, region: Regions) => {
	return (
		await rateLimitWrapper(() => lolApi.Summoner.getByPUUID(puuid, region))
	).response;
};
