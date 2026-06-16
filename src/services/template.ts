/**
 * Template service — all API calls related to templates.
 *
 * `buildPaginationPath` constructs the query string for paginated endpoints,
 * clamping `page` ≥ 1 and `pageSize` ∈ [1, 100].
 *
 * `fetchAllTemplates` iterates through every available page to collect the
 * complete template list — use sparingly (admin / client-side filtering).
 *
 * `deleteTemplate` requires the ref to include an explicit version
 * (`name@version`) to prevent accidental broad deletions.
 */
import { api } from "@/api/client";
import {
	parsePublishTemplateResponse,
	parseStarResponse,
	parseTemplateResponse,
	parseTemplateUrlResponse,
	parseTemplatesPageResponse,
	parseTemplateVersionsResponse,
} from "@/lib/api-contracts";
import { IPaginatedResponse, IPaginationParams } from "@/types/pagination";
import { ITemplate, ITemplateUrlResponse } from "@/types/template";
import { IStarResponse } from "@/types/addon";

function buildPaginationPath(path: string, pagination: IPaginationParams): string {
	const page = Math.max(1, Math.trunc(pagination.page ?? 1));
	const pageSize = Math.min(100, Math.max(1, Math.trunc(pagination.pageSize ?? 20)));
	const params = new URLSearchParams({
		page: String(page),
		page_size: String(pageSize),
	});

	return `${path}?${params.toString()}`;
}

function hasExplicitTemplateVersion(templateRef: string): boolean {
	const [name, version] = templateRef.split("@");

	return Boolean(name?.trim() && version?.trim());
}

export async function fetchTemplates(
	pagination: IPaginationParams = {},
): Promise<IPaginatedResponse<ITemplate>> {
	return parseTemplatesPageResponse(
		await api.get<unknown>(buildPaginationPath("/template/all", pagination)),
	);
}

export async function fetchAllTemplates(): Promise<ITemplate[]> {
	const pageSize = 100;
	const firstPage = await fetchTemplates({ page: 1, pageSize });
	const templates = [...firstPage.data];

	for (let page = 2; page <= firstPage.totalPages; page += 1) {
		const nextPage = await fetchTemplates({ page, pageSize });
		templates.push(...nextPage.data);
	}

	return templates;
}

export async function fetchMyTemplates(
	pagination: IPaginationParams = {},
): Promise<IPaginatedResponse<ITemplate>> {
	return parseTemplatesPageResponse(
		await api.get<unknown>(buildPaginationPath("/template/my", pagination)),
	);
}

export async function fetchTemplate(templateRef: string): Promise<ITemplate> {
	return parseTemplateResponse(
		await api.get<unknown>(`/template/${encodeURIComponent(templateRef)}`),
	);
}

export async function fetchTemplateVersions(
	templateName: string,
): Promise<ITemplate[]> {
	return parseTemplateVersionsResponse(
		await api.get<unknown>(
			`/template/${encodeURIComponent(templateName)}/versions`,
		),
		templateName,
	);
}

export async function fetchTemplateUrl(
	templateRef: string,
): Promise<ITemplateUrlResponse> {
	return parseTemplateUrlResponse(
		await api.get<unknown>(
			`/template/${encodeURIComponent(templateRef)}/url`,
		),
	);
}

export async function publishTemplate(
	url: string,
	organizationId?: string,
	visibility: "public" | "private" | "org_private" = "public",
): Promise<{ message: string; name: string }> {
	return parsePublishTemplateResponse(
		await api.post<unknown>("/template/publish", {
			url,
			organization_id: organizationId ?? null,
			visibility,
		}),
	);
}

export async function updateTemplate(url: string, organizationId?: string): Promise<void> {
	await api.patch<void>("/template", { url, organization_id: organizationId ?? null });
}

export async function updateTemplateAsOfficial(url: string, organizationId?: string): Promise<void> {
	await api.patch<void>("/template/official", { url, organization_id: organizationId ?? null });
}

export async function recordTemplateUse(templateName: string): Promise<void> {
	await api.post<void>(`/template/${encodeURIComponent(templateName)}/use`, {});
}

export async function deleteTemplate(templateRef: string): Promise<void> {
	if (!hasExplicitTemplateVersion(templateRef)) {
		throw new Error("Deleting a template requires an explicit version.");
	}

	await api.delete<void>(`/template/${encodeURIComponent(templateRef)}`);
}

export async function updateTemplateOfficialStatus(
	templateId: string,
	official: boolean,
): Promise<void> {
	await api.patch<void>(
		`/template/${encodeURIComponent(templateId)}/official?official=${official}`,
	);
}

export async function starTemplate(templateName: string): Promise<IStarResponse> {
	return parseStarResponse(
		await api.post<unknown>(`/template/${encodeURIComponent(templateName)}/star`, {}),
	);
}

export async function fetchStarredTemplates(
	pagination: IPaginationParams = {},
): Promise<IPaginatedResponse<ITemplate>> {
	return parseTemplatesPageResponse(
		await api.get<unknown>(buildPaginationPath("/template/starred", pagination)),
	);
}
