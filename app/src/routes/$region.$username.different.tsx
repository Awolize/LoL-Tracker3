import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy URL: this page was renamed to `challenge` in February 2026. The route is kept so old
 * links and bookmarks keep working — it is deliberately absent from the sitemap and renders
 * nothing, only redirecting.
 */
export const Route = createFileRoute("/$region/$username/different")({
	beforeLoad: ({ params }) => {
		throw redirect({
			to: "/$region/$username/challenge",
			params: params,
			replace: true,
		});
	},
});
