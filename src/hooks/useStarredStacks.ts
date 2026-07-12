import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchStarredStacks } from "@/services/stack";
import {
	getEmptyPagination,
	normalizePaginatedQueryOptions,
	PaginatedQueryOptions,
} from "@/hooks/pagination";
import { IStack } from "@/types/stack";
import { IPaginatedResponse } from "@/types/pagination";

export function useStarredStacks(options: PaginatedQueryOptions | boolean = {}) {
	const { page, pageSize, enabled } = normalizePaginatedQueryOptions(options);
	const fallback = getEmptyPagination<IStack>(page, pageSize);
	const {
		data = fallback,
		isLoading,
		isError,
	} = useQuery<IPaginatedResponse<IStack>>({
		queryKey: ["stacks", "starred", page, pageSize],
		queryFn: () => fetchStarredStacks({ page, pageSize }),
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
