import { d as createServerRpc, c as createServerFn } from "../server.js";
import { b as constantsExports, f as riotApi } from "./riot-api-DL3qE7bV.js";
import { s as startSpan, u as upsertSummoner, a as updateChallengesConfigServer, b as updateChampionDetails, c as upsertMastery, d as upsertChallenges, e as updateGames } from "./upsertSummoner-ZoG_kNj-.js";
import "node:async_hooks";
import "node:stream";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream/web";
import "events";
import "dns";
import "fs";
import "net";
import "tls";
import "path";
import "string_decoder";
import "os";
import "http";
import "https";
import "url";
import "assert";
import "zlib";
import "querystring";
const fullUpdateSummoner_createServerFn_handler = createServerRpc("986f90430392eed555e4ed03d862138b1d8cbd5aed3b71e304475ad31abea0ae", (opts, signal) => {
  return fullUpdateSummoner.__executeServer(opts, signal);
});
const fullUpdateSummoner = createServerFn({
  method: "POST"
}).inputValidator((input) => input).handler(fullUpdateSummoner_createServerFn_handler, async ({
  data
}) => {
  return startSpan({
    name: "fullUpdateSummoner"
  }, async () => {
    const {
      gameName,
      tagLine,
      region: rawRegion
    } = data;
    const region = rawRegion;
    const regionGroup = constantsExports.regionToRegionGroupForAccountAPI(region);
    const user = (await riotApi.Account.getByRiotId(gameName, tagLine, regionGroup)).response;
    if (!user.puuid) {
      console.log("This user does not exist", user);
      return false;
    }
    await timeIt("updateChallengesConfig", user, updateChallengesConfigServer, region);
    await timeIt("updateChampionDetails", user, updateChampionDetails);
    const updatedUser = await timeIt("upsertSummoner", user, upsertSummoner, user.puuid, region);
    if (!updatedUser) {
      console.log(`${user.gameName}#${user.tagLine}: Could not update user`);
      return false;
    }
    await timeIt("upsertMastery", user, upsertMastery, updatedUser, region);
    await timeIt("upsertChallenges", user, upsertChallenges, region, updatedUser);
    await timeIt("updateGames", user, updateGames, updatedUser, region);
    return true;
  });
});
async function timeIt(functionName, user, func, ...args) {
  console.time(`${user.gameName}#${user.tagLine}: ${functionName}`);
  const result = await func(...args);
  console.timeEnd(`${user.gameName}#${user.tagLine}: ${functionName}`);
  return result;
}
export {
  fullUpdateSummoner_createServerFn_handler
};
