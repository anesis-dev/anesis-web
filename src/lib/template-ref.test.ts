import { getTemplateHref, getTemplateRef } from "@/lib/template-ref";
import { mockTemplate } from "@/test/fixtures";

describe("template-ref", () => {
	it("builds canonical template references", () => {
		expect(getTemplateRef(mockTemplate)).toBe("demo-owner/demo-repo@0.1.0");
	});

	it("builds template details hrefs", () => {
		expect(getTemplateHref(mockTemplate)).toBe(
			"/templates/demo-owner/demo-repo@0.1.0",
		);
	});

	it("falls back to templates page for malformed names", () => {
		expect(getTemplateHref({ name: "invalid-name", version: "1.0.0" })).toBe(
			"/templates",
		);
	});
});
