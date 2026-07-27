// Covers the server-side half of the api client: on the server, Node's fetch
// rejects a relative URL, so a same-origin `apiUrl` such as "/api/backend" has
// to be resolved against an origin before it is used. The client reads
// `typeof window` once at load, so every case re-imports it with `window`
// stubbed away.
vi.mock("@/config/env", () => ({
	env: {
		apiUrl: "/api/backend",
	},
}));

type ApiClient = typeof import("@/api/client").api;

const SERVER_ENV_KEYS = ["API_PROXY_URL", "VERCEL_URL", "PORT"] as const;

let savedEnv: Partial<Record<(typeof SERVER_ENV_KEYS)[number], string>>;

async function loadClient({ server }: { server: boolean }): Promise<ApiClient> {
	if (server) {
		vi.stubGlobal("window", undefined);
	}
	vi.resetModules();
	return (await import("@/api/client")).api;
}

function mockFetchOnce() {
	return vi
		.spyOn(globalThis, "fetch")
		.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));
}

describe("api client base url on the server", () => {
	beforeEach(() => {
		savedEnv = {};
		for (const key of SERVER_ENV_KEYS) {
			savedEnv[key] = process.env[key];
			delete process.env[key];
		}
	});

	afterEach(() => {
		for (const key of SERVER_ENV_KEYS) {
			const value = savedEnv[key];
			if (value === undefined) delete process.env[key];
			else process.env[key] = value;
		}
		vi.unstubAllGlobals();
	});

	it("resolves a same-origin api path against the local server origin", async () => {
		const fetchSpy = mockFetchOnce();
		const api = await loadClient({ server: true });

		await api.get("/template/all?page=1");

		expect(fetchSpy.mock.calls[0]?.[0]).toBe(
			"http://127.0.0.1:3000/api/backend/template/all?page=1",
		);
	});

	it("honours PORT when resolving the local server origin", async () => {
		process.env.PORT = "4321";
		const fetchSpy = mockFetchOnce();
		const api = await loadClient({ server: true });

		await api.get("/template/all");

		expect(fetchSpy.mock.calls[0]?.[0]).toBe(
			"http://127.0.0.1:4321/api/backend/template/all",
		);
	});

	it("uses the current deployment origin on Vercel", async () => {
		process.env.VERCEL_URL = "anesis-abc123.vercel.app";
		const fetchSpy = mockFetchOnce();
		const api = await loadClient({ server: true });

		await api.get("/template/all");

		expect(fetchSpy.mock.calls[0]?.[0]).toBe(
			"https://anesis-abc123.vercel.app/api/backend/template/all",
		);
	});

	it("prefers API_PROXY_URL over the same-origin path and trims its trailing slash", async () => {
		process.env.API_PROXY_URL = "http://localhost:4000/";
		const fetchSpy = mockFetchOnce();
		const api = await loadClient({ server: true });

		await api.get("/template/all");

		expect(fetchSpy.mock.calls[0]?.[0]).toBe("http://localhost:4000/template/all");
	});

	it("aborts server-side requests so an unreachable backend cannot stall a render", async () => {
		const fetchSpy = mockFetchOnce();
		const api = await loadClient({ server: true });

		await api.get("/template/all");

		expect(fetchSpy.mock.calls[0]?.[1]?.signal).toBeInstanceOf(AbortSignal);
	});

	it("leaves a caller-supplied signal in place", async () => {
		const controller = new AbortController();
		const fetchSpy = mockFetchOnce();
		const api = await loadClient({ server: true });

		await api.get("/template/all", { signal: controller.signal });

		expect(fetchSpy.mock.calls[0]?.[1]?.signal).toBe(controller.signal);
	});

	it("keeps the path relative in the browser, where it is already same-origin", async () => {
		const fetchSpy = mockFetchOnce();
		const api = await loadClient({ server: false });

		await api.get("/template/all");

		expect(fetchSpy.mock.calls[0]?.[0]).toBe("/api/backend/template/all");
		expect(fetchSpy.mock.calls[0]?.[1]?.signal).toBeUndefined();
	});
});
