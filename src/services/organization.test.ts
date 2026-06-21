vi.mock("@/api/client", () => ({
	api: {
		get: vi.fn(),
		post: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn(),
	},
}));

vi.mock("@/lib/api-contracts", () => ({
	parseOrganizationResponse: vi.fn(),
	parseOrganizationsResponse: vi.fn(),
	parseOrgInvitationsResponse: vi.fn(),
	parseOrgMembersResponse: vi.fn(),
	parseInvitationResponse: vi.fn(),
	parseTemplatesPageResponse: vi.fn(),
	parseAddonsPageResponse: vi.fn(),
}));

import { api } from "@/api/client";
import {
	parseAddonsPageResponse,
	parseInvitationResponse,
	parseOrgInvitationsResponse,
	parseOrgMembersResponse,
	parseOrganizationResponse,
	parseOrganizationsResponse,
	parseTemplatesPageResponse,
} from "@/lib/api-contracts";
import {
	acceptInvitation,
	createOrgInvitation,
	createOrganization,
	declineInvitation,
	deleteOrganization,
	fetchOrgAddons,
	fetchOrgInvitations,
	fetchOrgMembers,
	fetchOrgTemplates,
	fetchOrganization,
	fetchOrganizationBySlug,
	fetchOrganizations,
	removeOrgMember,
	revokeOrgInvitation,
	transferOrgOwnership,
	updateOrgMemberRole,
	updateOrganization,
} from "@/services/organization";

describe("organization services", () => {
	it("fetches all organizations", async () => {
		vi.mocked(api.get).mockResolvedValueOnce({ data: [] });
		vi.mocked(parseOrganizationsResponse).mockReturnValueOnce([
			{ id: "org-1" },
		] as never);

		await expect(fetchOrganizations()).resolves.toEqual([{ id: "org-1" }]);
		expect(api.get).toHaveBeenCalledWith("/organizations");
		expect(parseOrganizationsResponse).toHaveBeenCalledWith({ data: [] });
	});

	it("creates an organization", async () => {
		const payload = { name: "Acme", slug: "acme", description: "x" };
		vi.mocked(api.post).mockResolvedValueOnce({ id: "org-1" });
		vi.mocked(parseOrganizationResponse).mockReturnValueOnce({
			id: "org-1",
		} as never);

		await expect(createOrganization(payload)).resolves.toEqual({ id: "org-1" });
		expect(api.post).toHaveBeenCalledWith("/organizations", payload);
	});

	it("fetches a single organization by id with encoding", async () => {
		vi.mocked(api.get).mockResolvedValueOnce({});
		vi.mocked(parseOrganizationResponse).mockReturnValueOnce({
			id: "org 1",
		} as never);

		await fetchOrganization("org 1");
		expect(api.get).toHaveBeenCalledWith("/organizations/org%201");
	});

	it("fetches an organization by slug with encoding", async () => {
		vi.mocked(api.get).mockResolvedValueOnce({});
		vi.mocked(parseOrganizationResponse).mockReturnValueOnce({} as never);

		await fetchOrganizationBySlug("my org");
		expect(api.get).toHaveBeenCalledWith("/organizations/by-slug/my%20org");
	});

	it("updates an organization", async () => {
		vi.mocked(api.patch).mockResolvedValueOnce({});
		vi.mocked(parseOrganizationResponse).mockReturnValueOnce({} as never);

		await updateOrganization("org-1", { name: "New" });
		expect(api.patch).toHaveBeenCalledWith("/organizations/org-1", {
			name: "New",
		});
	});

	it("deletes an organization", async () => {
		vi.mocked(api.delete).mockResolvedValueOnce(undefined);

		await expect(deleteOrganization("org-1")).resolves.toBeUndefined();
		expect(api.delete).toHaveBeenCalledWith("/organizations/org-1");
	});

	it("fetches organization members", async () => {
		vi.mocked(api.get).mockResolvedValueOnce([]);
		vi.mocked(parseOrgMembersResponse).mockReturnValueOnce([
			{ id: "m-1" },
		] as never);

		await expect(fetchOrgMembers("org-1")).resolves.toEqual([{ id: "m-1" }]);
		expect(api.get).toHaveBeenCalledWith("/organizations/org-1/members");
	});

	it("updates a member role", async () => {
		vi.mocked(api.patch).mockResolvedValueOnce(undefined);

		await updateOrgMemberRole("org-1", "user-2", "admin");
		expect(api.patch).toHaveBeenCalledWith(
			"/organizations/org-1/members/user-2",
			{ role: "admin" },
		);
	});

	it("removes a member", async () => {
		vi.mocked(api.delete).mockResolvedValueOnce(undefined);

		await removeOrgMember("org-1", "user-2");
		expect(api.delete).toHaveBeenCalledWith(
			"/organizations/org-1/members/user-2",
		);
	});

	it("fetches invitations", async () => {
		vi.mocked(api.get).mockResolvedValueOnce([]);
		vi.mocked(parseOrgInvitationsResponse).mockReturnValueOnce([] as never);

		await fetchOrgInvitations("org-1");
		expect(api.get).toHaveBeenCalledWith("/organizations/org-1/invitations");
	});

	it("creates an invitation", async () => {
		vi.mocked(api.post).mockResolvedValueOnce({});
		vi.mocked(parseInvitationResponse).mockReturnValueOnce({
			id: "inv-1",
		} as never);

		await expect(
			createOrgInvitation("org-1", { login: "octo", role: "member" }),
		).resolves.toEqual({ id: "inv-1" });
		expect(api.post).toHaveBeenCalledWith("/organizations/org-1/invitations", {
			login: "octo",
			role: "member",
		});
	});

	it("revokes an invitation", async () => {
		vi.mocked(api.delete).mockResolvedValueOnce(undefined);

		await revokeOrgInvitation("org-1", "inv-1");
		expect(api.delete).toHaveBeenCalledWith(
			"/organizations/org-1/invitations/inv-1",
		);
	});

	it("transfers ownership", async () => {
		vi.mocked(api.post).mockResolvedValueOnce(undefined);

		await transferOrgOwnership("org-1", "user-9");
		expect(api.post).toHaveBeenCalledWith(
			"/organizations/org-1/transfer-ownership",
			{ new_owner_id: "user-9" },
		);
	});

	it("accepts and declines invitations by token", async () => {
		vi.mocked(api.post).mockResolvedValue(undefined);

		await acceptInvitation("tok 1");
		expect(api.post).toHaveBeenCalledWith("/invitations/tok%201/accept", {});

		await declineInvitation("tok-2");
		expect(api.post).toHaveBeenCalledWith("/invitations/tok-2/decline", {});
	});

	it("fetches organization templates with pagination params", async () => {
		vi.mocked(api.get).mockResolvedValueOnce({});
		vi.mocked(parseTemplatesPageResponse).mockReturnValueOnce({
			data: [],
		} as never);

		await fetchOrgTemplates("org-1", 2, 30);
		expect(api.get).toHaveBeenCalledWith(
			"/organizations/org-1/templates?page=2&limit=30",
		);
	});

	it("fetches organization addons with default pagination params", async () => {
		vi.mocked(api.get).mockResolvedValueOnce({});
		vi.mocked(parseAddonsPageResponse).mockReturnValueOnce({
			data: [],
		} as never);

		await fetchOrgAddons("org-1");
		expect(api.get).toHaveBeenCalledWith(
			"/organizations/org-1/addons?page=1&limit=20",
		);
	});
});
