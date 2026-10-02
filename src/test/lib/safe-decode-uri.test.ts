import { safeDecodeURIComponent } from "@/lib/safe-decode-uri";

describe("safeDecodeURIComponent", () => {
    it("decodes a normally-encoded value", () => {
        expect(safeDecodeURIComponent("hello%20world")).toBe("hello world");
    });

    it("returns the input unchanged when it isn't encoded", () => {
        expect(safeDecodeURIComponent("octocat")).toBe("octocat");
    });

    it("falls back to the original value on a malformed percent-encoding instead of throwing", () => {
        expect(() => decodeURIComponent("%")).toThrow();
        expect(safeDecodeURIComponent("%")).toBe("%");
        expect(safeDecodeURIComponent("100%done")).toBe("100%done");
    });
});
