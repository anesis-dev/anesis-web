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
	TemplateCard: ({
		template,
		versionCount,
	}: {
		template: { config: { metadata: { displayName: string } } };
		versionCount?: number;
	}) => (
		<div data-testid="template-card">
			{template.config.metadata.displayName}
			{versionCount && versionCount > 1 ? ` (${versionCount})` : null}
		</div>
	),
}));

vi.mock("@/components/templates/PublishTemplateDialog", () => ({
	PublishTemplateDialog: () => <div>Publish Template</div>,
}));

import { useAuth } from "@/hooks/useAuth";
import { useTemplates } from "@/hooks/useTemplates";

const TEMPLATE_COUNT = 25;
const SPECIAL_INDEX = TEMPLATE_COUNT - 1;

const templates = Array.from({ length: TEMPLATE_COUNT }, (_, index) =>
	createTemplate({
		id: `template-${index + 1}`,
		name: `demo-${index + 1}`,
		version: `0.${index}.0`,
		config: {
			metadata: {
				displayName:
					index === SPECIAL_INDEX
						? "Special Template 25"
						: `Template ${index + 1}`,
				description:
					index === SPECIAL_INDEX
						? "Contains a unique search term."
						: `Description ${index + 1}`,
				tags: [index === SPECIAL_INDEX ? "special" : `tag-${index + 1}`],
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
				element?.textContent === "Showing 25 templates",
			),
		).toBeInTheDocument();
		expect(screen.getAllByTestId("template-card")).toHaveLength(24);

		fireEvent.click(screen.getByRole("button", { name: "Next" }));
		expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
		expect(screen.getAllByTestId("template-card")).toHaveLength(1);
		expect(screen.getByText("Special Template 25")).toBeInTheDocument();

		fireEvent.change(
			screen.getByPlaceholderText(/search by name or description/i),
			{ target: { value: "special" } },
		);

		await waitFor(() =>
			expect(
				screen.getByText(
					(_, element) => element?.textContent === "Showing 1 of 25 templates",
				),
			).toBeInTheDocument(),
		);
		expect(screen.getAllByTestId("template-card")).toHaveLength(1);
		expect(screen.getByText("Special Template 25")).toBeInTheDocument();
		expect(screen.queryByText("Page 2 of 2")).not.toBeInTheDocument();
	});

	it("shows grouped template payloads with the backend-provided version count", () => {
		vi.mocked(useTemplates).mockReturnValue({
			templates: [
				createTemplate({
					id: "react-new",
					name: "react-vite",
					version: "0.3.0",
					versionCount: 2,
					config: { metadata: { displayName: "React Vite", description: "", tags: [] } },
				}),
			],
			isLoading: false,
			isError: false,
		});
		vi.mocked(useAuth).mockReturnValue({
			user: null,
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});

		render(<TemplatesPage />);

		expect(screen.getAllByTestId("template-card")).toHaveLength(1);
		expect(screen.getByText("React Vite", { exact: false })).toHaveTextContent(
			"(2)",
		);
		expect(
			screen.getByText((_, element) =>
				element?.textContent === "Showing 1 template",
			),
		).toBeInTheDocument();
	});
});
