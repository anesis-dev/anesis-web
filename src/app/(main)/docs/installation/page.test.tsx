import { render, screen } from "@testing-library/react";
import DocsInstallationPage from "@/app/(main)/docs/installation/page";

describe("DocsInstallationPage", () => {
	it("includes installer, npm and cargo installation paths", () => {
		render(<DocsInstallationPage />);

		expect(
			screen.getByRole("heading", { name: /install the oxide cli/i }),
		).toBeInTheDocument();
		expect(screen.getByText(/install with npm/i)).toBeInTheDocument();
		expect(screen.getByText(/install with cargo/i)).toBeInTheDocument();
		expect(
			screen.getByText("npm install -g @maksym-zhuk/oxide-cli", {
				exact: false,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByText("cargo install oxide-cli", {
				exact: false,
			}),
		).toBeInTheDocument();
	});
});
