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
	parseTemplatesPageResponse: vi.fn(),
	parseTemplateVersionsResponse: vi.fn(),
}));

import { api } from "@/api/client";
import {
	parsePublishTemplateResponse,
	parseTemplateResponse,
	parseTemplateUrlResponse,
	parseTemplatesPageResponse,
	parseTemplateVersionsResponse,
} from "@/lib/api-contracts";
import {
	deleteTemplate,
	fetchMyTemplates,
	fetchTemplate,
	fetchTemplateUrl,
	fetchTemplates,
	fetchTemplateVersions,
	publishTemplate,
	updateTemplate,
	updateTemplateAsOfficial,
	updateTemplateOfficialStatus,
} from "@/services/template";

describe("template services", () => {
	it("fetches all templates through the public endpoint", async () => {
		vi.mocked(api.get).mockResolvedValueOnce({ data: [] });
		vi.mocked(parseTemplatesPageResponse).mockReturnValueOnce({
			data: [{ id: "1" }],
			total: 21,
			page: 2,
			pageSize: 12,
			totalPages: 2,
		} as never);

		await expect(fetchTemplates({ page: 2, pageSize: 12 })).resolves.toEqual({
			data: [{ id: "1" }],
			total: 21,
			page: 2,
			pageSize: 12,
			totalPages: 2,
		});
		expect(api.get).toHaveBeenCalledWith("/template/all?page=2&page_size=12");
		expect(parseTemplatesPageResponse).toHaveBeenCalledWith({ data: [] });
	});

	it("fetches the authenticated user's templates", async () => {
		vi.mocked(api.get).mockResolvedValueOnce({ data: [] });
		vi.mocked(parseTemplatesPageResponse).mockReturnValueOnce({
			data: [{ id: "2" }],
			total: 1,
			page: 1,
			pageSize: 6,
			totalPages: 1,
		} as never);

		await expect(fetchMyTemplates({ page: 1, pageSize: 6 })).resolves.toEqual({
			data: [{ id: "2" }],
			total: 1,
			page: 1,
			pageSize: 6,
			totalPages: 1,
		});
		expect(api.get).toHaveBeenCalledWith("/template/my?page=1&page_size=6");
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

	it("fetches the published versions for a template package", async () => {
		vi.mocked(api.get).mockResolvedValueOnce({
			data: {
				name: "demo-repo",
				versionCount: 2,
				latestVersion: "0.2.0",
				latest: { id: "latest" },
				versions: [{ id: "latest" }, { id: "older" }],
			},
		});
		vi.mocked(parseTemplateVersionsResponse).mockReturnValueOnce([
			{ id: "latest" },
			{ id: "older" },
		] as never);

		await expect(fetchTemplateVersions("demo-repo")).resolves.toEqual([
			{ id: "latest" },
			{ id: "older" },
		]);
		expect(api.get).toHaveBeenCalledWith("/template/demo-repo/versions");
		expect(parseTemplateVersionsResponse).toHaveBeenCalledWith(
			{
				data: {
					name: "demo-repo",
					versionCount: 2,
					latestVersion: "0.2.0",
					latest: { id: "latest" },
					versions: [{ id: "latest" }, { id: "older" }],
				},
			},
			"demo-repo",
		);
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

	it("updates templates as official through the admin endpoint", async () => {
		vi.mocked(api.patch).mockResolvedValueOnce(undefined);

		await expect(
			updateTemplateAsOfficial(
				"https://github.com/demo-owner/demo-repo/tree/main/template",
			),
		).resolves.toBeUndefined();
		expect(api.patch).toHaveBeenCalledWith("/template/official", {
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
