import { eq } from "drizzle-orm";
import { db } from "@/db";
import { challengeLocalization, challengesConfig } from "@/db/schema";

export const getChallengesConfig = async () => {
	const configs = await db
		.select({
			config: challengesConfig,
			localization: challengeLocalization,
		})
		.from(challengesConfig)
		.leftJoin(
			challengeLocalization,
			eq(challengesConfig.id, challengeLocalization.id)
		)
		.where(eq(challengeLocalization.language, "en_US"));

	return configs;
};
