import { env } from "@/config/env";

export async function fetchTemplateSchema(): Promise<string> {
	const response = await fetch(`${env.apiUrl}/schema/oxide.template.schema.json`, {
		next: { revalidate: 60 * 60 },
	});

	if (!response.ok) {
		throw new Error(
			`Failed to load schema (${response.status} ${response.statusText}).`,
		);
	}

	return JSON.stringify(await response.json(), null, 2);
}
