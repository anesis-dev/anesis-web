import { api } from "@/api/client";
import {
	parsePublishTemplateResponse,
	parseTemplateResponse,
	parseTemplateUrlResponse,
	parseTemplatesResponse,
} from "@/lib/api-contracts";
import { ITemplate } from "@/types/template";

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
): Promise<{ url: string }> {
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
	await api.patch<void>("/template/", { url });
}

export async function deleteTemplate(templateRef: string): Promise<void> {
	await api.delete<void>(`/template/${encodeURIComponent(templateRef)}`);
}
