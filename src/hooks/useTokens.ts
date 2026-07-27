import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTokens, createToken, deleteToken } from "@/services/tokens";
import { ICreatedToken } from "@/types/token";
import { useAuth } from "./useAuth";
import { ApiError } from "@/api/client";

export function useTokens() {
	const { user } = useAuth();
	const queryClient = useQueryClient();

	const { data: tokens = [], isLoading } = useQuery({
		queryKey: ["tokens"],
		queryFn: fetchTokens,
		enabled: !!user,
		retry: (failureCount, error) => {
			if (error instanceof ApiError && error.status < 500) return false;
			return failureCount < 2;
		},
	});

	const createMutation = useMutation<
		ICreatedToken,
		Error,
		{ name: string; expiresInDays: number | null }
	>({
		mutationFn: ({ name, expiresInDays }) => createToken(name, expiresInDays),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tokens"] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteToken(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tokens"] });
		},
	});

	return {
		tokens,
		isLoading,
		createToken: createMutation.mutateAsync,
		deleteToken: (id: string) => deleteMutation.mutate(id),
		isCreating: createMutation.isPending,
		isDeleting: deleteMutation.isPending,
	};
}
