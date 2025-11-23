import assert from "node:assert";
import type { Regions } from "twisted/dist/constants";
import { lolApiSummonerByPUUID } from "@/server/api/lol-api-summoner-by-puuid";
import { riotApiAccountByUsername } from "@/server/api/riot-api-account-by-username";

export const getSummonerByUsernameRateLimit = async (
	username: string,
	region: Regions,
) => {
	assert(username.includes("#"), "Username did not include a #");

	const [gameNameEncoded, tagLine] = username.split("#");
	assert(gameNameEncoded, "Game name part is missing");
	assert(tagLine, "Tag line part is missing");

	const gameName = decodeURI(gameNameEncoded);
	const account = await riotApiAccountByUsername(gameName, tagLine, region);
	const summoner = await lolApiSummonerByPUUID(account.puuid, region);

	return { summoner, account };
};
