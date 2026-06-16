/**
 * Hook — manages multi-account sessions.
 *
 * Fetches all active sessions for the current browser, then provides
 * `switchAccount` and `removeSession` mutations.
 *
 * Cache key: ["sessions"]
 *
 * `switchAccount` performs a full page reload after switching so that all
 * cached queries are invalidated and the UI reflects the new active account.
 * `removeSession` only invalidates the sessions query; no reload is needed.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSessions } from "@/services/sessions";
import { switchAccountRequest, removeSessionRequest } from "@/services/auth";
import { useAuth } from "./useAuth";
import { ApiError } from "@/api/client";

export function useSessions() {
	const { user } = useAuth();
	const queryClient = useQueryClient();

	const { data: sessions = [], isLoading } = useQuery({
		queryKey: ["sessions"],
		queryFn: fetchSessions,
		enabled: !!user,
		retry: (failureCount, error) => {
			if (error instanceof ApiError && error.status < 500) return false;
			return failureCount < 2;
		},
	});

	const switchMutation = useMutation({
		mutationFn: (login: string) => switchAccountRequest(login),
		onSuccess: () => {
			queryClient.cancelQueries();
			queryClient.clear();
			window.location.href = "/";
		},
	});

	const removeMutation = useMutation({
		mutationFn: (login: string) => removeSessionRequest(login),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["sessions"] });
		},
	});

	return {
		sessions,
		isLoading,
		switchAccount: (login: string) => switchMutation.mutate(login),
		removeSession: (login: string) => removeMutation.mutate(login),
		isSwitching: switchMutation.isPending,
		isRemoving: removeMutation.isPending,
	};
}
