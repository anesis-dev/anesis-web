import {
	compareTemplateVersionsDesc,
	getLatestTemplates,
	getTemplateVersionGroup,
	groupTemplatesByName,
} from "@/lib/template-versions";
import { createTemplate } from "@/test/fixtures";

describe("template-versions", () => {
	it("sorts semantic versions descending", () => {
		const versions = [
			createTemplate({ id: "v1", version: "0.9.0" }),
			createTemplate({ id: "v2", version: "0.10.0" }),
			createTemplate({ id: "v3", version: "1.0.0" }),
		].sort(compareTemplateVersionsDesc);

		expect(versions.map((template) => template.version)).toEqual([
			"1.0.0",
			"0.10.0",
			"0.9.0",
		]);
	});

	it("groups templates by name and exposes the latest version", () => {
		const templates = [
			createTemplate({ id: "old", name: "react-vite", version: "0.2.0" }),
			createTemplate({ id: "other", name: "next", version: "0.1.0" }),
			createTemplate({ id: "new", name: "react-vite", version: "0.3.0" }),
		];

		const groups = groupTemplatesByName(templates);
		const reactGroup = getTemplateVersionGroup(templates, "react-vite");

		expect(groups).toHaveLength(2);
		expect(reactGroup?.latest.version).toBe("0.3.0");
		expect(reactGroup?.versions.map((template) => template.version)).toEqual([
			"0.3.0",
			"0.2.0",
		]);
		expect(getLatestTemplates(templates).map((template) => template.id)).toEqual([
			"new",
			"other",
		]);
	});
});
