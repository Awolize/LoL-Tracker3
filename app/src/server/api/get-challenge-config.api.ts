import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { challengeLocalization, challengesConfig } from "@/db/schema";

export const getChallengeConfig = createServerFn()
	.inputValidator((input: { challengeId: number }) => input)
	.handler(async ({ data: { challengeId } }) => {
		const config = await db
			.select({
				config: challengesConfig,
				localization: challengeLocalization,
			})
			.from(challengesConfig)
			.leftJoin(
				challengeLocalization,
				eq(challengesConfig.id, challengeLocalization.id),
			)
			.where(
				and(
					eq(challengesConfig.id, challengeId),
					eq(challengeLocalization.language, "en_US"),
				),
			)
			.limit(1);

		return config[0] || null;
	});
