/**
 * Hook — fetches pending invitations for an organization.
 *
 * Endpoint: GET /organizations/:orgId/invitations
 * Cache key: ["org-invitations", orgId]
 *
 * Pass `null` as `orgId` to skip the query.
 */
import { useQuery } from "@tanstack/react-query";
import { fetchOrgInvitations } from "@/services/organization";
import { IOrganizationInvitation } from "@/types/organization";

export function useOrgInvitations(orgId: string | null) {
	const { data: invitations = [], isLoading, isError } = useQuery<IOrganizationInvitation[]>({
		queryKey: ["org-invitations", orgId],
		queryFn: () => fetchOrgInvitations(orgId!),
		enabled: orgId !== null,
	});

	return { invitations, isLoading, isError };
}
