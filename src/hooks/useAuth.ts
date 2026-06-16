/**
 * Authentication hook — provides the currently signed-in user and helpers
 * to trigger login/logout.
 *
 * - Calls `GET /user/info` (cache key `["me"]`) to populate `user`.
 * - 4xx responses are not retried because they indicate unauthenticated or
 *   forbidden states, not transient network errors.
 * - `login()` redirects the browser to the GitHub OAuth entry point.
 * - `logout()` clears all TanStack Query caches before calling the server
 *   logout endpoint, so a subsequent user cannot see private cached data.
 */
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
		// Always clear all cached data so the next user does not see the previous
		// user's private queries (my-templates, notifications, organizations, etc.)
		queryClient.cancelQueries();
		queryClient.clear();
		try {
			await logoutRequest();
		} catch {
			// Server-side logout failed, but local state is already cleared
		}
		window.location.href = "/";
	}

	return { user, isLoading, login, logout };
}
