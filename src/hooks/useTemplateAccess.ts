/**
 * Hook — fetches the access-control list for a private or org-private template.
 *
 * Endpoint: GET /template/:id/access
 * Cache key: ["template-access", templateId]
 *
 * Pass `null` as `templateId` to skip the query (e.g. when the template id is
 * not yet known).
 */
import { useQuery } from "@tanstack/react-query";
import { fetchTemplateAccess } from "@/services/access-control";
import { ITemplateAccess } from "@/types/access-control";

export function useTemplateAccess(templateId: string | null) {
	const { data: accessList = [], isLoading, isError } = useQuery<ITemplateAccess[]>({
		queryKey: ["template-access", templateId],
		queryFn: () => fetchTemplateAccess(templateId!),
		enabled: templateId !== null,
	});

	return { accessList, isLoading, isError };
}
