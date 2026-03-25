import { fetchMe } from "@/services/user";
import { getLoginUrl, logoutRequest } from "@/services/auth";
import { IUser } from "@/types/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
	const queryClient = useQueryClient();

	const { data: user, isLoading } = useQuery<IUser>({
		queryKey: ["me"],
		queryFn: fetchMe,
	});

	function login() {
		window.location.href = getLoginUrl();
	}

	async function logout() {
		await logoutRequest();
		queryClient.removeQueries({ queryKey: ["me"] });
		window.location.href = "/";
	}

	return { user, isLoading, login, logout };
}
