import type { Regions } from "twisted/dist/constants";
import { lolApi } from "@/server/lib/lol-api";
import { rateLimitWrapper } from "@/server/api/rate-limit-wrapper";

export const lolApiSummonerByPUUID = async (puuid: string, region: Regions) => {
	return (
		await rateLimitWrapper(() => lolApi.Summoner.getByPUUID(puuid, region))
	).response;
};
