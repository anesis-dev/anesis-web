import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchAddons, SortMode } from "@/services/addon";
import { catalogFiltersKey } from "@/services/catalog-filters";
import {
	getEmptyPagination,
	normalizePaginatedQueryOptions,
	PaginatedQueryOptions,
} from "@/hooks/pagination";
import { IAddon } from "@/types/addon";
import { ICatalogFilters, IPaginatedResponse } from "@/types/pagination";

export function useAddons(
	options: PaginatedQueryOptions | boolean = {},
	sort: SortMode = "recent",
	filters?: ICatalogFilters,
) {
	const { page, pageSize, enabled } = normalizePaginatedQueryOptions(options);
	const fallback = getEmptyPagination<IAddon>(page, pageSize);
	const {
		data = fallback,
		isLoading,
		isError,
	} = useQuery<IPaginatedResponse<IAddon>>({
		queryKey: ["addons", page, pageSize, sort, catalogFiltersKey(filters)],
		queryFn: () => fetchAddons({ page, pageSize }, sort, filters),
		enabled,
		placeholderData: keepPreviousData,
	});

	return {
		addons: data.data,
		pagination: {
			total: data.total,
			page: data.page,
			pageSize: data.pageSize,
			totalPages: data.totalPages,
		},
		isLoading,
		isError,
	};
}
