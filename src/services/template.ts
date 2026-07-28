import { api } from "@/api/client";
import {
	parsePublishTemplateResponse,
	parseStarResponse,
	parseTemplateResponse,
	parseTemplateUrlResponse,
	parseTemplatesPageResponse,
	parseTemplateVersionsResponse,
} from "@/lib/api-contracts";
import {
	ICatalogFilters,
	IPaginatedResponse,
	IPaginationParams,
} from "@/types/pagination";
import { ITemplate, ITemplateUrlResponse } from "@/types/template";
import { IStarResponse } from "@/types/addon";
import { appendCatalogFilters } from "@/services/catalog-filters";

function buildPaginationPath(
	path: string,
	pagination: IPaginationParams,
	filters?: ICatalogFilters,
): string {
	const page = Math.max(1, Math.trunc(pagination.page ?? 1));
	const pageSize = Math.min(100, Math.max(1, Math.trunc(pagination.pageSize ?? 20)));
	const params = new URLSearchParams({
		page: String(page),
		page_size: String(pageSize),
	});
	appendCatalogFilters(params, filters);

	return `${path}?${params.toString()}`;
}

function hasExplicitTemplateVersion(templateRef: string): boolean {
	const [name, version] = templateRef.split("@");

	return Boolean(name?.trim() && version?.trim());
}

export async function fetchTemplates(
	pagination: IPaginationParams = {},
	filters?: ICatalogFilters,
): Promise<IPaginatedResponse<ITemplate>> {
	return parseTemplatesPageResponse(
		await api.get<unknown>(buildPaginationPath("/template/all", pagination, filters)),
	);
}

export async function fetchAllTemplates(): Promise<ITemplate[]> {
	const pageSize = 100;
	const firstPage = await fetchTemplates({ page: 1, pageSize });

	const rest = await Promise.all(
		Array.from({ length: Math.max(0, firstPage.totalPages - 1) }, (_, i) =>
			fetchTemplates({ page: i + 2, pageSize }),
		),
	);

	return [...firstPage.data, ...rest.flatMap((p) => p.data)];
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
): Promise<{ message: string; name: string }> {
	return parsePublishTemplateResponse(
		await api.post<unknown>("/template/publish", {
			url,
			visibility: "public",
		}),
	);
}

export async function updateTemplate(url: string): Promise<void> {
	await api.patch<void>("/template", { url });
}

export async function updateTemplateAsOfficial(url: string): Promise<void> {
	await api.patch<void>("/template/official", { url });
}

export async function updateTemplateVisibility(
	id: string,
	visibility: string,
): Promise<void> {
	await api.patch<void>(`/template/${encodeURIComponent(id)}/visibility`, {
		visibility,
	});
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
