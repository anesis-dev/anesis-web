/**
 * Pagination types.
 *
 * `IPaginationParams` — query params accepted by paginated API endpoints.
 * `IPaginatedResponse<T>` — standard paginated list envelope returned by the
 * server.
 */
export interface IPaginationParams {
	page?: number;
	pageSize?: number;
}

export interface IPaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}
