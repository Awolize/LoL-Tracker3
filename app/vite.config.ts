import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig(() => ({
	plugins: [
		devtools(),
		tailwindcss(),
		tanstackStart(),
		nitro({ output: { dir: ".output" } }),
		viteReact(),
		sentryTanstackStart({
			org: "awot",
			project: "lol-tracker4",
			authToken: process.env.SENTRY_AUTH_TOKEN,
		}),
	],
	resolve: {
		tsconfigPaths: true,
	},
}));
