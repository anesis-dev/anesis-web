import { cn } from "@/lib/utils";

describe("cn", () => {
	it("joins truthy class values", () => {
		expect(cn("a", "b")).toBe("a b");
	});

	it("ignores falsy values and supports conditional objects", () => {
		expect(cn("a", false, null, undefined, { b: true, c: false })).toBe("a b");
	});

	it("merges conflicting tailwind utilities, keeping the last", () => {
		expect(cn("px-2", "px-4")).toBe("px-4");
		expect(cn("text-sm text-red-500", "text-lg")).toBe("text-red-500 text-lg");
	});
});
