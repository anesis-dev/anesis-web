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
