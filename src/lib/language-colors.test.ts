import { getLanguageColor } from "@/lib/language-colors";

describe("getLanguageColor", () => {
	it("returns the known color for a language", () => {
		expect(getLanguageColor("typescript")).toBe("#3178c6");
		expect(getLanguageColor("rust")).toBe("#dea584");
	});

	it("is case-insensitive", () => {
		expect(getLanguageColor("TypeScript")).toBe("#3178c6");
		expect(getLanguageColor("RUST")).toBe("#dea584");
	});

	it("resolves aliases", () => {
		expect(getLanguageColor("csharp")).toBe(getLanguageColor("c#"));
		expect(getLanguageColor("cpp")).toBe(getLanguageColor("c++"));
	});

	it("falls back to the default color for unknown languages", () => {
		expect(getLanguageColor("brainfuck")).toBe("#8b949e");
		expect(getLanguageColor("")).toBe("#8b949e");
	});
});
