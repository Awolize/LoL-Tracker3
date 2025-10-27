import { createServerFn } from "@tanstack/react-start";
import type { Regions } from "twisted/dist/constants";
import { regionToRegionGroupForAccountAPI } from "twisted/dist/constants";
import type { AccountDto } from "twisted/dist/models-dto/account/account.dto";
import { riotApi } from "@/lib/riot-api";
import { updateChallengesConfigServer } from "@/server/update-challenges-config";
import { updateChampionDetails } from "@/server/update-champion-details";
import { updateGames } from "@/server/updateGames";
import { upsertChallenges } from "@/server/upsertChallenges";
import { upsertMastery } from "@/server/upsertMastery";
import { upsertSummoner } from "@/server/upsertSummoner";

export const fullUpdateSummoner = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { gameName: string; tagLine: string; region: string }) => input,
  )
  .handler(async ({ data }) => {
    const { gameName, tagLine, region: rawRegion } = data;
    const region = rawRegion as Regions;
    const regionGroup = regionToRegionGroupForAccountAPI(region);

    const user = (
      await riotApi.Account.getByRiotId(gameName, tagLine, regionGroup)
    ).response;

    if (!user.puuid) {
      console.log("This user does not exist", user);
      return false;
    }

    await timeIt(
      "updateChallengesConfig",
      user,
      updateChallengesConfigServer,
      region,
    );
    await timeIt("updateChampionDetails", user, updateChampionDetails);

    const updatedUser = await timeIt(
      "upsertSummoner",
      user,
      upsertSummoner,
      user.puuid,
      region,
    );

    if (!updatedUser) {
      console.log(`${user.gameName}#${user.tagLine}: Could not update user`);
      return false;
    }

    await timeIt("upsertMastery", user, upsertMastery, updatedUser, region);
    await timeIt(
      "upsertChallenges",
      user,
      upsertChallenges,
      region,
      updatedUser,
    );
    await timeIt("updateGames", user, updateGames, updatedUser, region);

    return true;
  });

// Helper: time a function
type AnyFunction = (...args: any[]) => Promise<any>;
async function timeIt<T extends AnyFunction>(
  functionName: string,
  user: Pick<AccountDto, "gameName" | "tagLine">,
  func: T,
  ...args: Parameters<T>
): Promise<ReturnType<T>> {
  console.time(`${user.gameName}#${user.tagLine}: ${functionName}`);
  const result = await func(...args);
  console.timeEnd(`${user.gameName}#${user.tagLine}: ${functionName}`);
  return result;
}
