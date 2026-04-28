import { render, screen } from "@testing-library/react";
import DocsInstallationPage from "@/app/(main)/docs/installation/page";

describe("DocsInstallationPage", () => {
	it("documents the current npm package, cargo install, and release artifacts", () => {
		render(<DocsInstallationPage />);

		expect(
			screen.getByRole("heading", {
				name: /install anesis from scripts, npm, cargo, or release artifacts/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByText("npm install -g @anesis-cli/anesis", {
				exact: false,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByText("cargo install anesis-cli", {
				exact: false,
			}),
		).toBeInTheDocument();
		expect(screen.getByText(/anesis-linux-aarch64\.tar\.gz/i)).toBeInTheDocument();
	});

	it("documents post-install upgrade and shell completion commands", () => {
		render(<DocsInstallationPage />);

		expect(screen.getByText("anesis upgrade", { exact: false })).toBeInTheDocument();
		expect(
			screen.getByText("anesis completions zsh", { exact: false }),
		).toBeInTheDocument();
		expect(screen.getByText(/bash, zsh, fish, powershell/i)).toBeInTheDocument();
	});
});
