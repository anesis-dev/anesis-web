import { useQuery } from "@tanstack/react-query";
import { fetchMyAddons } from "@/services/addon";
import { IAddon } from "@/types/addon";

export function useMyAddons(enabled = true) {
	const { data: addons = [], isLoading, isError } = useQuery<IAddon[]>({
		queryKey: ["addons", "my"],
		queryFn: fetchMyAddons,
		enabled,
	});

	return { addons, isLoading, isError };
}
