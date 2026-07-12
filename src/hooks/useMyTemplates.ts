import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchMyTemplates } from "@/services/template";
import {
	getEmptyPagination,
	normalizePaginatedQueryOptions,
	PaginatedQueryOptions,
} from "@/hooks/pagination";
import { ITemplate } from "@/types/template";
import { IPaginatedResponse } from "@/types/pagination";

export function useMyTemplates(options: PaginatedQueryOptions | boolean = {}) {
	const { page, pageSize, enabled } = normalizePaginatedQueryOptions(options);
	const fallback = getEmptyPagination<ITemplate>(page, pageSize);
	const {
		data = fallback,
		isLoading,
		isError,
	} = useQuery<IPaginatedResponse<ITemplate>>({
		queryKey: ["my-templates", page, pageSize],
		queryFn: () => fetchMyTemplates({ page, pageSize }),
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
