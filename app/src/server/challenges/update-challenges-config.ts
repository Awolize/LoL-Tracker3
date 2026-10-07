import { and, eq } from "drizzle-orm";

import { db } from "~/db";
import { challengeLocalization, challengesConfig } from "~/db/schema";
import type { ChallengesConfig } from "~/features/shared/types";
import { lolApi } from "~/server/external/riot/lol-api";
import type { ChallengeConfigDTO, Regions } from "~/server/external/riot/twisted";

export const updateChallengesConfigServer = async (region: Regions) => {
	const configs: ChallengeConfigDTO[] = (await lolApi.Challenges.Configs(region)).response;
	return Promise.all(configs.map((config) => updateConfig(config)));
};

const updateConfig = async (config: ChallengeConfigDTO): Promise<ChallengesConfig> => {
	const existing = await db
		.select()
		.from(challengesConfig)
		.where(eq(challengesConfig.id, config.id))
		.then((r) => r[0]);

	const rowData = {
		id: config.id,
		state: config.state ?? null,
		tracking: config.tracking ?? null,
		leaderboard: config.leaderboard,
		startTimestamp: config.startTimestamp ? new Date(config.startTimestamp) : null,
		endTimestamp: config.endTimestamp ? new Date(config.endTimestamp) : null,
		thresholds: config.thresholds,
	};

	if (existing) {
		await db.update(challengesConfig).set(rowData).where(eq(challengesConfig.id, config.id));
	} else {
		await db.insert(challengesConfig).values(rowData);
	}

	// Localization insert/update
	const localizedName = config.localizedNames.en_US!;
	const locData = {
		id: config.id,
		language: "en_US" as const,
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
