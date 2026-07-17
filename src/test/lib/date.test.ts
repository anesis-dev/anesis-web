import { formatDate, getDateTimestamp } from "@/lib/date";

describe("date helpers", () => {
	it("formats valid dates in a stable UI format", () => {
		expect(formatDate("2026-04-01T10:00:00Z")).toBe("Apr 1, 2026");
	});

	it("returns a fallback for empty or invalid dates", () => {
		expect(formatDate(undefined)).toBe("—");
		expect(formatDate("not-a-date")).toBe("—");
		expect(formatDate("not-a-date", "Unknown")).toBe("Unknown");
	});

	it("normalizes timestamps for sorting", () => {
		expect(getDateTimestamp("2026-04-01T10:00:00Z")).toBeGreaterThan(0);
		expect(getDateTimestamp("not-a-date")).toBe(0);
		expect(getDateTimestamp(undefined)).toBe(0);
	});
});
