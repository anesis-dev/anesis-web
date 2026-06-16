/**
 * Access-control service — API calls for managing visibility and per-entity
 * access grants on templates and addons.
 *
 * Visibility values: `"public"` | `"private"` | `"org_private"`.
 *
 * Access grants let a template/addon owner share a private resource with
 * specific users or organizations without making it fully public.
 */
import { api } from "@/api/client";
import {
	parseAddonAccessListResponse,
	parseTemplateAccessListResponse,
} from "@/lib/api-contracts";
import { IAddonAccess, ITemplateAccess } from "@/types/access-control";

export async function updateTemplateVisibility(
	id: string,
	visibility: string,
	repoCredentialId?: string,
	organizationId?: string | null,
): Promise<void> {
	await api.patch<void>(`/template/${encodeURIComponent(id)}/visibility`, {
		visibility,
		repo_credential_id: repoCredentialId ?? null,
		organization_id: organizationId ?? null,
	});
}

export async function removeTemplateFromOrganization(id: string): Promise<void> {
	await api.delete<void>(`/template/${encodeURIComponent(id)}/organization`);
}

export async function fetchTemplateAccess(id: string): Promise<ITemplateAccess[]> {
	return parseTemplateAccessListResponse(
		await api.get<unknown>(`/template/${encodeURIComponent(id)}/access`),
	);
}

export async function grantTemplateAccess(
	id: string,
	granteeType: string,
	granteeId: string,
): Promise<ITemplateAccess> {
	const result = await api.post<unknown>(`/template/${encodeURIComponent(id)}/access`, {
		grantee_type: granteeType,
		grantee_id: granteeId,
	});

	return parseTemplateAccessListResponse([result])[0];
}

export async function revokeTemplateAccess(id: string, granteeId: string): Promise<void> {
	await api.delete<void>(
		`/template/${encodeURIComponent(id)}/access/${encodeURIComponent(granteeId)}`,
	);
}

export async function updateAddonVisibility(
	id: string,
	visibility: string,
	repoCredentialId?: string,
	organizationId?: string | null,
): Promise<void> {
	await api.patch<void>(`/addon/${encodeURIComponent(id)}/visibility`, {
		visibility,
		repo_credential_id: repoCredentialId ?? null,
		organization_id: organizationId ?? null,
	});
}

export async function removeAddonFromOrganization(id: string): Promise<void> {
	await api.delete<void>(`/addon/${encodeURIComponent(id)}/organization`);
}

export async function fetchAddonAccess(id: string): Promise<IAddonAccess[]> {
	return parseAddonAccessListResponse(
		await api.get<unknown>(`/addon/${encodeURIComponent(id)}/access`),
	);
}

export async function grantAddonAccess(
	id: string,
	granteeType: string,
	granteeId: string,
): Promise<IAddonAccess> {
	const result = await api.post<unknown>(`/addon/${encodeURIComponent(id)}/access`, {
		grantee_type: granteeType,
		grantee_id: granteeId,
	});

	return parseAddonAccessListResponse([result])[0];
}

export async function revokeAddonAccess(id: string, granteeId: string): Promise<void> {
	await api.delete<void>(
		`/addon/${encodeURIComponent(id)}/access/${encodeURIComponent(granteeId)}`,
	);
}
