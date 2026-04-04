import { Suspense } from "react";
import { act, render, screen } from "@testing-library/react";
import UserProfilePage from "@/app/(main)/user/[login]/page";
import { createGitHubUser, createTemplate } from "@/test/fixtures";

vi.mock("@/hooks/useGitHubUser", () => ({
	useGitHubUser: vi.fn(),
}));

vi.mock("@/hooks/useTemplates", () => ({
	useTemplates: vi.fn(),
}));

vi.mock("@/components/templates/TemplateCard", () => ({
	TemplateCard: ({ template }: { template: { name: string } }) => (
		<div data-testid="template-card">{template.name}</div>
	),
}));

import { useGitHubUser } from "@/hooks/useGitHubUser";
import { useTemplates } from "@/hooks/useTemplates";

describe("UserProfilePage", () => {
	it("renders a not found state when the github user does not exist", async () => {
		vi.mocked(useGitHubUser).mockReturnValue({
			githubUser: undefined,
			isLoading: false,
			isError: true,
		});
		vi.mocked(useTemplates).mockReturnValue({
			templates: [],
			isLoading: false,
			isError: false,
		});

		await act(async () => {
			render(
				<Suspense fallback={null}>
					<UserProfilePage params={Promise.resolve({ login: "missing-user" })} />
				</Suspense>,
			);
		});

		expect(await screen.findByText("User not found")).toBeInTheDocument();
		expect(screen.getByText("@missing-user")).toBeInTheDocument();
	});

	it("renders the github profile and only the user's templates", async () => {
		vi.mocked(useGitHubUser).mockReturnValue({
			githubUser: createGitHubUser(),
			isLoading: false,
			isError: false,
		});
		vi.mocked(useTemplates).mockReturnValue({
			templates: [
				createTemplate(),
				createTemplate({
					id: "template-2",
					name: "template-2",
					config: {
						author: {
							github: "builder",
						},
					},
				}),
			],
			isLoading: false,
			isError: false,
		});

		await act(async () => {
			render(
				<Suspense fallback={null}>
					<UserProfilePage params={Promise.resolve({ login: "OCTOCAT" })} />
				</Suspense>,
			);
		});

		expect(await screen.findByRole("heading", { name: "The Octocat" })).toBeInTheDocument();
		expect(screen.getByText("@octocat")).toBeInTheDocument();
		expect(screen.getAllByTestId("template-card")).toHaveLength(1);
		expect(screen.getByText("demo-repo")).toBeInTheDocument();
	});
});
