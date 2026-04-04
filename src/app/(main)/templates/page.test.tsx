import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import TemplatesPage from "@/app/(main)/templates/page";
import { createTemplate, createUser } from "@/test/fixtures";

vi.mock("@/hooks/useTemplates", () => ({
	useTemplates: vi.fn(),
}));

vi.mock("@/hooks/useAuth", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/components/templates/TemplateCard", () => ({
	TemplateCard: ({ template }: { template: { config: { metadata: { displayName: string } } } }) => (
		<div data-testid="template-card">{template.config.metadata.displayName}</div>
	),
}));

vi.mock("@/components/templates/PublishTemplateDialog", () => ({
	PublishTemplateDialog: () => <div>Publish Template</div>,
}));

import { useAuth } from "@/hooks/useAuth";
import { useTemplates } from "@/hooks/useTemplates";

const templates = Array.from({ length: 13 }, (_, index) =>
	createTemplate({
		id: `template-${index + 1}`,
		name: `demo-${index + 1}`,
		version: `0.${index}.0`,
		config: {
			metadata: {
				displayName:
					index === 12 ? "Special Template 13" : `Template ${index + 1}`,
				description:
					index === 12 ? "Contains a unique search term." : `Description ${index + 1}`,
				tags: [index === 12 ? "special" : `tag-${index + 1}`],
			},
		},
	}),
);

describe("TemplatesPage", () => {
	it("shows an error state when templates fail to load", () => {
		vi.mocked(useTemplates).mockReturnValue({
			templates: [],
			isLoading: false,
			isError: true,
		});
		vi.mocked(useAuth).mockReturnValue({
			user: null,
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});

		render(<TemplatesPage />);

		expect(screen.getByText("Failed to load templates")).toBeInTheDocument();
	});

	it("renders published templates with filtering and pagination", async () => {
		vi.mocked(useTemplates).mockReturnValue({
			templates,
			isLoading: false,
			isError: false,
		});
		vi.mocked(useAuth).mockReturnValue({
			user: createUser(),
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});
		render(<TemplatesPage />);

		expect(screen.getByText("Publish Template")).toBeInTheDocument();
		expect(
			screen.getByText((_, element) =>
				element?.textContent === "Showing 13 templates",
			),
		).toBeInTheDocument();
		expect(screen.getAllByTestId("template-card")).toHaveLength(12);

		fireEvent.click(screen.getByRole("button", { name: "Next" }));
		expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
		expect(screen.getAllByTestId("template-card")).toHaveLength(1);
		expect(screen.getByText("Special Template 13")).toBeInTheDocument();

		fireEvent.change(
			screen.getByPlaceholderText(/search by name, description or tag/i),
			{ target: { value: "special" } },
		);

		await waitFor(() =>
			expect(
				screen.getByText(
					(_, element) => element?.textContent === "Showing 1 of 13 templates",
				),
			).toBeInTheDocument(),
		);
		expect(screen.getAllByTestId("template-card")).toHaveLength(1);
		expect(screen.getByText("Special Template 13")).toBeInTheDocument();
		expect(screen.queryByText("Page 2 of 2")).not.toBeInTheDocument();
	});
});
