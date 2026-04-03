import { api, ApiError } from "@/api/client";
import { parseGitHubUserResponse } from "@/lib/api-contracts";
import { IGitHubUser } from "@/types/github";

export interface TemplateReadmePayload {
	content: string | null;
	fileName?: string;
	path?: string;
}

export async function fetchGitHubUser(login: string): Promise<IGitHubUser> {
	try {
		const url = encodeURIComponent(`https://api.github.com/users/${login}`);
		return parseGitHubUserResponse(
			await api.get<unknown>(`/github/proxy?url=${url}`),
		);
	} catch (error) {
		if (error instanceof ApiError && error.status === 404) {
			throw new Error(`GitHub user not found: ${login}`);
		}

		if (error instanceof Error) {
			throw error;
		}

		throw new Error(
			"Unable to reach GitHub right now. Please try again later.",
		);
	}
}

export async function fetchTemplateReadme(
	templateUrl: string,
): Promise<TemplateReadmePayload> {
	const response = await fetch(
		`/api/template-readme?url=${encodeURIComponent(templateUrl)}`,
	);

	if (!response.ok) {
		const payload = (await response.json().catch(() => null)) as
			| { message?: string }
			| null;

		throw new Error(payload?.message ?? "Failed to load template README.");
	}

	return (await response.json()) as TemplateReadmePayload;
}
