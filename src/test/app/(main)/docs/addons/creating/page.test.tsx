import { render, screen } from "@testing-library/react";
import DocsAddonsCreatingPage from "@/app/(main)/docs/addons/creating/page";

describe("DocsAddonsCreatingPage", () => {
	it("renders the creating addons heading", () => {
		render(<DocsAddonsCreatingPage />);

		expect(
			screen.getByRole("heading", { name: /build your own addon/i }),
		).toBeInTheDocument();
	});

	it("documents the manifest top-level fields", () => {
		const { container } = render(<DocsAddonsCreatingPage />);

		expect(container.textContent).toMatch(/"schema_version": "1"/i);
		expect(screen.getAllByText(/anesis\.addon\.json/i).length).toBeGreaterThan(0);
		expect(container.textContent).toMatch(/schema_version/i);
		expect(container.textContent).toMatch(/requires/i);
	});

	it("documents all input types", () => {
		const { container } = render(<DocsAddonsCreatingPage />);

		expect(container.textContent).toMatch(/"type": "text"/i);
		expect(container.textContent).toMatch(/"type": "boolean"/i);
		expect(container.textContent).toMatch(/"type": "select"/i);
	});

	it("documents derived variable forms", () => {
		render(<DocsAddonsCreatingPage />);

		expect(screen.getAllByText(/package_name_pascal/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/package_name_kebab/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/package_name_snake/i).length).toBeGreaterThan(0);
	});

	it("documents all step types", () => {
		render(<DocsAddonsCreatingPage />);

		expect(screen.getAllByText(/^copy$/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/^create$/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/^inject$/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/^replace$/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/^append$/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/^delete$/i).length).toBeGreaterThan(0);
		expect(screen.getByText(/rename and move/i)).toBeInTheDocument();
	});

	it("documents detect rule types", () => {
		render(<DocsAddonsCreatingPage />);

		expect(screen.getAllByText(/file_exists/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/json_contains/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/toml_contains/i).length).toBeGreaterThan(0);
	});
});
