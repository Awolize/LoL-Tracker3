import * as Sentry from "@sentry/tanstackstart-react";

Sentry.init({
	dsn: "https://60d349e38f5f58f5ba5637eb48be597b@o4510246374670336.ingest.de.sentry.io/4510246385418320",
	// tunnel: "/tunnel",
	integrations: [
		// send console.log, console.warn, and console.error calls as logs to Sentry
		Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
	],

	// Sentry 11 replaced `sendDefaultPii` with per-category `dataCollection` and removed
	// `enableLogs` (logs ship whenever their API is used). The v11 default matches the old
	// `sendDefaultPii: true`, but it also collects categories v10 never did, so the
	// sensitive ones are opted back out: SQL query text, request/response bodies, cookies.
	// https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/migration/v10-to-v11/
	dataCollection: {
		cookies: false,
		httpBodies: [],
		databaseQueryData: false,
	},
	tracesSampleRate: 1.0,
});
