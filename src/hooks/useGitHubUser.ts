/**
 * Hook — fetches a GitHub user's public profile.
 *
 * When the user is authenticated the request is proxied through the backend
 * (`GET /github/proxy?url=...`) which uses a server-side GitHub token for
 * higher rate limits. For unauthenticated users it falls back to the public
 * GitHub API directly (see `fetchGitHubUser` in the github service).
 *
 * Cache key: ["github-user", login]
 */
import { useQuery } from "@tanstack/react-query";
import { fetchGitHubUser } from "@/services/github";
import { IGitHubUser } from "@/types/github";

export function useGitHubUser(login: string) {
	const { data: githubUser, isLoading, isError } = useQuery<IGitHubUser>({
		queryKey: ["github-user", login],
		queryFn: () => fetchGitHubUser(login),
		enabled: !!login,
	});

	return { githubUser, isLoading, isError };
}
