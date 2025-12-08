import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";
import type { Regions } from "twisted/dist/constants";
import { updateChallengesConfigServer } from "@/server/challenges/update-challenges-config";

export const updateChallengesConfig = createServerFn({ method: "POST" })
	.inputValidator((input: { region: string }) => input)
	.handler(async ({ data }) => {
		return Sentry.startSpan({ name: "updateChallengesConfig" }, async () => {
			const { region: rawRegion } = data;
			const region = rawRegion as Regions;

			await updateChallengesConfigServer(region);
			return true;
		});
	});
