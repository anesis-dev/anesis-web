vi.mock("@/config/env", () => ({
	env: {
		apiUrl: "http://api.example.test",
	},
}));

import { fetchTemplateSchema } from "@/services/schema";

describe("schema service", () => {
	it("loads and formats the template schema", async () => {
		const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce(
			new Response(JSON.stringify({ title: "oxide.template" }), { status: 200 }),
		);

		await expect(fetchTemplateSchema()).resolves.toBe(
			'{\n  "title": "oxide.template"\n}',
		);

		expect(fetchSpy).toHaveBeenCalledWith(
			"http://api.example.test/schema/oxide.template.schema.json",
			{
				next: { revalidate: 60 * 60 },
			},
		);
	});

	it("throws a clear error when the schema endpoint fails", async () => {
		vi.spyOn(global, "fetch").mockResolvedValueOnce(
			new Response(null, { status: 503, statusText: "Service Unavailable" }),
		);

		await expect(fetchTemplateSchema()).rejects.toThrow(
			"Failed to load schema (503 Service Unavailable).",
		);
	});
});
