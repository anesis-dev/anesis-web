import { screen } from "@testing-library/react";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { mockTemplate } from "@/test/fixtures";
import { renderWithQueryClient } from "@/test/render";

vi.mock("@/hooks/useAuth", () => ({
	useAuth: vi.fn(() => ({ user: null, isLoading: false })),
}));

describe("TemplateCard", () => {
	it("renders template metadata and links", () => {
		renderWithQueryClient(<TemplateCard template={mockTemplate} />);

		expect(screen.getByText("Demo Next Template")).toBeInTheDocument();
		expect(screen.getByText("Official")).toBeInTheDocument();
		expect(screen.getByText("react")).toBeInTheDocument();
		expect(screen.getByText("typescript")).toBeInTheDocument();

		expect(screen.getByRole("link", { name: /demo next template/i })).toHaveAttribute(
			"href",
			"/templates/demo-repo%400.1.0",
		);
		expect(screen.getByRole("link", { name: /octocat/i })).toHaveAttribute(
			"href",
			"/user/octocat",
		);
	});
});
