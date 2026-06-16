/**
 * Hook — fetches ALL templates across all pages in a single query.
 *
 * Cache key: ["templates", "all-pages"]
 *
 * Uses `fetchAllTemplates`, which internally iterates through every page
 * (100 items per page) until the full dataset is collected. This is intended
 * for admin views or cases where client-side filtering needs the entire list.
 */
import { useQuery } from "@tanstack/react-query";
import { fetchAllTemplates } from "@/services/template";
import { ITemplate } from "@/types/template";

type EnabledQueryOptions = {
	enabled?: boolean;
};

export function useAllTemplates(options: EnabledQueryOptions | boolean = {}) {
	const enabled = typeof options === "boolean" ? options : (options.enabled ?? true);
	const {
		data: templates = [],
		isLoading,
		isError,
	} = useQuery<ITemplate[]>({
		queryKey: ["templates", "all-pages"],
		queryFn: () => fetchAllTemplates(),
		enabled,
	});

	return {
		templates,
		isLoading,
		isError,
	};
}
