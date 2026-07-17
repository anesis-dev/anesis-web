import {
	getEmptyPagination,
	normalizePaginatedQueryOptions,
} from "@/hooks/pagination";

describe("normalizePaginatedQueryOptions", () => {
	it("defaults to page 1, size 20, enabled when given nothing", () => {
		expect(normalizePaginatedQueryOptions()).toEqual({
			page: 1,
			pageSize: 20,
			enabled: true,
		});
	});

	it("treats a boolean as the enabled flag with default paging", () => {
		expect(normalizePaginatedQueryOptions(false)).toEqual({
			page: 1,
			pageSize: 20,
			enabled: false,
		});
		expect(normalizePaginatedQueryOptions(true).enabled).toBe(true);
	});

	it("clamps page to a minimum of 1 and truncates fractions", () => {
		expect(normalizePaginatedQueryOptions({ page: 0 }).page).toBe(1);
		expect(normalizePaginatedQueryOptions({ page: -5 }).page).toBe(1);
		expect(normalizePaginatedQueryOptions({ page: 3.9 }).page).toBe(3);
	});

	it("clamps page size between 1 and 100", () => {
		expect(normalizePaginatedQueryOptions({ pageSize: 0 }).pageSize).toBe(1);
		expect(normalizePaginatedQueryOptions({ pageSize: 250 }).pageSize).toBe(100);
		expect(normalizePaginatedQueryOptions({ pageSize: 12 }).pageSize).toBe(12);
	});

	it("respects an explicit enabled flag", () => {
		expect(normalizePaginatedQueryOptions({ enabled: false }).enabled).toBe(
			false,
		);
	});
});

describe("getEmptyPagination", () => {
	it("returns an empty page that echoes the requested page and size", () => {
		expect(getEmptyPagination(2, 15)).toEqual({
			data: [],
			total: 0,
			page: 2,
			pageSize: 15,
			totalPages: 1,
		});
	});
});
