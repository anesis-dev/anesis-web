import { render, screen } from "@testing-library/react";
import { TemplateReadme } from "@/components/templates/TemplateReadme";

describe("TemplateReadme", () => {
	it("renders a loading state", () => {
		render(<TemplateReadme content={null} isLoading />);
		expect(screen.getByText("Loading README...")).toBeInTheDocument();
	});

	it("renders an error state", () => {
		render(<TemplateReadme content={null} isError />);
		expect(screen.getByText("README could not be loaded")).toBeInTheDocument();
	});

	it("renders an empty state", () => {
		render(<TemplateReadme content={null} />);
		expect(screen.getByText("README not found")).toBeInTheDocument();
	});

	it("renders markdown content", () => {
		render(
			<TemplateReadme
				content={"# Demo\n\nVisit [GitHub](https://github.com/demo-owner/demo-repo)."}
				fileName="README.md"
			/>,
		);

		expect(screen.getByRole("heading", { name: "Demo" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
			"href",
			"https://github.com/demo-owner/demo-repo",
		);
	});
});
