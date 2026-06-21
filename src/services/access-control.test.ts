vi.mock("@/api/client", () => ({
	api: {
		get: vi.fn(),
		post: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn(),
	},
}));

vi.mock("@/lib/api-contracts", () => ({
	parseTemplateAccessListResponse: vi.fn(),
	parseAddonAccessListResponse: vi.fn(),
}));

import { api } from "@/api/client";
import {
	parseAddonAccessListResponse,
	parseTemplateAccessListResponse,
} from "@/lib/api-contracts";
import {
	fetchAddonAccess,
	fetchTemplateAccess,
	grantAddonAccess,
	grantTemplateAccess,
	removeAddonFromOrganization,
	removeTemplateFromOrganization,
	revokeAddonAccess,
	revokeTemplateAccess,
	updateAddonVisibility,
	updateTemplateVisibility,
} from "@/services/access-control";

describe("access-control services", () => {
	describe("templates", () => {
		it("updates visibility with normalized null defaults", async () => {
			vi.mocked(api.patch).mockResolvedValueOnce(undefined);

			await updateTemplateVisibility("t 1", "public");
			expect(api.patch).toHaveBeenCalledWith("/template/t%201/visibility", {
				visibility: "public",
				repo_credential_id: null,
				organization_id: null,
			});
		});

		it("updates visibility forwarding credential and organization", async () => {
			vi.mocked(api.patch).mockResolvedValueOnce(undefined);

			await updateTemplateVisibility("t-1", "private", "cred-1", "org-1");
			expect(api.patch).toHaveBeenCalledWith("/template/t-1/visibility", {
				visibility: "private",
				repo_credential_id: "cred-1",
				organization_id: "org-1",
			});
		});

		it("removes a template from its organization", async () => {
			vi.mocked(api.delete).mockResolvedValueOnce(undefined);

			await removeTemplateFromOrganization("t-1");
			expect(api.delete).toHaveBeenCalledWith("/template/t-1/organization");
		});

		it("fetches the access list", async () => {
			vi.mocked(api.get).mockResolvedValueOnce([]);
			vi.mocked(parseTemplateAccessListResponse).mockReturnValueOnce([
				{ id: "a-1" },
			] as never);

			await expect(fetchTemplateAccess("t-1")).resolves.toEqual([{ id: "a-1" }]);
			expect(api.get).toHaveBeenCalledWith("/template/t-1/access");
		});

		it("grants access and returns the first parsed entry", async () => {
			vi.mocked(api.post).mockResolvedValueOnce({ id: "a-1" });
			vi.mocked(parseTemplateAccessListResponse).mockReturnValueOnce([
				{ id: "a-1" },
			] as never);

			await expect(
				grantTemplateAccess("t-1", "user", "user-2"),
			).resolves.toEqual({ id: "a-1" });
			expect(api.post).toHaveBeenCalledWith("/template/t-1/access", {
				grantee_type: "user",
				grantee_id: "user-2",
			});
			expect(parseTemplateAccessListResponse).toHaveBeenCalledWith([
				{ id: "a-1" },
			]);
		});

		it("revokes access", async () => {
			vi.mocked(api.delete).mockResolvedValueOnce(undefined);

			await revokeTemplateAccess("t-1", "user-2");
			expect(api.delete).toHaveBeenCalledWith("/template/t-1/access/user-2");
		});
	});

	describe("addons", () => {
		it("updates visibility with normalized null defaults", async () => {
			vi.mocked(api.patch).mockResolvedValueOnce(undefined);

			await updateAddonVisibility("a-1", "public");
			expect(api.patch).toHaveBeenCalledWith("/addon/a-1/visibility", {
				visibility: "public",
				repo_credential_id: null,
				organization_id: null,
			});
		});

		it("removes an addon from its organization", async () => {
			vi.mocked(api.delete).mockResolvedValueOnce(undefined);

			await removeAddonFromOrganization("a-1");
			expect(api.delete).toHaveBeenCalledWith("/addon/a-1/organization");
		});

		it("fetches the access list", async () => {
			vi.mocked(api.get).mockResolvedValueOnce([]);
			vi.mocked(parseAddonAccessListResponse).mockReturnValueOnce([] as never);

			await fetchAddonAccess("a-1");
			expect(api.get).toHaveBeenCalledWith("/addon/a-1/access");
		});

		it("grants access and returns the first parsed entry", async () => {
			vi.mocked(api.post).mockResolvedValueOnce({ id: "x-1" });
			vi.mocked(parseAddonAccessListResponse).mockReturnValueOnce([
				{ id: "x-1" },
			] as never);

			await expect(grantAddonAccess("a-1", "org", "org-1")).resolves.toEqual({
				id: "x-1",
			});
			expect(api.post).toHaveBeenCalledWith("/addon/a-1/access", {
				grantee_type: "org",
				grantee_id: "org-1",
			});
		});

		it("revokes access", async () => {
			vi.mocked(api.delete).mockResolvedValueOnce(undefined);

			await revokeAddonAccess("a-1", "org-1");
			expect(api.delete).toHaveBeenCalledWith("/addon/a-1/access/org-1");
		});
	});
});
