export interface IPaginationParams {
	page?: number;
	pageSize?: number;
}

/** Server-side catalog filters shared by the templates/addons/stacks lists. */
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
