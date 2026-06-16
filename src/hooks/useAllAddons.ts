/**
 * Hook — fetches ALL addons across all pages in a single query.
 *
 * Cache key: ["addons", "all-pages"]
 *
 * Uses `fetchAllAddons`, which iterates through every page (100 per page).
 * Intended for admin views that need the complete dataset for client-side
 * operations.
 */
import { useQuery } from "@tanstack/react-query";
import { fetchAllAddons } from "@/services/addon";
import { IAddon } from "@/types/addon";

type EnabledQueryOptions = {
	enabled?: boolean;
};

export function useAllAddons(options: EnabledQueryOptions | boolean = {}) {
	const enabled = typeof options === "boolean" ? options : (options.enabled ?? true);
	const {
		data: addons = [],
		isLoading,
		isError,
	} = useQuery<IAddon[]>({
		queryKey: ["addons", "all-pages"],
		queryFn: () => fetchAllAddons(),
		enabled,
	});

	return {
		addons,
		isLoading,
		isError,
	};
}
