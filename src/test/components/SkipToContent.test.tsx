import { render, screen } from "@testing-library/react";
import SkipToContent from "@/components/SkipToContent";

describe("SkipToContent", () => {
	it("targets the main landmark by default", () => {
		render(<SkipToContent />);

		const link = screen.getByRole("link", { name: "Skip to content" });
		expect(link).toHaveAttribute("href", "#main-content");
	});

	it("can point past a secondary navigation", () => {
		render(<SkipToContent href="#docs-article" label="Skip to article" />);

		expect(screen.getByRole("link", { name: "Skip to article" })).toHaveAttribute(
			"href",
			"#docs-article",
		);
	});

	it("is present in the accessible tree while visually hidden", () => {
		render(<SkipToContent />);

		const link = screen.getByRole("link", { name: "Skip to content" });
		expect(link).toBeInTheDocument();
		expect(link.className).toContain("sr-only");
		expect(link.className).toContain("focus:not-sr-only");
	});
});
