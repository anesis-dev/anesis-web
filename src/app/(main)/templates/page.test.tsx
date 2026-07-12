import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TemplatesRegistryPage } from "@/components/templates/TemplatesRegistryPage";
import { createTemplate, createUser } from "@/test/fixtures";

vi.mock("@/hooks/useTemplates", () => ({
	useTemplates: vi.fn(),
}));

vi.mock("@/hooks/useAllTemplates", () => ({
	useAllTemplates: vi.fn(() => ({ templates: [], isLoading: false, isError: false })),
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

const PAGE_TEMPLATES = Array.from({ length: 24 }, (_, index) =>
	createTemplate({
		id: `template-${index + 1}`,
		name: `demo-${index + 1}`,
		version: `0.${index}.0`,
		config: {
			metadata: {
				displayName: `Template ${index + 1}`,
				description: `Description ${index + 1}`,
				tags: [`tag-${index + 1}`],
			},
		},
	}),
);

describe("TemplatesRegistryPage", () => {
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

		render(<TemplatesRegistryPage />);

		expect(screen.getByText("Failed to load templates")).toBeInTheDocument();
	});

	it("renders the server-provided page and forwards paging/search to the hook", async () => {
		vi.mocked(useTemplates).mockReturnValue({
			templates: PAGE_TEMPLATES,
			isLoading: false,
			isError: false,
			pagination: { total: 25, page: 1, pageSize: 24, totalPages: 2 },
		});
		vi.mocked(useAuth).mockReturnValue({
			user: createUser(),
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});

		render(<TemplatesRegistryPage />);

		expect(screen.getByText("Publish Template")).toBeInTheDocument();
		expect(
			screen.getByText(
				(_, element) => element?.textContent === "Showing 25 templates",
			),
		).toBeInTheDocument();
		expect(screen.getAllByTestId("template-card")).toHaveLength(24);
		expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();

		// Server pagination: clicking Next re-queries the hook for the next page.
		fireEvent.click(screen.getByRole("button", { name: "Next" }));
		await waitFor(() =>
			expect(useTemplates).toHaveBeenLastCalledWith(
				{ page: 2, pageSize: 24 },
				expect.objectContaining({ search: "" }),
			),
		);

		// Search is applied server-side and resets to the first page.
		fireEvent.change(
			screen.getByPlaceholderText(/search by name or description/i),
			{ target: { value: "special" } },
		);
		await waitFor(() =>
			expect(useTemplates).toHaveBeenLastCalledWith(
				{ page: 1, pageSize: 24 },
				expect.objectContaining({ search: "special" }),
			),
		);
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
			pagination: { total: 1, page: 1, pageSize: 24, totalPages: 1 },
		});
		vi.mocked(useAuth).mockReturnValue({
			user: null,
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});

		render(<TemplatesRegistryPage />);

		expect(screen.getAllByTestId("template-card")).toHaveLength(1);
		expect(screen.getByText("React Vite", { exact: false })).toHaveTextContent(
			"(2)",
		);
		expect(
			screen.getByText((_, element) => element?.textContent === "Showing 1 template"),
		).toBeInTheDocument();
	});
});
