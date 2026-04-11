import { render, screen } from "@testing-library/react";
import DocsInstallationPage from "@/app/(main)/docs/installation/page";

describe("DocsInstallationPage", () => {
	it("documents the current npm package, cargo install, and release artifacts", () => {
		render(<DocsInstallationPage />);

		expect(
			screen.getByRole("heading", {
				name: /install oxide from scripts, npm, cargo, or release artifacts/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByText("npm install -g @oxide-cli/oxide", {
				exact: false,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByText("cargo install oxide-cli", {
				exact: false,
			}),
		).toBeInTheDocument();
		expect(screen.getByText(/oxide-linux-aarch64\.tar\.gz/i)).toBeInTheDocument();
	});
});
