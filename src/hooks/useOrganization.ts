import { useQuery } from "@tanstack/react-query";
import { fetchOrganizationBySlug } from "@/services/organization";
import { IOrganization } from "@/types/organization";

export function useOrganization(slug: string) {
	const {
		data: organization,
		isLoading,
		isError,
	} = useQuery<IOrganization>({
		queryKey: ["organization", slug],
		queryFn: () => fetchOrganizationBySlug(slug),
		enabled: !!slug,
	});

	return { organization, isLoading, isError };
}
