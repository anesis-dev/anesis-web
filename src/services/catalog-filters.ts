import { ICatalogFilters } from "@/types/pagination";

/** Appends catalog filter query params (matching the server's `CatalogFilters`). */
export function appendCatalogFilters(
	params: URLSearchParams,
	filters?: ICatalogFilters,
): void {
	if (!filters) return;

	const search = filters.search?.trim();
	if (search) params.set("search", search);
	if (filters.official) params.set("official", "true");
	if (filters.specialization) params.set("specialization", filters.specialization);
	if (filters.languages?.length) params.set("language", filters.languages.join(","));
	if (filters.technologies?.length)
		params.set("technology", filters.technologies.join(","));
}

/** Stable queryKey fragment so filter changes refetch and cache independently. */
export function catalogFiltersKey(filters?: ICatalogFilters) {
	return {
		search: filters?.search?.trim() || "",
		official: Boolean(filters?.official),
		specialization: filters?.specialization ?? "",
		languages: filters?.languages ?? [],
		technologies: filters?.technologies ?? [],
	};
}
