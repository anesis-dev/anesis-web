describe("env config", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
		vi.resetModules();
	});

	it("uses the local api default when the env var is missing", async () => {
		vi.resetModules();

		const { env } = await import("@/config/env");

		expect(env.apiUrl).toBe("http://localhost:4000");
	});

	it("normalizes valid urls", async () => {
		vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.test///");
		vi.resetModules();

		const { env } = await import("@/config/env");

		expect(env.apiUrl).toBe("https://api.example.test");
	});

	it("allows same-origin api paths for production proxies", async () => {
		vi.stubEnv("NEXT_PUBLIC_API_URL", "/api/backend///");
		vi.resetModules();

		const { env } = await import("@/config/env");

		expect(env.apiUrl).toBe("/api/backend");
	});

	it("falls back to the local api default for invalid values", async () => {
		vi.stubEnv("NEXT_PUBLIC_API_URL", "not-a-url");
		vi.resetModules();

		const { env } = await import("@/config/env");

		expect(env.apiUrl).toBe("http://localhost:4000");
	});
});
