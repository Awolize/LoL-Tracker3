import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

// NOTE: the dev-only shim that rewrote Accept/Sec-Fetch-Dest for /api/images/*
// (TanStack/router#7523) was removed once nitro 3.0.260903-beta fixed the dev
// static handler — splat routes with file extensions now reach the route on
// their own. Re-add it only if that regresses.

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
	build: {
		rollupOptions: {
			// `motion` pulls in framer-motion, whose dist ships React Server Components
			// "use client" directives. TanStack Start has no RSC, so the directive is a
			// no-op here, but rolldown warns once per module — ~169 lines per build,
			// which buries real warnings. Drop only this code; everything else reports.
			onLog(level, log, handler) {
				if (log?.code === "MODULE_LEVEL_DIRECTIVE") return;
				handler(level, log);
			},
		},
	},
}));
