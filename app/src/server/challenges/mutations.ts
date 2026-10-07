import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";

import { updateChallengesConfigServer } from "~/server/challenges/update-challenges-config";
import type { Regions } from "~/server/external/riot/twisted";

export const updateChallengesConfig = createServerFn({ method: "POST" })
	.validator((input: { region: string }) => input)
	.handler(async ({ data }) => {
		return Sentry.startSpan({ name: "updateChallengesConfig" }, async () => {
			const { region: rawRegion } = data;
			const region = rawRegion as Regions;

			await updateChallengesConfigServer(region);
			return true;
		});
	});
