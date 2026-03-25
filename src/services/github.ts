import { parseGitHubUserResponse } from "@/lib/api-contracts";
import { IGitHubUser } from "@/types/github";

export async function fetchGitHubUser(login: string): Promise<IGitHubUser> {
	try {
		const res = await fetch(`https://api.github.com/users/${login}`, {
			headers: {
				Accept: "application/vnd.github+json",
			},
			next: { revalidate: 60 * 10 },
		});

		if (res.status === 404) {
			throw new Error(`GitHub user not found: ${login}`);
		}

		if (!res.ok) {
			throw new Error(
				`GitHub is temporarily unavailable (${res.status} ${res.statusText}).`,
			);
		}

		return parseGitHubUserResponse(await res.json());
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}

		throw new Error(
			"Unable to reach GitHub right now. Please try again later.",
		);
	}
}
