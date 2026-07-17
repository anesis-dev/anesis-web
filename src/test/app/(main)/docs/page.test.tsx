import { render, screen } from "@testing-library/react";
import DocsOverviewPage from "@/app/(main)/docs/page";

describe("DocsOverviewPage", () => {
	it("renders the overview heading and key navigation cards", () => {
		render(<DocsOverviewPage />);

		expect(
			screen.getByRole("heading", {
				name: /everything you need to scaffold, extend, and publish with anesis/i,
			}),
		).toBeInTheDocument();

		expect(screen.getAllByText(/using templates/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/creating templates/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/using addons/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/creating addons/i).length).toBeGreaterThan(0);
	});

	it("does not reference a standalone CLI section", () => {
		render(<DocsOverviewPage />);

		const headings = screen.queryAllByRole("heading");
		const headingTexts = headings.map((h) => h.textContent?.toLowerCase() ?? "");
		expect(headingTexts.some((t) => t === "cli")).toBe(false);
	});

	it("shows the quick start code block", () => {
		render(<DocsOverviewPage />);

		expect(screen.getAllByText(/anesis new my-app react-vite-ts/i).length).toBeGreaterThan(0);
	});
});
