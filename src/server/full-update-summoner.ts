import { createServerFn } from "@tanstack/react-start";
import type { InferSelectModel } from "drizzle-orm";
import { and, eq } from "drizzle-orm";
import {
	type Regions,
	regionToRegionGroupForAccountAPI,
} from "twisted/dist/constants";
import type { ConfigDTO } from "twisted/dist/models-dto";
import type { AccountDto } from "twisted/dist/models-dto/account/account.dto";
import { db } from "@/db";
import { challengeLocalization, challengesConfig } from "@/db/schema";
import { lolApi } from "@/lib/lol-api";
import { riotApi } from "@/lib/riot-api";
import { updateChampionDetails } from "@/server/update-champion-details";
import { updateGames } from "@/server/updateGames";
import { upsertChallenges } from "@/server/upsertChallenges";
import { upsertMastery } from "@/server/upsertMastery";
import {
	upsertSummoner,
	upsertSummonerBySummoner,
} from "@/server/upsertSummoner";

type ChallengesConfig = InferSelectModel<typeof challengesConfig>;

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
			updateChallengesConfig,
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

// Converts your Prisma upserts to Drizzle logic
const updateConfig = async (
	config: ConfigDTO.Config,
): Promise<ChallengesConfig> => {
	const existing = await db
		.select()
		.from(challengesConfig)
		.where(eq(challengesConfig.id, config.id))
		.then((r) => r[0]);

	const rowData = {
		id: config.id,
		state: config.state ?? null, // convert undefined → null
		leaderboard: config.leaderboard,
		endTimestamp: config.endTimestamp ? new Date(config.endTimestamp) : null,
		thresholds: config.thresholds,
	};

	if (existing) {
		await db
			.update(challengesConfig)
			.set(rowData)
			.where(eq(challengesConfig.id, config.id));
	} else {
		await db.insert(challengesConfig).values(rowData);
	}

	// Localization insert/update
	const localizedName = config.localizedNames.en_US!;
	const locData = {
		id: config.id,
		language: "en_US" as "en_US",
		description: localizedName.description,
		name: localizedName.name,
		shortDescription: localizedName.shortDescription,
	};

	const locExisting = await db
		.select()
		.from(challengeLocalization)
		.where(
			and(
				eq(challengeLocalization.id, config.id),
				eq(challengeLocalization.language, "en_US"),
			),
		)
		.then((r) => r[0]);

	if (locExisting) {
		await db
			.update(challengeLocalization)
			.set(locData)
			.where(
				and(
					eq(challengeLocalization.id, config.id),
					eq(challengeLocalization.language, "en_US"),
				),
			);
	} else {
		await db.insert(challengeLocalization).values(locData);
	}

	return { ...rowData };
};

export const updateChallengesConfig = async (region: Regions) => {
	const configs: ConfigDTO.Config[] = (await lolApi.Challenges.Configs(region))
		.response;
	return Promise.all(configs.map((config) => updateConfig(config)));
};
