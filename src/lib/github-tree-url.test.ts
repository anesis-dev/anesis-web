import {
	getGitHubContentsApiUrl,
	parseGitHubTreeUrl,
} from "@/lib/github-tree-url";

describe("github-tree-url", () => {
	it("parses root repository urls", () => {
		expect(parseGitHubTreeUrl("https://github.com/owner/repo")).toEqual({
			owner: "owner",
			repo: "repo",
		});
	});

	it("parses tree urls with branch and nested path", () => {
		expect(
			parseGitHubTreeUrl(
				"https://github.com/owner/repo/tree/main/templates/web",
			),
		).toEqual({
			owner: "owner",
			repo: "repo",
			branch: "main",
			path: "templates/web",
		});
	});

	it("builds github contents api urls", () => {
		expect(
			getGitHubContentsApiUrl({
				owner: "owner",
				repo: "repo",
				branch: "main",
				path: "templates/web",
			}),
		).toBe(
			"https://api.github.com/repos/owner/repo/contents/templates/web?ref=main",
		);
	});

	it("rejects non github urls", () => {
		expect(() => parseGitHubTreeUrl("https://gitlab.com/owner/repo")).toThrow(
			"Not a GitHub repository URL.",
		);
	});

	it("rejects unsupported github formats", () => {
		expect(() =>
			parseGitHubTreeUrl("https://github.com/owner/repo/issues"),
		).toThrow("Unsupported GitHub URL format.");
	});
});
