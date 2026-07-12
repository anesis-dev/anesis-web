import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchStacks } from "@/services/stack";
import { catalogFiltersKey } from "@/services/catalog-filters";
import {
	getEmptyPagination,
	normalizePaginatedQueryOptions,
	PaginatedQueryOptions,
} from "@/hooks/pagination";
import { IStack } from "@/types/stack";
import { ICatalogFilters, IPaginatedResponse } from "@/types/pagination";

export function useStacks(
	options: PaginatedQueryOptions | boolean = {},
	filters?: ICatalogFilters,
) {
	const { page, pageSize, enabled } = normalizePaginatedQueryOptions(options);
	const fallback = getEmptyPagination<IStack>(page, pageSize);
	const {
		data = fallback,
		isLoading,
		isError,
	} = useQuery<IPaginatedResponse<IStack>>({
		queryKey: ["stacks", page, pageSize, catalogFiltersKey(filters)],
		queryFn: () => fetchStacks({ page, pageSize }, filters),
		enabled,
		placeholderData: keepPreviousData,
	});

	return {
		stacks: data.data,
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
