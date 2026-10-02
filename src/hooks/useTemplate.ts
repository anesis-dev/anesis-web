import { useQuery } from "@tanstack/react-query";
import { fetchTemplate } from "@/services/template";
import { ITemplate } from "@/types/template";

export function useTemplate(templateRef: string) {
	const {
		data: template,
		isLoading,
		isError,
	} = useQuery<ITemplate>({
		queryKey: ["template", templateRef],
		queryFn: () => fetchTemplate(templateRef),
		enabled: !!templateRef,
		// SSR-prefetched data is anonymous (no cookies on the server), so refetch
		// in the background on mount to pick up per-user fields like is_starred.
		staleTime: 0,
	});

	return { template, isLoading, isError };
}
