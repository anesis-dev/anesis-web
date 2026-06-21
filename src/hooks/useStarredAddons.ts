import { useQuery } from "@tanstack/react-query";
import { fetchStarredAddons } from "@/services/addon";
import {
	getEmptyPagination,
	normalizePaginatedQueryOptions,
	PaginatedQueryOptions,
} from "@/hooks/pagination";
import { IAddon } from "@/types/addon";
import { IPaginatedResponse } from "@/types/pagination";

export function useStarredAddons(options: PaginatedQueryOptions | boolean = {}) {
	const { page, pageSize, enabled } = normalizePaginatedQueryOptions(options);
	const fallback = getEmptyPagination<IAddon>(page, pageSize);
	const {
		data = fallback,
		isLoading,
		isError,
	} = useQuery<IPaginatedResponse<IAddon>>({
		queryKey: ["addons", "starred", page, pageSize],
		queryFn: () => fetchStarredAddons({ page, pageSize }),
		enabled,
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
