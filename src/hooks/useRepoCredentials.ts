import { useQuery } from "@tanstack/react-query";
import { fetchRepoCredentials } from "@/services/repo-credential";
import { IRepoCredential } from "@/types/repo-credential";

export function useRepoCredentials(options?: { enabled?: boolean }) {
	const { data: credentials = [], isLoading, isError } = useQuery<IRepoCredential[]>({
		queryKey: ["repo-credentials"],
		queryFn: fetchRepoCredentials,
		enabled: options?.enabled ?? true,
	});

	return { credentials, isLoading, isError };
}
