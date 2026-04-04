vi.mock("@/api/client", () => ({
	api: {
		get: vi.fn(),
		post: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn(),
	},
}));

vi.mock("@/lib/api-contracts", () => ({
	parsePublishTemplateResponse: vi.fn(),
	parseTemplateResponse: vi.fn(),
	parseTemplateUrlResponse: vi.fn(),
	parseTemplatesResponse: vi.fn(),
}));

import { api } from "@/api/client";
import {
	parsePublishTemplateResponse,
	parseTemplateResponse,
	parseTemplateUrlResponse,
	parseTemplatesResponse,
} from "@/lib/api-contracts";
import {
	deleteTemplate,
	fetchMyTemplates,
	fetchTemplate,
	fetchTemplateUrl,
	fetchTemplates,
	publishTemplate,
	updateTemplate,
} from "@/services/template";

describe("template services", () => {
	it("fetches all templates through the public endpoint", async () => {
		vi.mocked(api.get).mockResolvedValueOnce({ data: [] });
		vi.mocked(parseTemplatesResponse).mockReturnValueOnce([{ id: "1" }] as never);

		await expect(fetchTemplates()).resolves.toEqual([{ id: "1" }]);
		expect(api.get).toHaveBeenCalledWith("/template/all");
		expect(parseTemplatesResponse).toHaveBeenCalledWith({ data: [] });
	});

	it("fetches the authenticated user's templates", async () => {
		vi.mocked(api.get).mockResolvedValueOnce({ data: [] });
		vi.mocked(parseTemplatesResponse).mockReturnValueOnce([{ id: "2" }] as never);

		await expect(fetchMyTemplates()).resolves.toEqual([{ id: "2" }]);
		expect(api.get).toHaveBeenCalledWith("/template/my");
	});

	it("fetches a single template using an encoded template ref", async () => {
		vi.mocked(api.get).mockResolvedValueOnce({ data: { id: "3" } });
		vi.mocked(parseTemplateResponse).mockReturnValueOnce({ id: "3" } as never);

		await expect(fetchTemplate("demo-repo@0.1.0")).resolves.toEqual({
			id: "3",
		});
		expect(api.get).toHaveBeenCalledWith("/template/demo-repo%400.1.0");
	});

	it("fetches the template api url with an encoded ref", async () => {
		vi.mocked(api.get).mockResolvedValueOnce({ data: { url: "https://api.example.test/template/demo" } });
		vi.mocked(parseTemplateUrlResponse).mockReturnValueOnce({
			url: "https://api.example.test/template/demo",
		});

		await expect(fetchTemplateUrl("demo-repo@0.1.0")).resolves.toEqual({
			url: "https://api.example.test/template/demo",
		});
		expect(api.get).toHaveBeenCalledWith("/template/demo-repo%400.1.0/url");
	});

	it("publishes template urls through the publish endpoint", async () => {
		vi.mocked(api.post).mockResolvedValueOnce({ message: "ok" });
		vi.mocked(parsePublishTemplateResponse).mockReturnValueOnce({
			message: "ok",
			name: "demo-repo",
		});

		await expect(
			publishTemplate("https://github.com/demo-owner/demo-repo/tree/main/template"),
		).resolves.toEqual({
			message: "ok",
			name: "demo-repo",
		});
		expect(api.post).toHaveBeenCalledWith("/template/publish", {
			url: "https://github.com/demo-owner/demo-repo/tree/main/template",
		});
	});

	it("updates templates by source url", async () => {
		vi.mocked(api.patch).mockResolvedValueOnce(undefined);

		await expect(
			updateTemplate("https://github.com/demo-owner/demo-repo/tree/main/template"),
		).resolves.toBeUndefined();
		expect(api.patch).toHaveBeenCalledWith("/template/", {
			url: "https://github.com/demo-owner/demo-repo/tree/main/template",
		});
	});

	it("deletes templates using the encoded ref", async () => {
		vi.mocked(api.delete).mockResolvedValueOnce(undefined);

		await expect(deleteTemplate("demo-repo@0.1.0")).resolves.toBeUndefined();
		expect(api.delete).toHaveBeenCalledWith("/template/demo-repo%400.1.0");
	});
});
