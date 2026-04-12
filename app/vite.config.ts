import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
	plugins: [
		viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
		tailwindcss(),
		tanstackStart({
			srcDirectory: "src",
		}),
		nitro({ preset: "node-server" }),
		viteReact(),
	],
	ssr:
		mode === "production"
			? {
					noExternal: ["ioredis", "bullmq"],
				}
			: undefined,
	resolve:
		mode === "production"
			? {
					alias: {
						"ioredis/built/utils": "ioredis/built/utils/index.js",
					},
				}
			: undefined,
}));
