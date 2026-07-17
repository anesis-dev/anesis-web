import { describe, expect, it } from "vitest";
import { orderByRequires } from "@/lib/stack-plan";

describe("orderByRequires", () => {
	const deps: Record<string, string[]> = {
		"nest-jwt-auth": ["nest-config"],
		"nest-prisma": ["nest-config"],
	};
	const requiresOf = (id: string) => deps[id] ?? [];

	it("puts required addons before the ones that require them", () => {
		expect(orderByRequires(["nest-jwt-auth", "nest-config"], requiresOf)).toEqual([
			"nest-config",
			"nest-jwt-auth",
		]);
	});

	it("preserves insertion order when there are no dependencies", () => {
		expect(orderByRequires(["a", "b", "c"], () => [])).toEqual(["a", "b", "c"]);
	});

	it("ignores requirements outside the selection", () => {
		expect(orderByRequires(["nest-prisma"], requiresOf)).toEqual(["nest-prisma"]);
	});

	it("does not loop on cyclic requirements", () => {
		const cyclic = (id: string) => (id === "a" ? ["b"] : ["a"]);
		expect(orderByRequires(["a", "b"], cyclic)).toHaveLength(2);
	});
});
