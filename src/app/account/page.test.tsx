import { fireEvent, render, screen } from "@testing-library/react";
import AccountPage from "@/app/account/page";
import {
	createAddon,
	createGitHubUser,
	createTemplate,
	createUser,
} from "@/test/fixtures";

vi.mock("@/hooks/useAuth", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/hooks/useGitHubUser", () => ({
	useGitHubUser: vi.fn(),
}));

vi.mock("@/hooks/useMyTemplates", () => ({
	useMyTemplates: vi.fn(),
}));

vi.mock("@/hooks/useMyAddons", () => ({
	useMyAddons: vi.fn(),
}));

vi.mock("@/components/addons/AddonCard", () => ({
	AddonCard: ({ addon }: { addon: { name: string } }) => (
		<div data-testid="addon-card">{addon.name}</div>
	),
}));

vi.mock("@/components/templates/TemplateCard", () => ({
	TemplateCard: ({ template }: { template: { name: string } }) => (
		<div data-testid="template-card">{template.name}</div>
	),
}));

import { useAuth } from "@/hooks/useAuth";
import { useGitHubUser } from "@/hooks/useGitHubUser";
import { useMyAddons } from "@/hooks/useMyAddons";
import { useMyTemplates } from "@/hooks/useMyTemplates";

describe("AccountPage", () => {
	it("renders a sign-in prompt for guests", () => {
		vi.mocked(useAuth).mockReturnValue({
			user: null,
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});
		vi.mocked(useGitHubUser).mockReturnValue({
			githubUser: undefined,
			isLoading: false,
			isError: false,
		});
		vi.mocked(useMyTemplates).mockReturnValue({
			templates: [],
			isLoading: false,
			isError: false,
		});
		vi.mocked(useMyAddons).mockReturnValue({
			addons: [],
			isLoading: false,
			isError: false,
		});

		render(<AccountPage />);

		expect(screen.getByText("You are not logged in")).toBeInTheDocument();
	});

	it("renders the account profile, admin entrypoint and logout action", async () => {
		const logout = vi.fn();
		vi.mocked(useAuth).mockReturnValue({
			user: createUser({ role: "admin" }),
			isLoading: false,
			login: vi.fn(),
			logout,
		});
		vi.mocked(useGitHubUser).mockReturnValue({
			githubUser: createGitHubUser({ name: "The Octocat", followers: 120 }),
			isLoading: false,
			isError: false,
		});
		vi.mocked(useMyTemplates).mockReturnValue({
			templates: [createTemplate()],
			isLoading: false,
			isError: false,
		});
		vi.mocked(useMyAddons).mockReturnValue({
			addons: [createAddon()],
			isLoading: false,
			isError: false,
		});
		render(<AccountPage />);

		expect(screen.getByRole("heading", { name: "The Octocat" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /admin panel/i })).toHaveAttribute(
			"href",
			"/admin",
		);
		expect(screen.getByText("My Templates")).toBeInTheDocument();
		expect(screen.getByText("My Addons")).toBeInTheDocument();
		expect(screen.getAllByTestId("template-card")).toHaveLength(1);
		expect(screen.getAllByTestId("addon-card")).toHaveLength(1);

		fireEvent.click(screen.getByRole("button", { name: /log out/i }));
		expect(logout).toHaveBeenCalledTimes(1);
	});
});
