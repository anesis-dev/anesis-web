/**
 * Shared pagination utilities for TanStack Query hooks.
 *
 * `PaginatedQueryOptions` is the standard options bag accepted by paginated
 * hooks — it extends the raw pagination params with an `enabled` flag that
 * can be used to defer the query.
 *
 * `normalizePaginatedQueryOptions` clamps `page` and `pageSize` to valid
 * ranges so that callers don't need to guard against bad values. It also
 * accepts a plain `boolean` as a shorthand for `{ enabled }`.
 *
 * `getEmptyPagination` provides a safe default value so hooks can use it
 * as the query fallback and avoid null-checks on every call site.
 */
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
