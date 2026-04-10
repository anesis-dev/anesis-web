import { render, screen } from "@testing-library/react";
import Home from "@/app/(main)/page";

vi.mock("@/hooks/useAuth", () => ({
	useAuth: vi.fn(),
}));

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

vi.mock("@/components/templates/PublishTemplateDialog", () => ({
	PublishTemplateDialog: () => <div data-testid="publish-template-dialog" />,
}));

import { useAuth } from "@/hooks/useAuth";
import { useAddons } from "@/hooks/useAddons";
import { useTemplates } from "@/hooks/useTemplates";

describe("Home", () => {
	beforeEach(() => {
		vi.mocked(useAuth).mockReturnValue({
			user: null,
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});
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

		expect(screen.getByText(/^Install Oxide$/)).toBeInTheDocument();
		expect(screen.queryByText(/quick start/i)).not.toBeInTheDocument();
		expect(screen.queryByText(/all installation options/i)).not.toBeInTheDocument();
		expect(
			screen.getByText(
				/curl -sSL https:\/\/raw\.githubusercontent\.com\/oxide-cli\/oxide\/main\/install\.sh \| bash/i,
			),
		).toBeInTheDocument();
		expect(screen.queryByText("oxide login")).not.toBeInTheDocument();
	});

	it("surfaces recent addons on the homepage", () => {
		vi.mocked(useAddons).mockReturnValue({
			addons: [
				{
					id: "addon-1",
					owner_id: "owner-1",
					url: "https://github.com/oxide-cli/quality-addon",
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
						author: "Oxide",
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
