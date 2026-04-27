import { IPaginatedResponse, IPaginationParams } from "@/types/pagination";

export type PaginatedQueryOptions = IPaginationParams & {
	enabled?: boolean;
};

export function normalizePaginatedQueryOptions(
	options: PaginatedQueryOptions | boolean = {},
): Required<PaginatedQueryOptions> {
	if (typeof options === "boolean") {
		return {
			page: 1,
			pageSize: 20,
			enabled: options,
		};
	}

	return {
		page: Math.max(1, Math.trunc(options.page ?? 1)),
		pageSize: Math.min(100, Math.max(1, Math.trunc(options.pageSize ?? 20))),
		enabled: options.enabled ?? true,
	};
}

export function getEmptyPagination<T>(
	page: number,
	pageSize: number,
): IPaginatedResponse<T> {
	return {
		data: [],
		total: 0,
		page,
		pageSize,
		totalPages: 1,
	};
}
