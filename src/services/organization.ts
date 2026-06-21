import { api } from "@/api/client";
import {
	parseOrganizationResponse,
	parseOrganizationsResponse,
	parseOrgInvitationsResponse,
	parseOrgMembersResponse,
	parseInvitationResponse,
	parseTemplatesPageResponse,
	parseAddonsPageResponse,
} from "@/lib/api-contracts";
import { IOrganization, IOrganizationInvitation, IOrganizationMember, IOrgRole } from "@/types/organization";
import { IPaginatedResponse } from "@/types/pagination";
import { ITemplate } from "@/types/template";
import { IAddon } from "@/types/addon";

export async function fetchOrganizations(): Promise<IOrganization[]> {
	return parseOrganizationsResponse(await api.get<unknown>("/organizations"));
}

export async function createOrganization(payload: {
	name: string;
	slug: string;
	description?: string;
	avatar_url?: string;
}): Promise<IOrganization> {
	return parseOrganizationResponse(await api.post<unknown>("/organizations", payload));
}

export async function fetchOrganization(id: string): Promise<IOrganization> {
	return parseOrganizationResponse(
		await api.get<unknown>(`/organizations/${encodeURIComponent(id)}`),
	);
}

export async function fetchOrganizationBySlug(slug: string): Promise<IOrganization> {
	return parseOrganizationResponse(
		await api.get<unknown>(`/organizations/by-slug/${encodeURIComponent(slug)}`),
	);
}

export async function updateOrganization(
	id: string,
	payload: { name?: string; description?: string; avatar_url?: string },
): Promise<IOrganization> {
	return parseOrganizationResponse(
		await api.patch<unknown>(`/organizations/${encodeURIComponent(id)}`, payload),
	);
}

export async function deleteOrganization(id: string): Promise<void> {
	await api.delete<void>(`/organizations/${encodeURIComponent(id)}`);
}

export async function fetchOrgMembers(orgId: string): Promise<IOrganizationMember[]> {
	return parseOrgMembersResponse(
		await api.get<unknown>(`/organizations/${encodeURIComponent(orgId)}/members`),
	);
}

export async function updateOrgMemberRole(
	orgId: string,
	userId: string,
	role: IOrgRole,
): Promise<void> {
	await api.patch<void>(
		`/organizations/${encodeURIComponent(orgId)}/members/${encodeURIComponent(userId)}`,
		{ role },
	);
}

export async function removeOrgMember(orgId: string, userId: string): Promise<void> {
	await api.delete<void>(
		`/organizations/${encodeURIComponent(orgId)}/members/${encodeURIComponent(userId)}`,
	);
}

export async function fetchOrgInvitations(orgId: string): Promise<IOrganizationInvitation[]> {
	return parseOrgInvitationsResponse(
		await api.get<unknown>(`/organizations/${encodeURIComponent(orgId)}/invitations`),
	);
}

export async function createOrgInvitation(
	orgId: string,
	payload: { login?: string; user_id?: string; role: IOrgRole },
): Promise<IOrganizationInvitation> {
	return parseInvitationResponse(
		await api.post<unknown>(
			`/organizations/${encodeURIComponent(orgId)}/invitations`,
			payload,
		),
	);
}

export async function revokeOrgInvitation(orgId: string, invId: string): Promise<void> {
	await api.delete<void>(
		`/organizations/${encodeURIComponent(orgId)}/invitations/${encodeURIComponent(invId)}`,
	);
}

export async function transferOrgOwnership(orgId: string, newOwnerId: string): Promise<void> {
	await api.post<void>(
		`/organizations/${encodeURIComponent(orgId)}/transfer-ownership`,
		{ new_owner_id: newOwnerId },
	);
}

export async function acceptInvitation(token: string): Promise<void> {
	await api.post<void>(`/invitations/${encodeURIComponent(token)}/accept`, {});
}

export async function declineInvitation(token: string): Promise<void> {
	await api.post<void>(`/invitations/${encodeURIComponent(token)}/decline`, {});
}

export async function fetchOrgTemplates(
	orgId: string,
	page = 1,
	limit = 20,
): Promise<IPaginatedResponse<ITemplate>> {
	return parseTemplatesPageResponse(
		await api.get<unknown>(
			`/organizations/${encodeURIComponent(orgId)}/templates?page=${page}&limit=${limit}`,
		),
	);
}

export async function fetchOrgAddons(
	orgId: string,
	page = 1,
	limit = 20,
): Promise<IPaginatedResponse<IAddon>> {
	return parseAddonsPageResponse(
		await api.get<unknown>(
			`/organizations/${encodeURIComponent(orgId)}/addons?page=${page}&limit=${limit}`,
		),
	);
}
