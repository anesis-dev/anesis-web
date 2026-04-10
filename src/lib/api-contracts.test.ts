import {
	parseAddonUrlResponse,
	parseAddonsResponse,
	parseGitHubUserResponse,
	parseMeResponse,
	parsePublishAddonResponse,
	parseTemplateResponse,
	parseTemplateUrlResponse,
	parseTemplatesResponse,
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
		expect(parseTemplateUrlResponse({ url: "https://api.github.com/demo" })).toEqual(
			{
				url: "https://api.github.com/demo",
			},
		);
	});

	it("parses valid addon payloads", () => {
		expect(parseAddonsResponse([mockAddon])).toEqual([mockAddon]);
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
			parseTemplateResponse({
				...mockTemplate,
				commit_sha: undefined,
			}),
		).toThrow(/commit_sha must be a string/);
	});

	it("rejects invalid addon payloads", () => {
		expect(() => parseAddonsResponse({})).toThrow(/must be an array/);
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
