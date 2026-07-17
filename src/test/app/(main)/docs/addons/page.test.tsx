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

		expect(screen.getAllByText(/anesis addon install/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/anesis addon list/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/anesis addon remove/i).length).toBeGreaterThan(0);
	});

	it("documents the external command form", () => {
		render(<DocsAddonsPage />);

		expect(screen.getAllByText(/anesis use <addon-id> <command>/i).length).toBeGreaterThan(0);
	});

	it("explains the anesis.lock file", () => {
		render(<DocsAddonsPage />);

		expect(screen.getAllByText(/anesis\.lock/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/"once": true/i).length).toBeGreaterThan(0);
	});

	it("links to creating and publishing sub-pages", () => {
		render(<DocsAddonsPage />);

		expect(screen.getAllByText(/creating addons/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/publishing addons/i).length).toBeGreaterThan(0);
	});
});
