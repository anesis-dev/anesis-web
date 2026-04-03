import {
	parseGitHubUserResponse,
	parseMeResponse,
	parseTemplateResponse,
	parseTemplateUrlResponse,
	parseTemplatesResponse,
	parseUsersResponse,
} from "@/lib/api-contracts";
import { mockGitHubUser, mockTemplate, mockUser } from "@/test/fixtures";

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

	it("rejects invalid template payloads", () => {
		expect(() => parseTemplatesResponse({})).toThrow(/must be an array/);
		expect(() =>
			parseTemplateResponse({
				...mockTemplate,
				commit_sha: undefined,
			}),
		).toThrow(/commit_sha must be a string/);
	});

	it("parses valid github user payloads", () => {
		expect(parseGitHubUserResponse(mockGitHubUser)).toEqual(mockGitHubUser);
	});
});
