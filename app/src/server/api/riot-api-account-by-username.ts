import {
	type Regions,
	regionToRegionGroupForAccountAPI,
} from "twisted/dist/constants";
import { rateLimitWrapper } from "@/server/api/rate-limit-wrapper";
import { riotApi } from "@/server/lib/riot-api";

export const riotApiAccountByUsername = async (
	gameName: string,
	tagLine: string,
	region: Regions,
) => {
	const regionGroup = regionToRegionGroupForAccountAPI(region);
	return (
		await rateLimitWrapper(() =>
			riotApi.Account.getByRiotId(gameName, tagLine, regionGroup),
		)
	).response;
};
