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
	updateTemplateOfficialStatus,
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

	it("fetches the latest template when only the slug is provided", async () => {
		vi.mocked(api.get).mockResolvedValueOnce({ data: { id: "4" } });
		vi.mocked(parseTemplateResponse).mockReturnValueOnce({ id: "4" } as never);

		await expect(fetchTemplate("demo-repo")).resolves.toEqual({
			id: "4",
		});
		expect(api.get).toHaveBeenCalledWith("/template/demo-repo");
	});

	it("fetches the template archive metadata with an encoded ref", async () => {
		vi.mocked(api.get).mockResolvedValueOnce({
			data: {
				archive_url: "https://api.example.test/template/demo.tar.gz",
				commit_sha: "abc123",
				subdir: "template",
			},
		});
		vi.mocked(parseTemplateUrlResponse).mockReturnValueOnce({
			archive_url: "https://api.example.test/template/demo.tar.gz",
			commit_sha: "abc123",
			subdir: "template",
		} as never);

		await expect(fetchTemplateUrl("demo-repo@0.1.0")).resolves.toEqual({
			archive_url: "https://api.example.test/template/demo.tar.gz",
			commit_sha: "abc123",
			subdir: "template",
		});
		expect(api.get).toHaveBeenCalledWith("/template/demo-repo%400.1.0/url");
	});

	it("fetches the latest template archive metadata when only the slug is provided", async () => {
		vi.mocked(api.get).mockResolvedValueOnce({
			data: {
				archive_url: "https://api.example.test/template/latest.tar.gz",
				commit_sha: "def456",
				subdir: undefined,
			},
		});
		vi.mocked(parseTemplateUrlResponse).mockReturnValueOnce({
			archive_url: "https://api.example.test/template/latest.tar.gz",
			commit_sha: "def456",
			subdir: undefined,
		} as never);

		await expect(fetchTemplateUrl("demo-repo")).resolves.toEqual({
			archive_url: "https://api.example.test/template/latest.tar.gz",
			commit_sha: "def456",
			subdir: undefined,
		});
		expect(api.get).toHaveBeenCalledWith("/template/demo-repo/url");
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
		expect(api.patch).toHaveBeenCalledWith("/template", {
			url: "https://github.com/demo-owner/demo-repo/tree/main/template",
		});
	});

	it("deletes templates using the encoded ref", async () => {
		vi.mocked(api.delete).mockResolvedValueOnce(undefined);

		await expect(deleteTemplate("demo-repo@0.1.0")).resolves.toBeUndefined();
		expect(api.delete).toHaveBeenCalledWith("/template/demo-repo%400.1.0");
	});

	it("rejects deleting templates without an explicit version", async () => {
		await expect(deleteTemplate("demo-repo")).rejects.toThrow(
			"Deleting a template requires an explicit version.",
		);
		expect(api.delete).not.toHaveBeenCalled();
	});

	it("updates template official status through the admin endpoint", async () => {
		vi.mocked(api.patch).mockResolvedValueOnce(undefined);

		await expect(
			updateTemplateOfficialStatus("template-id", true),
		).resolves.toBeUndefined();
		expect(api.patch).toHaveBeenCalledWith(
			"/template/template-id/official?official=true",
		);
	});
});
