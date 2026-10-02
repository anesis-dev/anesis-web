import { ApiError } from "@/api/client";
import { fetchUserByLogin } from "@/services/user";
import { IPublicUser } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

type EnabledQueryOptions = {
	enabled?: boolean;
};

export function useUserByLogin(
	login: string,
	options: EnabledQueryOptions | boolean = {},
) {
	const enabled = typeof options === "boolean" ? options : (options.enabled ?? true);
	const { data: user, isLoading, isError } = useQuery<IPublicUser>({
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
