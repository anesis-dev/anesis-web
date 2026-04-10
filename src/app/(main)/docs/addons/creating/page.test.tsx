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
		render(<DocsAddonsCreatingPage />);

		expect(screen.getAllByText(/"schema_version": "1"/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/oxide\.addon\.json/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/schema_version/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/requires/i).length).toBeGreaterThan(0);
	});

	it("documents all input types", () => {
		render(<DocsAddonsCreatingPage />);

		// Input types appear in the JSON code block and descriptions
		expect(screen.getAllByText(/"type": "text"/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/"type": "boolean"/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/"type": "select"/i).length).toBeGreaterThan(0);
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
