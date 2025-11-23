import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";
import type { Regions } from "twisted/dist/constants";
import { regionToRegionGroupForAccountAPI } from "twisted/dist/constants";
import type { AccountDto } from "twisted/dist/models-dto/account/account.dto";
import { riotApi } from "@/features/shared/riot-api";
import { updateChallengesConfigServer } from "@/server/challenges/update-challenges-config";
import { upsertChallenges } from "@/server/challenges/upsertChallenges";
import { updateChampionDetails } from "@/server/champions/update-champion-details";
import { upsertMastery } from "@/server/champions/upsertMastery";
import { updateGames } from "@/server/matches/updateGames";
import { upsertSummoner } from "@/server/summoner/upsertSummoner";

export const fullUpdateSummoner = createServerFn({ method: "POST" })
	.inputValidator(
		(input: { gameName: string; tagLine: string; region: string }) => input,
	)
	.handler(async ({ data }) => {
		return Sentry.startSpan({ name: "fullUpdateSummoner" }, async () => {
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
