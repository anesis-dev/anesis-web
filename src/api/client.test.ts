vi.mock("@/config/env", () => ({
	env: {
		apiUrl: "http://api.example.test",
	},
}));

import { ApiError, api } from "@/api/client";

describe("api client", () => {
	afterEach(() => {
		localStorage.clear();
	});

	it("sends auth headers for authenticated get requests", async () => {
		localStorage.setItem("token", "secret-token");
		const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce(
			new Response(JSON.stringify({ id: "1" }), { status: 200 }),
		);

		await expect(api.get("/user/info")).resolves.toEqual({ id: "1" });

		expect(fetchSpy).toHaveBeenCalledWith(
			"http://api.example.test/user/info",
			expect.objectContaining({
				method: "GET",
				credentials: "include",
				headers: expect.objectContaining({
					"Content-Type": "application/json",
					Authorization: "Bearer secret-token",
				}),
			}),
		);
	});

	it("serializes bodies for post requests and merges headers", async () => {
		const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce(
			new Response(JSON.stringify({ ok: true }), { status: 200 }),
		);

		await expect(
			api.post(
				"/template/publish",
				{ url: "https://github.com/demo-owner/demo-repo/tree/main/template" },
				{ headers: { "X-Test": "1" } },
			),
		).resolves.toEqual({ ok: true });

		expect(fetchSpy).toHaveBeenCalledWith(
			"http://api.example.test/template/publish",
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({
					url: "https://github.com/demo-owner/demo-repo/tree/main/template",
				}),
				headers: expect.objectContaining({
					"Content-Type": "application/json",
					"X-Test": "1",
				}),
			}),
		);
	});

	it("returns undefined for empty responses", async () => {
		vi.spyOn(global, "fetch").mockResolvedValueOnce(
			new Response(null, { status: 204 }),
		);

		await expect(api.delete("/template/demo-owner%2Fdemo-repo%400.1.0")).resolves.toBeUndefined();
	});

	it("throws ApiError with backend json messages", async () => {
		vi.spyOn(global, "fetch").mockResolvedValueOnce(
			new Response(JSON.stringify({ message: "Template already exists." }), {
				status: 409,
				statusText: "Conflict",
			}),
		);

		await expect(api.post("/template/publish", {})).rejects.toEqual(
			expect.objectContaining<ApiError>({
				name: "ApiError",
				status: 409,
				message: "Template already exists.",
			}),
		);
	});

	it("falls back to status text when error response is not json", async () => {
		vi.spyOn(global, "fetch").mockResolvedValueOnce(
			new Response("upstream error", {
				status: 502,
				statusText: "Bad Gateway",
			}),
		);

		await expect(api.get("/template/all")).rejects.toEqual(
			expect.objectContaining<ApiError>({
				name: "ApiError",
				status: 502,
				message: "502 Bad Gateway",
			}),
		);
	});
});
