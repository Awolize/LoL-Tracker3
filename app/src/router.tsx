import * as Sentry from "@sentry/tanstackstart-react";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
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

      // Adds request headers and IP for users, for more info visit:
      // https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
      sendDefaultPii: true,

      integrations: [
        Sentry.tanstackRouterBrowserTracingIntegration(router),
        // Sentry.replayIntegration(),
        // Sentry.feedbackIntegration({ colorScheme: "system" }),
      ],
      enableLogs: true,
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
