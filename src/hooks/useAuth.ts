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
			// Don't retry on 4xx — the user is simply not authenticated or forbidden
			if (error instanceof ApiError && error.status < 500) return false;
			return failureCount < 2;
		},
	});

	function login() {
		window.location.href = getLoginUrl();
	}

	async function logout() {
		// Always clear local state regardless of whether the server request succeeds
		queryClient.removeQueries({ queryKey: ["me"] });
		try {
			await logoutRequest();
		} catch {
			// Server-side logout failed, but local state is already cleared
		}
		window.location.href = "/";
	}

	return { user, isLoading, login, logout };
}
