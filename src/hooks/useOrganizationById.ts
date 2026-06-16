/**
 * Hook — fetches a single organization by its UUID.
 * Use this when you have the raw organization `id` rather than its slug.
 *
 * Endpoint: GET /organizations/:id
 * Cache key: ["organization-by-id", id]
 *
 * Pass `null` or `undefined` to skip the query.
 */
import { useQuery } from "@tanstack/react-query";
import { fetchOrganization } from "@/services/organization";
import { IOrganization } from "@/types/organization";

export function useOrganizationById(id: string | null | undefined) {
	const {
		data: organization,
		isLoading,
		isError,
	} = useQuery<IOrganization>({
		queryKey: ["organization-by-id", id],
		queryFn: () => fetchOrganization(id!),
		enabled: !!id,
	});

	return { organization, isLoading, isError };
}
