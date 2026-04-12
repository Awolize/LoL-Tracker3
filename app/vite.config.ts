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
	],
	ssr:
		mode === "production"
			? {
				noExternal: ["ioredis", "bullmq", "tslib"],
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
