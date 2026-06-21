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
