/**
 * Hook — fetches the authenticated user's starred templates (paginated).
 *
 * Endpoint: GET /template/starred?page=&page_size=
 * Cache key: ["templates", "starred", page, pageSize]
 */
import { useQuery } from "@tanstack/react-query";
import { fetchStarredTemplates } from "@/services/template";
import {
	getEmptyPagination,
	normalizePaginatedQueryOptions,
	PaginatedQueryOptions,
} from "@/hooks/pagination";
import { ITemplate } from "@/types/template";
import { IPaginatedResponse } from "@/types/pagination";

export function useStarredTemplates(options: PaginatedQueryOptions | boolean = {}) {
	const { page, pageSize, enabled } = normalizePaginatedQueryOptions(options);
	const fallback = getEmptyPagination<ITemplate>(page, pageSize);
	const {
		data = fallback,
		isLoading,
		isError,
	} = useQuery<IPaginatedResponse<ITemplate>>({
		queryKey: ["templates", "starred", page, pageSize],
		queryFn: () => fetchStarredTemplates({ page, pageSize }),
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
