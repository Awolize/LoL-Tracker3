import {
	type Regions,
	regionToRegionGroupForAccountAPI,
} from "twisted/dist/constants";
import { riotApi } from "@/lib/riot-api";
import { rateLimitWrapper } from "@/server/rate-limit-wrapper";

export const riotApiAccountByPUUID = async (puuid: string, region: Regions) => {
	const regionGroup = regionToRegionGroupForAccountAPI(region);
	return (
		await rateLimitWrapper(() => riotApi.Account.getByPUUID(puuid, regionGroup))
	).response;
};
