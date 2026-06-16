/**
 * Hook — fetches the access-control list for a private or org-private addon.
 *
 * Endpoint: GET /addon/:id/access
 * Cache key: ["addon-access", addonId]
 *
 * Pass `null` as `addonId` to skip the query.
 */
import { useQuery } from "@tanstack/react-query";
import { fetchAddonAccess } from "@/services/access-control";
import { IAddonAccess } from "@/types/access-control";

export function useAddonAccess(addonId: string | null) {
	const { data: accessList = [], isLoading, isError } = useQuery<IAddonAccess[]>({
		queryKey: ["addon-access", addonId],
		queryFn: () => fetchAddonAccess(addonId!),
		enabled: addonId !== null,
	});

	return { accessList, isLoading, isError };
}
