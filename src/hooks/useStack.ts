import { useQuery } from "@tanstack/react-query";
import { fetchStack } from "@/services/stack";
import { IStack } from "@/types/stack";

export function useStack(stackRef: string) {
	const {
		data: stack,
		isLoading,
		isError,
	} = useQuery<IStack>({
		queryKey: ["stack", stackRef],
		queryFn: () => fetchStack(stackRef),
		enabled: !!stackRef,
		// SSR-prefetched data is anonymous (no cookies on the server), so refetch
		// in the background on mount to pick up per-user fields like is_starred.
		staleTime: 0,
	});

	return { stack, isLoading, isError };
}
