/**
 * Hook — fetches an Anesis user by their GitHub login handle.
 *
 * Endpoint: GET /user/by-login/:login (falls back to POST if the route
 * returns 404/405, which handles older server versions that only exposed POST).
 * Cache key: ["user", "by-login", login.toLowerCase()]
 *
 * 4xx errors are not retried. The query is disabled when `login` is blank.
 */
import { ApiError } from "@/api/client";
import { fetchUserByLogin } from "@/services/user";
import { IUser } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

type EnabledQueryOptions = {
	enabled?: boolean;
};

export function useUserByLogin(
	login: string,
	options: EnabledQueryOptions | boolean = {},
) {
	const enabled = typeof options === "boolean" ? options : (options.enabled ?? true);
	const { data: user, isLoading, isError } = useQuery<IUser>({
		queryKey: ["user", "by-login", login.toLowerCase()],
		queryFn: () => fetchUserByLogin(login),
		enabled: enabled && login.trim().length > 0,
		retry: (failureCount, error) => {
			if (error instanceof ApiError && error.status < 500) return false;
			return failureCount < 2;
		},
	});

	return { user, isLoading, isError };
}
