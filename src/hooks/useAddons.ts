/**
 * Hook — fetches a paginated page of public addons.
 *
 * Endpoint: GET /addon/all?page=&page_size=
 * Cache key: ["addons", page, pageSize]
 *
 * Accepts either a `PaginatedQueryOptions` object or a plain `boolean`
 * (shorthand for `{ enabled }`).
 */
import { useQuery } from "@tanstack/react-query";
import { fetchAddons } from "@/services/addon";
import {
	getEmptyPagination,
	normalizePaginatedQueryOptions,
	PaginatedQueryOptions,
} from "@/hooks/pagination";
import { IAddon } from "@/types/addon";
import { IPaginatedResponse } from "@/types/pagination";

export function useAddons(options: PaginatedQueryOptions | boolean = {}) {
	const { page, pageSize, enabled } = normalizePaginatedQueryOptions(options);
	const fallback = getEmptyPagination<IAddon>(page, pageSize);
	const {
		data = fallback,
		isLoading,
		isError,
	} = useQuery<IPaginatedResponse<IAddon>>({
		queryKey: ["addons", page, pageSize],
		queryFn: () => fetchAddons({ page, pageSize }),
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
