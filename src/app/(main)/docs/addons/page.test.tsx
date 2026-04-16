import { render, screen } from "@testing-library/react";
import DocsAddonsPage from "@/app/(main)/docs/addons/page";

describe("DocsAddonsPage", () => {
	it("focuses on using addons rather than authoring", () => {
		render(<DocsAddonsPage />);

		expect(
			screen.getByRole("heading", {
				name: /extend existing projects with addons/i,
			}),
		).toBeInTheDocument();

		expect(screen.getAllByText(/oxide addon install/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/oxide addon list/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/oxide addon remove/i).length).toBeGreaterThan(0);
	});

	it("documents the external command form", () => {
		render(<DocsAddonsPage />);

		expect(screen.getAllByText(/oxide use <addon-id> <command>/i).length).toBeGreaterThan(0);
	});

	it("explains the oxide.lock file", () => {
		render(<DocsAddonsPage />);

		expect(screen.getAllByText(/oxide\.lock/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/"once": true/i).length).toBeGreaterThan(0);
	});

	it("links to creating and publishing sub-pages", () => {
		render(<DocsAddonsPage />);

		expect(screen.getAllByText(/creating addons/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/publishing addons/i).length).toBeGreaterThan(0);
	});
});
