/**
 * Hook — fetches all organizations the authenticated user belongs to.
 *
 * Endpoint: GET /organizations
 * Cache key: ["organizations"]
 */
import { useQuery } from "@tanstack/react-query";
import { fetchOrganizations } from "@/services/organization";
import { IOrganization } from "@/types/organization";

export function useOrganizations(options?: { enabled?: boolean }) {
	const { data: organizations = [], isLoading, isError } = useQuery<IOrganization[]>({
		queryKey: ["organizations"],
		queryFn: fetchOrganizations,
		enabled: options?.enabled ?? true,
	});

	return { organizations, isLoading, isError };
}
