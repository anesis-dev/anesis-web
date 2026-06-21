import { Suspense } from "react";
import { act, render, screen } from "@testing-library/react";
import UserProfilePage from "@/app/(main)/user/[login]/page";
import { createGitHubUser, createTemplate } from "@/test/fixtures";

vi.mock("@/hooks/useAuth", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/hooks/useGitHubUser", () => ({
	useGitHubUser: vi.fn(),
}));

vi.mock("@/hooks/useAllTemplates", () => ({
	useAllTemplates: vi.fn(),
}));

vi.mock("@/hooks/useAllAddons", () => ({
	useAllAddons: vi.fn(),
}));

vi.mock("@/hooks/useUserByLogin", () => ({
	useUserByLogin: vi.fn(),
}));

vi.mock("@/hooks/useMyTemplates", () => ({
	useMyTemplates: vi.fn(),
}));

vi.mock("@/hooks/useMyAddons", () => ({
	useMyAddons: vi.fn(),
}));

vi.mock("@/components/templates/TemplateCard", () => ({
	TemplateCard: ({ template }: { template: { name: string } }) => (
		<div data-testid="template-card">{template.name}</div>
	),
}));

import { useAllAddons } from "@/hooks/useAllAddons";
import { useAllTemplates } from "@/hooks/useAllTemplates";
import { useAuth } from "@/hooks/useAuth";
import { useGitHubUser } from "@/hooks/useGitHubUser";
import { useMyAddons } from "@/hooks/useMyAddons";
import { useMyTemplates } from "@/hooks/useMyTemplates";
import { useUserByLogin } from "@/hooks/useUserByLogin";

function setDefaultHooks() {
	vi.mocked(useAuth).mockReturnValue({
		user: undefined,
		isLoading: false,
		login: vi.fn(),
		logout: vi.fn(),
	} as unknown as ReturnType<typeof useAuth>);
	vi.mocked(useUserByLogin).mockReturnValue({
		user: undefined,
		isLoading: false,
		isError: false,
	});
	vi.mocked(useAllTemplates).mockReturnValue({
		templates: [],
		isLoading: false,
		isError: false,
	} as unknown as ReturnType<typeof useAllTemplates>);
	vi.mocked(useAllAddons).mockReturnValue({
		addons: [],
		isLoading: false,
		isError: false,
	} as unknown as ReturnType<typeof useAllAddons>);
	vi.mocked(useMyTemplates).mockReturnValue({
		templates: [],
		pagination: undefined,
		isLoading: false,
		isError: false,
	} as unknown as ReturnType<typeof useMyTemplates>);
	vi.mocked(useMyAddons).mockReturnValue({
		addons: [],
		pagination: undefined,
		isLoading: false,
		isError: false,
	} as unknown as ReturnType<typeof useMyAddons>);
}

async function renderPage(login: string) {
	await act(async () => {
		render(
			<Suspense fallback={null}>
				<UserProfilePage params={Promise.resolve({ login })} />
			</Suspense>,
		);
	});
}

describe("UserProfilePage", () => {
	it("renders a not found state when the github user does not exist", async () => {
		setDefaultHooks();
		vi.mocked(useGitHubUser).mockReturnValue({
			githubUser: undefined,
			isLoading: false,
			isError: true,
		});

		await renderPage("missing-user");

		expect(await screen.findByText("User not found")).toBeInTheDocument();
		expect(screen.getByText("@missing-user")).toBeInTheDocument();
	});

	it("renders the github profile and only the user's templates", async () => {
		setDefaultHooks();
		vi.mocked(useGitHubUser).mockReturnValue({
			githubUser: createGitHubUser(),
			isLoading: false,
			isError: false,
		});
		vi.mocked(useAllTemplates).mockReturnValue({
			templates: [
				createTemplate(),
				createTemplate({
					id: "template-2",
					name: "template-2",
					config: {
						author: {
							github: "builder",
						},
						repository: {
							url: "https://github.com/builder/template-2/tree/main",
						},
					},
				}),
			],
			isLoading: false,
			isError: false,
		} as unknown as ReturnType<typeof useAllTemplates>);

		await renderPage("OCTOCAT");

		expect(
			await screen.findByRole("heading", { name: "The Octocat" }),
		).toBeInTheDocument();
		expect(screen.getByText("@octocat")).toBeInTheDocument();
		expect(screen.getAllByTestId("template-card")).toHaveLength(1);
		expect(screen.getByText("demo-repo")).toBeInTheDocument();
	});
});
