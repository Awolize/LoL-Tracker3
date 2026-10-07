import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

/**
 * Dev-only workaround for TanStack/router#7523 (Nitro dev server 404s splat
 * routes whose path looks like a static file, e.g. `/api/images/...webp`).
 *
 * Nitro's dev static handler keys on the `Accept` and `Sec-Fetch-Dest` request
 * headers (its 404 carries `vary: sec-fetch-dest, accept`). Browsers fetch
 * <img> with `Accept: image/...` + `Sec-Fetch-Dest: image`, so the request never
 * reaches the route. Rewriting both for /api/images lets it through; the route
 * still responds with the correct Content-Type. Not applied to builds/preview.
 */
const devAllowFileExtensionSplatRoutes = {
	name: "dev-allow-file-extension-splat-routes",
	apply: "serve" as const,
	configureServer(server: {
		middlewares: { use: (fn: (req: any, res: any, next: () => void) => void) => void };
	}) {
		server.middlewares.use((req, _res, next) => {
			if (req.url?.startsWith("/api/images/")) {
				req.headers.accept = "text/html";
				req.headers["sec-fetch-dest"] = "document";
			}
			next();
		});
	},
};

export default defineConfig(() => ({
	plugins: [
		devAllowFileExtensionSplatRoutes,
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
