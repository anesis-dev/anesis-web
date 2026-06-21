import { fetchMe } from "@/services/user";
import { getLoginUrl, logoutRequest } from "@/services/auth";
import { ApiError } from "@/api/client";
import { IUser } from "@/types/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
	const queryClient = useQueryClient();

	const { data: user, isLoading } = useQuery<IUser>({
		queryKey: ["me"],
		queryFn: fetchMe,
		retry: (failureCount, error) => {
			if (error instanceof ApiError && error.status < 500) return false;
			return failureCount < 2;
		},
	});

	function login() {
		window.location.href = getLoginUrl();
	}

	async function logout() {
		queryClient.cancelQueries();
		queryClient.clear();
		try {
			await logoutRequest();
		} catch {
		}
		window.location.href = "/";
	}

	return { user, isLoading, login, logout };
}
