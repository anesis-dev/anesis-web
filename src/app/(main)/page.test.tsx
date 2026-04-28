import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/(main)/page";

vi.mock("@/hooks/useTemplates", () => ({
	useTemplates: vi.fn(),
}));

vi.mock("@/hooks/useAddons", () => ({
	useAddons: vi.fn(),
}));

vi.mock("@/components/templates/TemplateCard", () => ({
	TemplateCard: () => <div data-testid="template-card" />,
}));

vi.mock("@/components/addons/AddonCard", () => ({
	AddonCard: () => <div data-testid="addon-card" />,
}));
import { useAddons } from "@/hooks/useAddons";
import { useTemplates } from "@/hooks/useTemplates";

describe("Home", () => {
	beforeEach(() => {
		vi.mocked(useTemplates).mockReturnValue({
			templates: [],
			isLoading: false,
			isError: false,
		});
		vi.mocked(useAddons).mockReturnValue({
			addons: [],
			isLoading: false,
			isError: false,
		});
	});

	it("shows a compact single-command install card on the hero", () => {
		render(<Home />);

		expect(screen.queryByText(/quick start/i)).not.toBeInTheDocument();
		expect(screen.queryByText(/all installation options/i)).not.toBeInTheDocument();
		expect(
			screen.getByText("npm install -g @anesis-cli/anesis"),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /copy npm install command/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /^copy install command$/i }),
		).toBeInTheDocument();
		expect(screen.queryByText("anesis login")).not.toBeInTheDocument();
	});

	it("copies the npm install command from the command text", async () => {
		render(<Home />);

		fireEvent.click(
			screen.getByRole("button", { name: /copy npm install command/i }),
		);

		await waitFor(() =>
			expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
				"npm install -g @anesis-cli/anesis",
			),
		);
		expect(
			screen.getByRole("button", { name: /install command copied/i }),
		).toBeInTheDocument();
	});

	it("copies the npm install command from the copy button", async () => {
		render(<Home />);

		fireEvent.click(
			screen.getByRole("button", { name: /^copy install command$/i }),
		);

		await waitFor(() =>
			expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
				"npm install -g @anesis-cli/anesis",
			),
		);
		expect(screen.getByText("Copied")).toBeInTheDocument();
	});

	it("surfaces recent addons on the homepage", () => {
		vi.mocked(useAddons).mockReturnValue({
			addons: [
				{
					id: "addon-1",
					owner_id: "owner-1",
					url: "https://github.com/anesis-dev/quality-addon",
					addon_id: "quality-addon",
					name: "quality-addon",
					version: "1.0.0",
					commit_sha: "abc123",
					official: true,
					config: {
						schema_version: "1",
						id: "quality-addon",
						name: "Quality Addon",
						version: "1.0.0",
						description: "Runs repeated project checks.",
						author: "Anesis",
					},
					created_at: "2026-04-10T10:00:00.000Z",
					updated_at: "2026-04-10T10:00:00.000Z",
				},
			],
			isLoading: false,
			isError: false,
		});

		render(<Home />);

		expect(screen.getByText("Recent addons")).toBeInTheDocument();
		expect(
			screen.getByText("Latest automations from the registry"),
		).toBeInTheDocument();
		expect(screen.getByText("Browse addons")).toBeInTheDocument();
		expect(screen.getByText("View all addons")).toBeInTheDocument();
		expect(screen.getAllByTestId("addon-card")).toHaveLength(1);
	});
});
