import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";
import { updateQueue, updateQueueEvents } from "@/server/queue"; // Ensure this path is correct

export const fullUpdateSummoner = createServerFn({ method: "POST" })
	.inputValidator(
		(input: {
			gameName: string;
			tagLine: string;
			region: string;
			includeMatches?: boolean;
		}) => input,
	)
	.handler(async ({ data }) => {
		return Sentry.startSpan({ name: "queue-dispatch-update" }, async () => {
			const { gameName, tagLine, region, includeMatches = true } = data;
			console.log(`[API] Received update request for ${gameName}#${tagLine}`);

			const metaJob = await updateQueue.add("update-meta", data, {
				priority: 1,
			});

			try {
				await metaJob.waitUntilFinished(updateQueueEvents, 20000);
			} catch (error) {
				console.error("Meta update timed out or failed", error);
				return false;
			}

			if (includeMatches) {
				try {
					const matchJob = await updateQueue.add("update-matches", data, {
						priority: 5,
					});

					await matchJob.waitUntilFinished(updateQueueEvents, 60000);
				} catch (error) {
					console.error("Match update timed out or failed", error);
					return true;
				}
			}

			return true;
		});
	});
