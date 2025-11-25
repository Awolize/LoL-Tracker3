import * as Sentry from "@sentry/tanstackstart-react";

Sentry.init({
	dsn: "https://60d349e38f5f58f5ba5637eb48be597b@o4510246374670336.ingest.de.sentry.io/4510246385418320",
	// tunnel: "/tunnel",

	// Adds request headers and IP for users, for more info visit:
	// https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
	sendDefaultPii: true,
});
