import {
	validateAddonPublishUrl,
	validateTemplatePublishUrl,
} from "@/lib/template-url";

describe("validateTemplatePublishUrl", () => {
	it("requires a url", () => {
		expect(validateTemplatePublishUrl("")).toBe("GitHub URL is required.");
	});

	it("rejects invalid urls", () => {
		expect(validateTemplatePublishUrl("not-a-url")).toBe(
			"Enter a valid absolute URL.",
		);
	});

	it("rejects non github urls", () => {
		expect(validateTemplatePublishUrl("https://gitlab.com/owner/repo")).toBe(
			"Only GitHub repository URLs are supported.",
		);
	});

	it("rejects repository urls without a tree path", () => {
		expect(
			validateTemplatePublishUrl("https://github.com/owner/repo"),
		).toBe("Use a GitHub /tree/ URL that points to the template directory.");
	});

	it("accepts valid github tree urls", () => {
		expect(
			validateTemplatePublishUrl(
				"https://github.com/owner/repo/tree/main/templates/web",
			),
		).toBeNull();
	});
});

describe("validateAddonPublishUrl", () => {
	it("uses addon-specific guidance for invalid tree urls", () => {
		expect(validateAddonPublishUrl("https://github.com/owner/repo")).toBe(
			"Use a GitHub /tree/ URL that points to the addon directory.",
		);
	});
});
