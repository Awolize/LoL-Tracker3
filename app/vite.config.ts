import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
	plugins: [
		tailwindcss(),
		tanstackStart({ srcDirectory: "src" }),
		nitro({ preset: "node-server" }),
		react(),
		sentryTanstackStart({
			org: "awot",
			project: "lol-tracker4",
			authToken: process.env.SENTRY_AUTH_TOKEN,
		}),
	],
	ssr:
		mode === "production"
			? {
					noExternal: ["ioredis", "bullmq"],
				}
			: undefined,
	resolve: {
		tsconfigPaths: true,
		...(mode === "production"
			? {
					alias: {
						"ioredis/built/utils": "ioredis/built/utils/index.js",
					},
				}
			: undefined),
	},
}));
