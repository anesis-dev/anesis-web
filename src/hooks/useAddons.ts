import { useQuery } from "@tanstack/react-query";
import { fetchAddons } from "@/services/addon";
import { IAddon } from "@/types/addon";

export function useAddons(enabled = true) {
	const { data: addons = [], isLoading, isError } = useQuery<IAddon[]>({
		queryKey: ["addons"],
		queryFn: fetchAddons,
		enabled,
	});

	return { addons, isLoading, isError };
}
