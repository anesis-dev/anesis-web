import { createGitHubReadmeResolver } from "@/lib/github-readme-links";

const SOURCE = "https://github.com/owner/repo/tree/main/docs/README.md";

describe("createGitHubReadmeResolver", () => {
	it("returns null without a source url", () => {
		expect(createGitHubReadmeResolver(undefined)).toBeNull();
	});

	it("returns null when the url has no branch", () => {
		expect(
			createGitHubReadmeResolver("https://github.com/owner/repo"),
		).toBeNull();
	});

	it("returns null for a non-github url", () => {
		expect(
			createGitHubReadmeResolver("https://gitlab.com/owner/repo/tree/main"),
		).toBeNull();
	});

	describe("resolveLink", () => {
		const resolver = createGitHubReadmeResolver(SOURCE)!;

		it("resolves a relative path against the readme directory", () => {
			expect(resolver.resolveLink("guide.md")).toBe(
				"https://github.com/owner/repo/blob/main/docs/guide.md",
			);
		});

		it("resolves parent traversal", () => {
			expect(resolver.resolveLink("../top.md")).toBe(
				"https://github.com/owner/repo/blob/main/top.md",
			);
		});

		it("resolves an absolute repository path", () => {
			expect(resolver.resolveLink("/src/index.ts")).toBe(
				"https://github.com/owner/repo/blob/main/src/index.ts",
			);
		});

		it("preserves query and hash suffixes", () => {
			expect(resolver.resolveLink("guide.md#install")).toBe(
				"https://github.com/owner/repo/blob/main/docs/guide.md#install",
			);
		});

		it("leaves external links, anchors and queries untouched", () => {
			expect(resolver.resolveLink("https://example.com")).toBe(
				"https://example.com",
			);
			expect(resolver.resolveLink("#section")).toBe("#section");
			expect(resolver.resolveLink("")).toBe("");
		});
	});

	describe("resolveImage", () => {
		const resolver = createGitHubReadmeResolver(SOURCE)!;

		it("rewrites relative images to raw.githubusercontent.com", () => {
			expect(resolver.resolveImage("diagram.png")).toBe(
				"https://raw.githubusercontent.com/owner/repo/main/docs/diagram.png",
			);
		});

		it("leaves absolute external images untouched", () => {
			expect(resolver.resolveImage("https://cdn.example.com/a.png")).toBe(
				"https://cdn.example.com/a.png",
			);
		});
	});

	it("honors an explicit readme path over the url path", () => {
		const resolver = createGitHubReadmeResolver(
			"https://github.com/owner/repo/tree/main",
			"packages/app/README.md",
		)!;

		expect(resolver.resolveLink("CHANGELOG.md")).toBe(
			"https://github.com/owner/repo/blob/main/packages/app/CHANGELOG.md",
		);
	});
});
