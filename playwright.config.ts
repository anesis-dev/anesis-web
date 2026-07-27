import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: "html",
	use: {
		baseURL: "http://localhost:3000",
		trace: "on-first-retry",
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
	webServer: {
		command: "bun run build && bun run start",
		url: "http://localhost:3000",
		reuseExistingServer: !process.env.CI,
		// CI runs a cold build every time (no Turbopack cache across jobs), which
		// is noticeably slower than a local rebuild - give it headroom beyond the
		// default 120s so a slow runner doesn't time out mid-build.
		timeout: 300_000,
	},
});
