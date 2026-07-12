import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchTemplates } from "@/services/template";
import { catalogFiltersKey } from "@/services/catalog-filters";
import {
	getEmptyPagination,
	normalizePaginatedQueryOptions,
	PaginatedQueryOptions,
} from "@/hooks/pagination";
import { ITemplate } from "@/types/template";
import { ICatalogFilters, IPaginatedResponse } from "@/types/pagination";

export function useTemplates(
	options: PaginatedQueryOptions = {},
	filters?: ICatalogFilters,
) {
	const { page, pageSize, enabled } = normalizePaginatedQueryOptions(options);
	const fallback = getEmptyPagination<ITemplate>(page, pageSize);
	const {
		data = fallback,
		isLoading,
		isError,
	} = useQuery<IPaginatedResponse<ITemplate>>({
		queryKey: ["templates", page, pageSize, catalogFiltersKey(filters)],
		queryFn: () => fetchTemplates({ page, pageSize }, filters),
		enabled,
		placeholderData: keepPreviousData,
	});

	return {
		templates: data.data,
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
