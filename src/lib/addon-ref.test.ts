import { getAddonHref, getAddonRef } from "@/lib/addon-ref";

describe("getAddonRef", () => {
	it("joins the addon id and version with an @", () => {
		expect(getAddonRef({ addon_id: "drizzle", version: "1.2.0" })).toBe(
			"drizzle@1.2.0",
		);
	});
});

describe("getAddonHref", () => {
	it("builds an encoded addon detail href", () => {
		expect(getAddonHref({ addon_id: "drizzle", version: "1.2.0" })).toBe(
			"/addons/drizzle%401.2.0",
		);
	});

	it("trims surrounding whitespace before building the ref", () => {
		expect(getAddonHref({ addon_id: " drizzle ", version: " 1.0.0 " })).toBe(
			"/addons/drizzle%401.0.0",
		);
	});

	it("falls back to the addons index when id or version is empty", () => {
		expect(getAddonHref({ addon_id: "", version: "1.0.0" })).toBe("/addons");
		expect(getAddonHref({ addon_id: "drizzle", version: "  " })).toBe("/addons");
	});
});
