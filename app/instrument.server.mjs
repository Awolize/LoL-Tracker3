import "dotenv/config";
import * as Sentry from "@sentry/tanstackstart-react";

Sentry.init({
	dsn: process.env.VITE_SENTRY_DSN,
	// tunnel: "/tunnel",
	integrations: [
		// send console.log, console.warn, and console.error calls as logs to Sentry
		Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
	],

	// Adds request headers and IP for users, for more info visit:
	// https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
	sendDefaultPii: true,
	enableLogs: true,
	tracesSampleRate: 1.0,
});
