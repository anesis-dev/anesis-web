import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AccountTemplatesPage from "@/app/account/templates/page";
import { createTemplate, createUser } from "@/test/fixtures";

vi.mock("@/hooks/useAuth", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/hooks/useMyTemplates", () => ({
	useMyTemplates: vi.fn(),
}));

vi.mock("@/components/templates/OwnedTemplateCard", () => ({
	OwnedTemplateCard: ({
		template,
		versionCount,
		isAdmin,
	}: {
		template: { name: string };
		versionCount?: number;
		isAdmin?: boolean;
	}) => (
		<div
			data-testid="owned-template-card"
			data-admin={isAdmin ? "true" : "false"}
		>
			{template.name}
			{versionCount && versionCount > 1 ? ` (${versionCount})` : null}
		</div>
	),
}));

vi.mock("@/components/templates/PublishTemplateDialog", () => ({
	PublishTemplateDialog: () => <div>Publish Template</div>,
}));

import { useAuth } from "@/hooks/useAuth";
import { useMyTemplates } from "@/hooks/useMyTemplates";

const myTemplates = Array.from({ length: 7 }, (_, index) =>
	createTemplate({
		id: `mine-${index + 1}`,
		name: `template-${index + 1}`,
		config: {
			metadata: {
				displayName:
					index === 6 ? "Special Personal Template" : `My Template ${index + 1}`,
				description: `Owned template ${index + 1}`,
			},
		},
	}),
);

describe("AccountTemplatesPage", () => {
	it("asks guests to sign in before viewing private templates", () => {
		vi.mocked(useAuth).mockReturnValue({
			user: null,
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});
		vi.mocked(useMyTemplates).mockReturnValue({
			templates: [],
			isLoading: false,
			isError: false,
		});

		render(<AccountTemplatesPage />);

		expect(screen.getByText("Your templates")).toBeInTheDocument();
		expect(
			screen.getByText(/sign in with github to view templates published from your account/i),
		).toBeInTheDocument();
	});

	it("renders, paginates and filters the signed-in user's templates", async () => {
		vi.mocked(useAuth).mockReturnValue({
			user: createUser({ role: "user" }),
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});
		vi.mocked(useMyTemplates).mockReturnValue({
			templates: myTemplates,
			isLoading: false,
			isError: false,
		});
		render(<AccountTemplatesPage />);

		expect(screen.getByText("Publish Template")).toBeInTheDocument();
		expect(
			screen.getByText("7 package(s) across 7 published version(s)"),
		).toBeInTheDocument();
		expect(screen.getAllByTestId("owned-template-card")).toHaveLength(6);
		expect(
			screen.getAllByTestId("owned-template-card").every((card) =>
				card.getAttribute("data-admin") === "false",
			),
		).toBe(true);

		fireEvent.click(screen.getByRole("button", { name: "Next" }));
		expect(screen.getAllByTestId("owned-template-card")).toHaveLength(1);
		expect(screen.getByText("template-7")).toBeInTheDocument();

		fireEvent.change(screen.getByLabelText(/search your templates/i), {
			target: { value: "special" },
		});

		await waitFor(() =>
			expect(
				screen.getByText("1 package(s) across 7 published version(s)"),
			).toBeInTheDocument(),
		);
		expect(screen.getAllByTestId("owned-template-card")).toHaveLength(1);
		expect(screen.getByText("template-7")).toBeInTheDocument();
	});

	it("groups owned template versions by package name", () => {
		vi.mocked(useAuth).mockReturnValue({
			user: createUser({ role: "user" }),
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});
		vi.mocked(useMyTemplates).mockReturnValue({
			templates: [
				createTemplate({
					id: "new",
					name: "api-template",
					version: "0.2.0",
					versionCount: 2,
				}),
			],
			isLoading: false,
			isError: false,
		});

		render(<AccountTemplatesPage />);

		expect(screen.getAllByTestId("owned-template-card")).toHaveLength(1);
		expect(screen.getByText("api-template", { exact: false })).toHaveTextContent(
			"(2)",
		);
		expect(
			screen.getByText("1 package(s) across 2 published version(s)"),
		).toBeInTheDocument();
	});

	it("enables admin controls on package cards for administrators", () => {
		vi.mocked(useAuth).mockReturnValue({
			user: createUser({ role: "admin" }),
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});
		vi.mocked(useMyTemplates).mockReturnValue({
			templates: [createTemplate({ id: "admin-template", name: "control-room" })],
			isLoading: false,
			isError: false,
		});

		render(<AccountTemplatesPage />);

		expect(
			screen.getByText(/admin sync controls are enabled/i),
		).toBeInTheDocument();
		expect(screen.getByTestId("owned-template-card")).toHaveAttribute(
			"data-admin",
			"true",
		);
	});
});
