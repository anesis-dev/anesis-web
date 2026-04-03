import { render, screen } from "@testing-library/react";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { mockTemplate } from "@/test/fixtures";

describe("TemplateCard", () => {
	it("renders template metadata and links", () => {
		render(<TemplateCard template={mockTemplate} />);

		expect(screen.getByText("Demo Next Template")).toBeInTheDocument();
		expect(screen.getByText("Official")).toBeInTheDocument();
		expect(screen.getByText("react")).toBeInTheDocument();
		expect(screen.getByText("typescript")).toBeInTheDocument();
		expect(screen.getByText("responsive")).toBeInTheDocument();

		expect(screen.getByRole("link", { name: "Details" })).toHaveAttribute(
			"href",
			"/templates/demo-owner/demo-repo@0.1.0",
		);
		expect(screen.getByRole("link", { name: /octocat/i })).toHaveAttribute(
			"href",
			"/user/octocat",
		);
	});
});
