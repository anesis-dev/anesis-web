import path from "node:path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./src/test/setup.tsx"],
		exclude: [...configDefaults.exclude, "e2e/**"],
		coverage: {
			provider: "v8",
			reporter: ["text", "html"],
			include: ["src/**/*.{ts,tsx}"],
			exclude: [
				"src/**/*.d.ts",
				"src/app/globals.css",
				"src/test/**",
			],
			thresholds: {
				lines: 63,
				statements: 62,
				functions: 57,
				branches: 59,
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
