vi.mock("@/api/client", () => ({
	api: {
		get: vi.fn(),
		post: vi.fn(),
		delete: vi.fn(),
	},
}));

vi.mock("@/lib/api-contracts", () => ({
	parseRepoCredentialsResponse: vi.fn(),
}));

import { api } from "@/api/client";
import { parseRepoCredentialsResponse } from "@/lib/api-contracts";
import {
	createRepoCredential,
	deleteRepoCredential,
	fetchRepoCredentials,
} from "@/services/repo-credential";

describe("repo credential services", () => {
	it("fetches repo credentials through the parser", async () => {
		vi.mocked(api.get).mockResolvedValueOnce([]);
		vi.mocked(parseRepoCredentialsResponse).mockReturnValueOnce([
			{ id: "c-1" },
		] as never);

		await expect(fetchRepoCredentials()).resolves.toEqual([{ id: "c-1" }]);
		expect(api.get).toHaveBeenCalledWith("/repo-credentials");
		expect(parseRepoCredentialsResponse).toHaveBeenCalledWith([]);
	});

	it("creates a credential and returns the first parsed entry", async () => {
		const payload = {
			name: "gh",
			provider: "github",
			credential_type: "pat",
			token: "secret",
		};
		vi.mocked(api.post).mockResolvedValueOnce({ id: "c-1" });
		vi.mocked(parseRepoCredentialsResponse).mockReturnValueOnce([
			{ id: "c-1" },
		] as never);

		await expect(createRepoCredential(payload)).resolves.toEqual({ id: "c-1" });
		expect(api.post).toHaveBeenCalledWith("/repo-credentials", payload);
		expect(parseRepoCredentialsResponse).toHaveBeenCalledWith([{ id: "c-1" }]);
	});

	it("deletes a credential with id encoding", async () => {
		vi.mocked(api.delete).mockResolvedValueOnce(undefined);

		await expect(deleteRepoCredential("c 1")).resolves.toBeUndefined();
		expect(api.delete).toHaveBeenCalledWith("/repo-credentials/c%201");
	});
});
