import {
	parseAddonUrlResponse,
	parseAddonsResponse,
	parseAddonsPageResponse,
	parseGitHubUserResponse,
	parseMeResponse,
	parsePublishAddonResponse,
	parseTemplateResponse,
	parseTemplateUrlResponse,
	parseTemplatesResponse,
	parseTemplatesPageResponse,
	parseTemplateVersionsResponse,
	parseUsersResponse,
} from "@/lib/api-contracts";
import {
	mockAddon,
	mockGitHubUser,
	mockTemplate,
	mockUser,
} from "@/test/fixtures";

describe("api-contracts", () => {
	it("parses valid user payloads", () => {
		expect(parseMeResponse(mockUser)).toEqual(mockUser);
		expect(parseUsersResponse([mockUser])).toEqual([mockUser]);
	});

	it("rejects invalid user roles", () => {
		expect(() =>
			parseMeResponse({
				...mockUser,
				role: "owner",
			}),
		).toThrow(/role must be "admin" or "user"/);
	});

	it("parses valid template payloads", () => {
		expect(parseTemplateResponse(mockTemplate)).toEqual(mockTemplate);
		expect(parseTemplatesResponse([mockTemplate])).toEqual([mockTemplate]);
		expect(
			parseTemplatesPageResponse({
				data: [mockTemplate],
				total: 21,
				page: 2,
				page_size: 12,
				total_pages: 2,
			}),
		).toEqual({
			data: [mockTemplate],
			total: 21,
			page: 2,
			pageSize: 12,
			totalPages: 2,
		});
		expect(
			parseTemplateUrlResponse({
				archive_url: "https://api.github.com/demo.tar.gz",
				commit_sha: "abc123",
				subdir: "template",
			}),
		).toEqual({
			archive_url: "https://api.github.com/demo.tar.gz",
			commit_sha: "abc123",
			subdir: "template",
		});
	});

	it("parses current template payloads when updated_at is omitted", () => {
		const currentTemplatePayload = {
			id: "5a4564c0-a749-4e5b-91d8-6812d17dcb8b",
			name: "next",
			verison: "0.3.1",
			owner_id: "6ffde3a6-e277-4559-9e94-bcd4765a8d1f",
			official: true,
			info: {
				repo_url: "https://github.com/oxide-cli/templates/tree/main/ts/next",
				author: {
					name: "Maksym Zhuk",
					github: "oxide-cli",
				},
				specialization: "fullstack",
				scope: "web",
				technologies: ["next"],
				languages: ["typescript"],
				type: "base",
				displayName: "Next",
				description:
					"A modern fullstack Next.js template, ready for scalable web applications.",
				tags: ["next", "nextjs", "react", "typescript", "fullstack", "ssr", "web"],
			},
			created_at: "2026-04-23T14:51:29.355675Z",
		};

		expect(parseTemplateResponse(currentTemplatePayload)).toEqual({
			id: "5a4564c0-a749-4e5b-91d8-6812d17dcb8b",
			name: "next",
			owner_id: "6ffde3a6-e277-4559-9e94-bcd4765a8d1f",
			url: "https://github.com/oxide-cli/templates/tree/main/ts/next",
			official: true,
			commit_sha: "",
			version: "0.3.1",
			created_at: "2026-04-23T14:51:29.355675Z",
			updated_at: "2026-04-23T14:51:29.355675Z",
			config: {
				$schema: "",
				name: "next",
				version: "0.3.1",
				oxideVersion: "",
				author: {
					name: "Maksym Zhuk",
					github: "oxide-cli",
				},
				repository: {
					type: "github",
					url: "https://github.com/oxide-cli/templates/tree/main/ts/next",
					release: "",
				},
				specialization: "fullstack",
				scope: "web",
				technologies: ["next"],
				languages: ["typescript"],
				type: "base",
				metadata: {
					displayName: "Next",
					description:
						"A modern fullstack Next.js template, ready for scalable web applications.",
					tags: ["next", "nextjs", "react", "typescript", "fullstack", "ssr", "web"],
				},
			},
		});

		expect(
			parseTemplatesResponse([
				{
					name: "next",
					versionCount: 3,
					latest: currentTemplatePayload,
				},
			]),
		).toEqual([
			expect.objectContaining({
				name: "next",
				version: "0.3.1",
				versionCount: 3,
				updated_at: "2026-04-23T14:51:29.355675Z",
			}),
		]);

		expect(
			parseTemplateVersionsResponse(
				{
					name: "next",
					latestVersion: "0.3.1",
					versionCount: 3,
					latest: currentTemplatePayload,
					versions: [
						currentTemplatePayload,
						{
							...currentTemplatePayload,
							id: "version-2",
							verison: "0.3.0",
						},
					],
				},
				"next",
			),
		).toEqual([
			expect.objectContaining({
				name: "next",
				version: "0.3.1",
				versionCount: 3,
			}),
			expect.objectContaining({
				name: "next",
				version: "0.3.0",
				versionCount: 3,
			}),
		]);
	});

	it("parses valid addon payloads", () => {
		expect(parseAddonsResponse([mockAddon])).toEqual([mockAddon]);
		expect(
			parseAddonsPageResponse({
				data: [mockAddon],
				total: 35,
				page: 3,
				page_size: 10,
				total_pages: 4,
			}),
		).toEqual({
			data: [mockAddon],
			total: 35,
			page: 3,
			pageSize: 10,
			totalPages: 4,
		});
		expect(
			parsePublishAddonResponse({
				message: "published",
				addon_id: "drizzle",
			}),
		).toEqual({
			message: "published",
			addon_id: "drizzle",
		});
		expect(
			parseAddonUrlResponse({
				archive_url: "https://api.example.test/archive.tar.gz",
				commit_sha: "abc123",
			}),
		).toEqual({
			archive_url: "https://api.example.test/archive.tar.gz",
			commit_sha: "abc123",
		});
	});

	it("rejects invalid template payloads", () => {
		expect(() => parseTemplatesResponse({})).toThrow(/must be an array/);
		expect(() =>
			parseTemplatesPageResponse({
				data: [mockTemplate],
				total: 1,
				page: 1,
				page_size: "20",
				total_pages: 1,
			}),
		).toThrow(/page_size must be a number/);
		expect(() =>
			parseTemplateResponse({
				...mockTemplate,
				commit_sha: undefined,
			}),
		).toThrow(/commit_sha must be a string/);
		expect(() => parseTemplateUrlResponse({ url: "https://old.example.test" })).toThrow(
			/archive_url must be a string/,
		);
	});

	it("rejects invalid addon payloads", () => {
		expect(() => parseAddonsResponse({})).toThrow(/must be an array/);
		expect(() =>
			parseAddonsPageResponse({
				data: {},
				total: 1,
				page: 1,
				page_size: 20,
				total_pages: 1,
			}),
		).toThrow(/data must be an array/);
		expect(() =>
			parseAddonsResponse([
				{
					...mockAddon,
					addon_id: undefined,
				},
			]),
		).toThrow(/addon_id must be a string/);
	});

	it("parses valid github user payloads", () => {
		expect(parseGitHubUserResponse(mockGitHubUser)).toEqual(mockGitHubUser);
	});
});
