/**
 * Hook — fetches addons owned by an organization (paginated).
 *
 * Endpoint: GET /organizations/:orgId/addons?page=&limit=
 * Cache key: ["org-addons", orgId, page, limit]
 *
 * Pass `null` as `orgId` to skip the query.
 */
import { useQuery } from "@tanstack/react-query";
import { fetchOrgAddons } from "@/services/organization";
import { IPaginatedResponse } from "@/types/pagination";
import { IAddon } from "@/types/addon";

export function useOrgAddons(orgId: string | null, page = 1, limit = 20) {
	const { data, isLoading, isError } = useQuery<IPaginatedResponse<IAddon>>({
		queryKey: ["org-addons", orgId, page, limit],
		queryFn: () => fetchOrgAddons(orgId!, page, limit),
		enabled: orgId !== null,
	});

	return {
		addons: data?.data ?? [],
		total: data?.total ?? 0,
		isLoading,
		isError,
	};
}
