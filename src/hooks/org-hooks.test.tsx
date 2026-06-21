import { renderHook, waitFor } from "@testing-library/react";
import { createQueryClientWrapper, createTestQueryClient } from "@/test/render";
import { createAddon, mockTemplate } from "@/test/fixtures";

vi.mock("@/services/organization", () => ({
	fetchOrganizations: vi.fn(),
	fetchOrganizationBySlug: vi.fn(),
	fetchOrgMembers: vi.fn(),
	fetchOrgInvitations: vi.fn(),
	fetchOrgTemplates: vi.fn(),
	fetchOrgAddons: vi.fn(),
}));

vi.mock("@/services/repo-credential", () => ({
	fetchRepoCredentials: vi.fn(),
}));

vi.mock("@/services/access-control", () => ({
	fetchTemplateAccess: vi.fn(),
	fetchAddonAccess: vi.fn(),
}));

import {
	fetchOrgAddons,
	fetchOrgInvitations,
	fetchOrgMembers,
	fetchOrgTemplates,
	fetchOrganizationBySlug,
	fetchOrganizations,
} from "@/services/organization";
import { fetchRepoCredentials } from "@/services/repo-credential";
import {
	fetchAddonAccess,
	fetchTemplateAccess,
} from "@/services/access-control";
import { useAddonAccess } from "@/hooks/useAddonAccess";
import { useOrgAddons } from "@/hooks/useOrgAddons";
import { useOrgInvitations } from "@/hooks/useOrgInvitations";
import { useOrgMembers } from "@/hooks/useOrgMembers";
import { useOrgTemplates } from "@/hooks/useOrgTemplates";
import { useOrganization } from "@/hooks/useOrganization";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useRepoCredentials } from "@/hooks/useRepoCredentials";
import { useTemplateAccess } from "@/hooks/useTemplateAccess";

function getWrapper() {
	return createQueryClientWrapper(createTestQueryClient());
}

describe("organization & access hooks", () => {
	it("loads organizations", async () => {
		vi.mocked(fetchOrganizations).mockResolvedValueOnce([{ id: "org-1" }] as never);

		const { result } = renderHook(() => useOrganizations(), {
			wrapper: getWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(result.current.organizations).toEqual([{ id: "org-1" }]);
	});

	it("does not load organizations when disabled", async () => {
		const { result } = renderHook(() => useOrganizations({ enabled: false }), {
			wrapper: getWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(result.current.organizations).toEqual([]);
		expect(fetchOrganizations).not.toHaveBeenCalled();
	});

	it("loads an organization by slug", async () => {
		vi.mocked(fetchOrganizationBySlug).mockResolvedValueOnce({
			id: "org-1",
			slug: "acme",
		} as never);

		const { result } = renderHook(() => useOrganization("acme"), {
			wrapper: getWrapper(),
		});

		await waitFor(() =>
			expect(result.current.organization).toEqual({ id: "org-1", slug: "acme" }),
		);
		expect(fetchOrganizationBySlug).toHaveBeenCalledWith("acme");
	});

	it("does not load an organization without a slug", async () => {
		const { result } = renderHook(() => useOrganization(""), {
			wrapper: getWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(fetchOrganizationBySlug).not.toHaveBeenCalled();
	});

	it("loads members for an organization", async () => {
		vi.mocked(fetchOrgMembers).mockResolvedValueOnce([{ id: "m-1" }] as never);

		const { result } = renderHook(() => useOrgMembers("org-1"), {
			wrapper: getWrapper(),
		});

		await waitFor(() => expect(result.current.members).toEqual([{ id: "m-1" }]));
		expect(fetchOrgMembers).toHaveBeenCalledWith("org-1");
	});

	it("does not load members when the org id is null", async () => {
		const { result } = renderHook(() => useOrgMembers(null), {
			wrapper: getWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(result.current.members).toEqual([]);
		expect(fetchOrgMembers).not.toHaveBeenCalled();
	});

	it("loads invitations for an organization", async () => {
		vi.mocked(fetchOrgInvitations).mockResolvedValueOnce([
			{ id: "inv-1" },
		] as never);

		const { result } = renderHook(() => useOrgInvitations("org-1"), {
			wrapper: getWrapper(),
		});

		await waitFor(() =>
			expect(result.current.invitations).toEqual([{ id: "inv-1" }]),
		);
	});

	it("loads organization templates with totals", async () => {
		vi.mocked(fetchOrgTemplates).mockResolvedValueOnce({
			data: [mockTemplate],
			total: 5,
			page: 1,
			pageSize: 20,
			totalPages: 1,
		});

		const { result } = renderHook(() => useOrgTemplates("org-1", 2, 10), {
			wrapper: getWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(result.current.templates).toEqual([mockTemplate]);
		expect(result.current.total).toBe(5);
		expect(fetchOrgTemplates).toHaveBeenCalledWith("org-1", 2, 10);
	});

	it("loads organization addons with totals", async () => {
		const addon = createAddon();
		vi.mocked(fetchOrgAddons).mockResolvedValueOnce({
			data: [addon],
			total: 3,
			page: 1,
			pageSize: 20,
			totalPages: 1,
		});

		const { result } = renderHook(() => useOrgAddons("org-1"), {
			wrapper: getWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(result.current.addons).toEqual([addon]);
		expect(result.current.total).toBe(3);
		expect(fetchOrgAddons).toHaveBeenCalledWith("org-1", 1, 20);
	});

	it("loads repo credentials", async () => {
		vi.mocked(fetchRepoCredentials).mockResolvedValueOnce([
			{ id: "c-1" },
		] as never);

		const { result } = renderHook(() => useRepoCredentials(), {
			wrapper: getWrapper(),
		});

		await waitFor(() =>
			expect(result.current.credentials).toEqual([{ id: "c-1" }]),
		);
	});

	it("loads template access entries", async () => {
		vi.mocked(fetchTemplateAccess).mockResolvedValueOnce([
			{ id: "a-1" },
		] as never);

		const { result } = renderHook(() => useTemplateAccess("t-1"), {
			wrapper: getWrapper(),
		});

		await waitFor(() =>
			expect(result.current.accessList).toEqual([{ id: "a-1" }]),
		);
		expect(fetchTemplateAccess).toHaveBeenCalledWith("t-1");
	});

	it("does not load addon access when the addon id is null", async () => {
		const { result } = renderHook(() => useAddonAccess(null), {
			wrapper: getWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(result.current.accessList).toEqual([]);
		expect(fetchAddonAccess).not.toHaveBeenCalled();
	});
});
