export interface IPaginationParams {
	page?: number;
	pageSize?: number;
}


export interface ICatalogFilters {
	search?: string;
	official?: boolean;
	specialization?: string | null;
	languages?: string[];
	technologies?: string[];
}

export interface IPaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}
