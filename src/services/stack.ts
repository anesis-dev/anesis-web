import { api } from "@/api/client";
import { parseStarResponse } from "@/lib/api-contracts";
import {
	ICatalogFilters,
	IPaginatedResponse,
	IPaginationParams,
} from "@/types/pagination";
import { IStarResponse } from "@/types/addon";
import { IStack } from "@/types/stack";
import { appendCatalogFilters } from "@/services/catalog-filters";



interface RawPage {
	data: IStack[];
	total: number;
	page: number;
	page_size: number;
	total_pages: number;
}

function normalizePage(raw: RawPage): IPaginatedResponse<IStack> {
	return {
		data: raw.data ?? [],
		total: raw.total ?? 0,
		page: raw.page ?? 1,
		pageSize: raw.page_size ?? 20,
		totalPages: raw.total_pages ?? 1,
	};
}

function paginationQuery(
	pagination: IPaginationParams,
	filters?: ICatalogFilters,
): string {
	const page = Math.max(1, Math.trunc(pagination.page ?? 1));
	const pageSize = Math.min(100, Math.max(1, Math.trunc(pagination.pageSize ?? 20)));
	const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
	appendCatalogFilters(params, filters);
	return params.toString();
}

export async function fetchStacks(
	pagination: IPaginationParams = {},
	filters?: ICatalogFilters,
): Promise<IPaginatedResponse<IStack>> {
	return normalizePage(
		await api.get<RawPage>(`/stack/all?${paginationQuery(pagination, filters)}`),
	);
}

export async function fetchMyStacks(
	pagination: IPaginationParams = {},
): Promise<IPaginatedResponse<IStack>> {
	return normalizePage(await api.get<RawPage>(`/stack/my?${paginationQuery(pagination)}`));
}

export async function fetchStarredStacks(
	pagination: IPaginationParams = {},
): Promise<IPaginatedResponse<IStack>> {
	return normalizePage(await api.get<RawPage>(`/stack/starred?${paginationQuery(pagination)}`));
}

export async function fetchAllStacks(): Promise<IStack[]> {
	const first = await fetchStacks({ page: 1, pageSize: 100 });
	const rest = await Promise.all(
		Array.from({ length: Math.max(0, first.totalPages - 1) }, (_, i) =>
			fetchStacks({ page: i + 2, pageSize: 100 }),
		),
	);
	return [...first.data, ...rest.flatMap((p) => p.data)];
}

export async function fetchStack(stackRef: string): Promise<IStack> {
	return api.get<IStack>(`/stack/${encodeURIComponent(stackRef)}`);
}

export async function publishStack(
	url: string,
	visibility: "public" | "private" = "public",
): Promise<{ message: string; stack_id: string }> {
	return api.post<{ message: string; stack_id: string }>("/stack/publish", { url, visibility });
}



export async function updateStackOfficialStatus(
	id: string,
	official: boolean,
): Promise<void> {
	await api.patch<void>(`/stack/${encodeURIComponent(id)}/official?official=${official}`);
}

export async function updateStackVisibility(
	id: string,
	visibility: string,
): Promise<void> {
	await api.patch<void>(`/stack/${encodeURIComponent(id)}/visibility`, { visibility });
}

export async function deleteStack(
	stackId: string,
	version: string,
): Promise<void> {
	await api.delete<void>(
		`/stack/${encodeURIComponent(stackId)}/${encodeURIComponent(version)}`,
	);
}

export async function starStack(stackId: string): Promise<IStarResponse> {
	return parseStarResponse(
		await api.post<unknown>(`/stack/${encodeURIComponent(stackId)}/star`, {}),
	);
}
