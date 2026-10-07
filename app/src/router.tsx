import * as Sentry from "@sentry/tanstackstart-react";
import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
	const queryClient = new QueryClient();

	const router = createTanStackRouter({
		routeTree,
		defaultPreload: "intent",
		scrollRestoration: true,
		context: { queryClient: queryClient },
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
	});

	if (!router.isServer) {
		Sentry.init({
			dsn: import.meta.env.VITE_SENTRY_DSN,

			integrations: [
				Sentry.tanstackRouterBrowserTracingIntegration(router),
				// Sentry.replayIntegration(),
				// Sentry.feedbackIntegration({ colorScheme: "system" }),
			],
			// Sentry 11 removed `sendDefaultPii` (now per-category `dataCollection`) and
			// `enableLogs` (logs ship whenever their API is used). Keep cookies and
			// request/response bodies out of Sentry, matching the v10 collection defaults.
			dataCollection: {
				cookies: false,
				httpBodies: [],
				databaseQueryData: false,
			},
			tracesSampleRate: 1.0,
			replaysSessionSampleRate: 0.1,
			replaysOnErrorSampleRate: 1.0,
		});

		Sentry.logger.info("User triggered test log", {
			log_source: "sentry_test",
		});
	}

	return router;
};

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
