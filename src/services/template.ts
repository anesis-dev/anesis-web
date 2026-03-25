import { api } from "@/api/client";
import {
	parsePublishTemplateResponse,
	parseTemplatesResponse,
} from "@/lib/api-contracts";
import { ITemplate } from "@/types/template";

export async function fetchTemplates(): Promise<ITemplate[]> {
	return parseTemplatesResponse(await api.get<unknown>("/template"));
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
