import { ApiError, api } from "@/api/client";
import {
	fetchGitHubUser,
	fetchTemplateReadme,
} from "@/services/github";
import { mockGitHubUser } from "@/test/fixtures";

vi.mock("@/api/client", () => ({
	api: {
		get: vi.fn(),
	},
	ApiError: class ApiError extends Error {
		constructor(
			public readonly status: number,
			message: string,
		) {
			super(message);
		}
	},
}));

describe("github services", () => {
	it("fetches github users through the backend proxy", async () => {
		vi.mocked(api.get).mockResolvedValueOnce(mockGitHubUser);

		await expect(fetchGitHubUser("octocat")).resolves.toEqual(mockGitHubUser);
		expect(api.get).toHaveBeenCalledWith(
			"/github/proxy?url=https%3A%2F%2Fapi.github.com%2Fusers%2Foctocat",
		);
	});

	it("converts 404 proxy responses into a user-friendly error", async () => {
		vi.mocked(api.get).mockRejectedValueOnce(
			new ApiError(404, "Not Found"),
		);

		await expect(fetchGitHubUser("missing-user")).rejects.toThrow(
			"GitHub user not found: missing-user",
		);
	});

	it("falls back to the public github api when the backend proxy requires auth", async () => {
		vi.mocked(api.get).mockRejectedValueOnce(
			new ApiError(401, "Unauthorized"),
		);
		vi.spyOn(global, "fetch").mockResolvedValueOnce(
			new Response(JSON.stringify(mockGitHubUser), { status: 200 }),
		);

		await expect(fetchGitHubUser("octocat")).resolves.toEqual(mockGitHubUser);
		expect(global.fetch).toHaveBeenCalledWith(
			"https://api.github.com/users/octocat",
			{
				headers: {
					Accept: "application/vnd.github+json",
				},
			},
		);
	});

	it("fetches template readme through the internal api route", async () => {
		vi.spyOn(global, "fetch").mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					content: "# Demo",
					fileName: "README.md",
				}),
				{ status: 200 },
			),
		);

		await expect(
			fetchTemplateReadme(
				"https://github.com/demo-owner/demo-repo/tree/main/template",
			),
		).resolves.toEqual({
			content: "# Demo",
			fileName: "README.md",
		});
	});

	it("surfaces template readme api errors", async () => {
		vi.spyOn(global, "fetch").mockResolvedValueOnce(
			new Response(JSON.stringify({ message: "Broken README" }), { status: 500 }),
		);

		await expect(fetchTemplateReadme("https://github.com/demo/repo")).rejects.toThrow(
			"Broken README",
		);
	});
});
