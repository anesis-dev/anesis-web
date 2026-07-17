import { render, screen } from "@testing-library/react";
import DocsCommandsPage from "@/app/(main)/docs/reference/commands/page";

describe("DocsCommandsPage", () => {
	it("renders the command reference heading and section index", () => {
		render(<DocsCommandsPage />);

		expect(
			screen.getByRole("heading", {
				name: /every anesis command in one place/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: "Projects", level: 2 }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: "Account & session", level: 2 }),
		).toBeInTheDocument();
	});

	it("documents core commands with their usage signatures", () => {
		render(<DocsCommandsPage />);

		expect(
			screen.getByText("anesis new <name> [template_name] [flags]", {
				exact: false,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByText("anesis use [addon_id] [command] [flags]", {
				exact: false,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByText("anesis completions <shell>", { exact: false }),
		).toBeInTheDocument();
	});

	it("shows short aliases for command groups", () => {
		render(<DocsCommandsPage />);

		expect(screen.getByText("anesis t i")).toBeInTheDocument();
		expect(screen.getByText("anesis a p")).toBeInTheDocument();
	});
});
