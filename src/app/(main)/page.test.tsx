import { render, screen } from "@testing-library/react";
import Home from "@/app/(main)/page";

vi.mock("@/hooks/useAuth", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/hooks/useTemplates", () => ({
	useTemplates: vi.fn(),
}));

vi.mock("@/components/templates/TemplateCard", () => ({
	TemplateCard: () => <div data-testid="template-card" />,
}));

vi.mock("@/components/templates/PublishTemplateDialog", () => ({
	PublishTemplateDialog: () => <div data-testid="publish-template-dialog" />,
}));

import { useAuth } from "@/hooks/useAuth";
import { useTemplates } from "@/hooks/useTemplates";

describe("Home", () => {
	it("shows a compact single-command install card on the hero", () => {
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
});
