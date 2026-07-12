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
	});

	return { stack, isLoading, isError };
}
