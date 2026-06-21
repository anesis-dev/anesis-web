import { useQuery } from "@tanstack/react-query";
import { fetchOrgMembers } from "@/services/organization";
import { IOrganizationMember } from "@/types/organization";

export function useOrgMembers(orgId: string | null) {
	const { data: members = [], isLoading, isError } = useQuery<IOrganizationMember[]>({
		queryKey: ["org-members", orgId],
		queryFn: () => fetchOrgMembers(orgId!),
		enabled: orgId !== null,
	});

	return { members, isLoading, isError };
}
