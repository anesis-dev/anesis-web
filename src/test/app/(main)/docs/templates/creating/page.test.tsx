import { render, screen } from "@testing-library/react";
import DocsTemplatesCreatingPage from "@/app/(main)/docs/templates/creating/page";

describe("DocsTemplatesCreatingPage", () => {
	it("renders the creating templates heading", () => {
		render(<DocsTemplatesCreatingPage />);

		expect(
			screen.getByRole("heading", { name: /build your own template/i }),
		).toBeInTheDocument();
	});

	it("documents the manifest fields", () => {
		const { container } = render(<DocsTemplatesCreatingPage />);

		expect(container.textContent).toMatch(/"anesisVersion": ">=0\.7\.0"/i);
		expect(screen.getAllByText(/anesis\.template\.json/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/repository\.url/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/metadata\.displayName/i).length).toBeGreaterThan(0);
	});

	it("documents tera variables", () => {
		render(<DocsTemplatesCreatingPage />);

		expect(screen.getAllByText(/project_name_kebab/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/project_name_snake/i).length).toBeGreaterThan(0);
	});

	it("explains the two file types", () => {
		render(<DocsTemplatesCreatingPage />);

		expect(screen.getAllByText(/\.tera files/i).length).toBeGreaterThan(0);
		expect(screen.getByText(/all other files/i)).toBeInTheDocument();
	});

	it("links to the publishing sub-page", () => {
		render(<DocsTemplatesCreatingPage />);

		expect(screen.getByText(/publishing your template/i)).toBeInTheDocument();
	});
});
