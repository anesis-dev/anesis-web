/**
 * Schema service.
 *
 * Fetches the Anesis template JSON schema (`anesis.template.schema.json`) from
 * the backend. Used by the "Create template" flow to provide in-editor
 * validation. Response is revalidated every hour (Next.js `revalidate`).
 */
import { env } from "@/config/env";

export async function fetchTemplateSchema(): Promise<string> {
	const response = await fetch(`${env.apiUrl}/schema/anesis.template.schema.json`, {
		next: { revalidate: 60 * 60 },
	});

	if (!response.ok) {
		throw new Error(
			`Failed to load schema (${response.status} ${response.statusText}).`,
		);
	}

	return JSON.stringify(await response.json(), null, 2);
}
