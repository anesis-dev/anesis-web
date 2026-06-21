import { fetchAddonManifest } from "@/services/addon-manifest";

describe("addon-manifest service", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	function stubFetch(response: Partial<Response> & { json?: () => Promise<unknown> }) {
		const fetchMock = vi.fn().mockResolvedValue(response);
		vi.stubGlobal("fetch", fetchMock);
		return fetchMock;
	}

	it("requests the manifest endpoint with an encoded url", async () => {
		const manifest = { id: "drizzle", name: "Drizzle" };
		const fetchMock = stubFetch({
			status: 200,
			ok: true,
			json: () => Promise.resolve(manifest),
		});

		await expect(
			fetchAddonManifest("https://github.com/owner/repo?ref=main"),
		).resolves.toEqual(manifest);
		expect(fetchMock).toHaveBeenCalledWith(
			"/api/addon-manifest?url=https%3A%2F%2Fgithub.com%2Fowner%2Frepo%3Fref%3Dmain",
		);
	});

	it("returns null when the manifest is not found", async () => {
		stubFetch({ status: 404, ok: false });

		await expect(
			fetchAddonManifest("https://github.com/owner/repo"),
		).resolves.toBeNull();
	});

	it("throws the server-provided message on failure", async () => {
		stubFetch({
			status: 500,
			ok: false,
			json: () => Promise.resolve({ message: "boom" }),
		});

		await expect(
			fetchAddonManifest("https://github.com/owner/repo"),
		).rejects.toThrow("boom");
	});

	it("throws a default message when the error payload cannot be parsed", async () => {
		stubFetch({
			status: 500,
			ok: false,
			json: () => Promise.reject(new Error("invalid json")),
		});

		await expect(
			fetchAddonManifest("https://github.com/owner/repo"),
		).rejects.toThrow("Failed to load addon manifest details.");
	});
});
