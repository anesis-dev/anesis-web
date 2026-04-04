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

	it("resolves relative github links and images", () => {
		render(
			<TemplateReadme
				content={"[Guide](./docs/guide.md)\n\n![Preview](./assets/preview.png)"}
				fileName="README.md"
				sourceUrl="https://github.com/demo-owner/demo-repo/tree/main/template"
				sourcePath="template/README.md"
			/>,
		);

		expect(screen.getByRole("link", { name: "Guide" })).toHaveAttribute(
			"href",
			"https://github.com/demo-owner/demo-repo/blob/main/template/docs/guide.md",
		);
		expect(screen.getByRole("img", { name: "Preview" })).toHaveAttribute(
			"src",
			"https://raw.githubusercontent.com/demo-owner/demo-repo/main/template/assets/preview.png",
		);
	});
});
