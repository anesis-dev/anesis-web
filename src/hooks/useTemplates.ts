import { useQuery } from "@tanstack/react-query";
import { fetchTemplates } from "@/services/template";
import {
	getEmptyPagination,
	normalizePaginatedQueryOptions,
	PaginatedQueryOptions,
} from "@/hooks/pagination";
import { ITemplate } from "@/types/template";
import { IPaginatedResponse } from "@/types/pagination";

export function useTemplates(options: PaginatedQueryOptions = {}) {
	const { page, pageSize, enabled } = normalizePaginatedQueryOptions(options);
	const fallback = getEmptyPagination<ITemplate>(page, pageSize);
	const {
		data = fallback,
		isLoading,
		isError,
	} = useQuery<IPaginatedResponse<ITemplate>>({
		queryKey: ["templates", page, pageSize],
		queryFn: () => fetchTemplates({ page, pageSize }),
		enabled,
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
