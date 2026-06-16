/**
 * Hook — fetches a single template by its ref (e.g. `"owner/my-template@1.0.0"`).
 *
 * Endpoint: GET /template/:templateRef
 * Cache key: ["template", templateRef]
 *
 * The query is disabled when `templateRef` is an empty string.
 */
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
	});

	return { template, isLoading, isError };
}
