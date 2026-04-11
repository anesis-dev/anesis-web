import { api } from "@/api/client";
import {
	parsePublishTemplateResponse,
	parseTemplateResponse,
	parseTemplateUrlResponse,
	parseTemplatesResponse,
} from "@/lib/api-contracts";
import { ITemplate, ITemplateUrlResponse } from "@/types/template";

function hasExplicitTemplateVersion(templateRef: string): boolean {
	const [name, version] = templateRef.split("@");

	return Boolean(name?.trim() && version?.trim());
}

export async function fetchTemplates(): Promise<ITemplate[]> {
	return parseTemplatesResponse(await api.get<unknown>("/template/all"));
}

export async function fetchMyTemplates(): Promise<ITemplate[]> {
	return parseTemplatesResponse(await api.get<unknown>("/template/my"));
}

export async function fetchTemplate(templateRef: string): Promise<ITemplate> {
	return parseTemplateResponse(
		await api.get<unknown>(`/template/${encodeURIComponent(templateRef)}`),
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
		}),
	);
}

export async function updateTemplate(url: string): Promise<void> {
	await api.patch<void>("/template", { url });
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
