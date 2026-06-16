/**
 * GitHub service — functions that interact with GitHub data.
 *
 * `fetchGitHubUser` proxies the request through the backend
 * (`GET /github/proxy`) when the user is authenticated, which benefits from
 * a server-side GitHub token for higher rate limits. On 401/403 it falls
 * back to calling the GitHub API directly from the browser.
 *
 * `fetchTemplateReadme` calls the Next.js proxy route `/api/template-readme`
 * (which runs on the server) to avoid CORS restrictions when fetching from
 * the GitHub Contents API.
 */
import { api, ApiError } from "@/api/client";
import { parseGitHubUserResponse } from "@/lib/api-contracts";
import { IGitHubUser } from "@/types/github";

export interface TemplateReadmePayload {
	content: string | null;
	fileName?: string;
	path?: string;
}

async function fetchPublicGitHubUser(login: string): Promise<IGitHubUser> {
	const response = await fetch(`https://api.github.com/users/${login}`, {
		headers: {
			Accept: "application/vnd.github+json",
		},
	});

	if (response.status === 404) {
		throw new Error(`GitHub user not found: ${login}`);
	}

	if (!response.ok) {
		throw new Error("Unable to reach GitHub right now. Please try again later.");
	}

	return parseGitHubUserResponse(await response.json());
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

		if (
			error instanceof ApiError &&
			(error.status === 401 || error.status === 403)
		) {
			return fetchPublicGitHubUser(login);
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
