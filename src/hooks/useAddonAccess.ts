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
