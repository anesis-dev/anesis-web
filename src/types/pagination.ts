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
