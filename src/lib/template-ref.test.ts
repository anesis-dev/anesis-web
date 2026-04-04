import { getTemplateHref, getTemplateRef } from "@/lib/template-ref";
import { mockTemplate } from "@/test/fixtures";

describe("template-ref", () => {
	it("builds canonical template references", () => {
		expect(getTemplateRef(mockTemplate)).toBe("demo-repo@0.1.0");
	});

	it("builds template details hrefs", () => {
		expect(getTemplateHref(mockTemplate)).toBe(
			"/templates/demo-repo%400.1.0",
		);
	});

	it("encodes legacy slash-delimited refs into a single details route segment", () => {
		expect(getTemplateHref({ name: "demo-owner/demo-repo", version: "1.0.0" })).toBe(
			"/templates/demo-owner%2Fdemo-repo%401.0.0",
		);
	});

	it("falls back to templates page when name or version is missing", () => {
		expect(getTemplateHref({ name: "", version: "1.0.0" })).toBe(
			"/templates",
		);
		expect(getTemplateHref({ name: "demo-repo", version: "" })).toBe("/templates");
	});
});
