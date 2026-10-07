import { rateLimitWrapper } from "~/server/api/rate-limit-wrapper";
import { riotApi } from "~/server/external/riot/riot-api";
import { type Regions, regionToRegionGroupForAccountAPI } from "~/server/external/riot/twisted";

export const riotApiAccountByPUUID = async (puuid: string, region: Regions) => {
	const regionGroup = regionToRegionGroupForAccountAPI(region);
	return (await rateLimitWrapper(() => riotApi.Account.getByPUUID(puuid, regionGroup))).response;
};
