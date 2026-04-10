import { render, screen } from "@testing-library/react";
import DocsTemplatesPage from "@/app/(main)/docs/templates/page";

describe("DocsTemplatesPage", () => {
	it("focuses on using templates rather than authoring", () => {
		render(<DocsTemplatesPage />);

		expect(
			screen.getByRole("heading", {
				name: /scaffold new projects from templates/i,
			}),
		).toBeInTheDocument();

		expect(screen.getAllByText(/oxide template install/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/oxide new/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/oxide template list/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/oxide template remove/i).length).toBeGreaterThan(0);
	});

	it("links to creating and publishing sub-pages", () => {
		render(<DocsTemplatesPage />);

		expect(screen.getAllByText(/creating templates/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/publishing templates/i).length).toBeGreaterThan(0);
	});

	it("explains the oxide new flow step by step", () => {
		render(<DocsTemplatesPage />);

		expect(screen.getByText(/validate the project name/i)).toBeInTheDocument();
		expect(screen.getByText(/ensure the template is available/i)).toBeInTheDocument();
		expect(screen.getByText(/render and copy files/i)).toBeInTheDocument();
	});

	it("documents cache behavior", () => {
		render(<DocsTemplatesPage />);

		expect(screen.getAllByText(/commit sha/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/oxide-templates\.json/i).length).toBeGreaterThan(0);
	});
});
