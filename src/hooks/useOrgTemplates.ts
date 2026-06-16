/**
 * Hook — fetches templates owned by an organization (paginated).
 *
 * Endpoint: GET /organizations/:orgId/templates?page=&limit=
 * Cache key: ["org-templates", orgId, page, limit]
 *
 * Pass `null` as `orgId` to skip the query.
 */
import { useQuery } from "@tanstack/react-query";
import { fetchOrgTemplates } from "@/services/organization";
import { IPaginatedResponse } from "@/types/pagination";
import { ITemplate } from "@/types/template";

export function useOrgTemplates(orgId: string | null, page = 1, limit = 20) {
	const { data, isLoading, isError } = useQuery<IPaginatedResponse<ITemplate>>({
		queryKey: ["org-templates", orgId, page, limit],
		queryFn: () => fetchOrgTemplates(orgId!, page, limit),
		enabled: orgId !== null,
	});

	return {
		templates: data?.data ?? [],
		total: data?.total ?? 0,
		isLoading,
		isError,
	};
}
