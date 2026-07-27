import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { StackDetail } from "@/components/stacks/StackDetail";
import { createStack, createUser } from "@/test/fixtures";

vi.mock("@/hooks/useStack", () => ({
	useStack: vi.fn(),
}));

vi.mock("@/hooks/useAuth", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/hooks/useTemplateReadme", () => ({
	useTemplateReadme: vi.fn(() => ({
		readme: "# Nest SaaS",
		fileName: "README.md",
		path: "README.md",
		isLoading: false,
		isError: false,
	})),
}));

vi.mock("@/services/stack", () => ({
	starStack: vi.fn(),
}));

vi.mock("@/components/templates/TemplateReadme", () => ({
	TemplateReadme: ({ content }: { content: string }) => (
		<div data-testid="readme">{content}</div>
	),
}));

vi.mock("@/components/stacks/StackSettings", () => ({
	StackSettings: () => <div data-testid="stack-settings">Settings</div>,
}));

const invalidateQueries = vi.fn();
vi.mock("@tanstack/react-query", async () => {
	const actual =
		await vi.importActual<typeof import("@tanstack/react-query")>(
			"@tanstack/react-query",
		);
	return { ...actual, useQueryClient: () => ({ invalidateQueries }) };
});

import { useStack } from "@/hooks/useStack";
import { useAuth } from "@/hooks/useAuth";
import { starStack } from "@/services/stack";

const stack = createStack();

function mockStack(
	value: ReturnType<typeof createStack> | null,
	overrides: { isLoading?: boolean; isError?: boolean } = {},
) {
	vi.mocked(useStack).mockReturnValue({
		stack: value,
		isLoading: overrides.isLoading ?? false,
		isError: overrides.isError ?? false,
	} as unknown as ReturnType<typeof useStack>);
}

function mockAuth(user: ReturnType<typeof createUser> | null) {
	vi.mocked(useAuth).mockReturnValue({
		user,
		isLoading: false,
	} as unknown as ReturnType<typeof useAuth>);
}

function openTab(name: RegExp) {
	fireEvent.click(screen.getByRole("tab", { name }));
}

describe("StackDetail", () => {
	it("renders the stack header and defaults to the readme tab", () => {
		mockAuth(null);
		mockStack(stack);

		render(<StackDetail stackRef="nest-saas" />);

		expect(screen.getByText("Nest SaaS")).toBeInTheDocument();
		expect(screen.getByTestId("readme")).toHaveTextContent("# Nest SaaS");
	});

	it("shows a not-found state with a way back when the stack cannot be loaded", () => {
		mockAuth(null);
		mockStack(null, { isError: true });

		render(<StackDetail stackRef="ghost" />);

		expect(screen.getByText(/stack not found/i)).toBeInTheDocument();
		expect(screen.getByText("ghost")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /back to stacks/i })).toHaveAttribute(
			"href",
			"/stacks",
		);
	});

	it("shows skeletons while loading instead of a not-found state", () => {
		mockAuth(null);
		mockStack(null, { isLoading: true });

		render(<StackDetail stackRef="nest-saas" />);

		expect(screen.queryByText(/stack not found/i)).not.toBeInTheDocument();
		expect(screen.queryByTestId("readme")).not.toBeInTheDocument();
	});

	it("shows the scaffold command for this stack", () => {
		mockAuth(null);
		mockStack(stack);

		render(<StackDetail stackRef="nest-saas" />);
		openTab(/about/i);

		expect(
			screen.getByText("anesis new my-app --stack nest-saas"),
		).toBeInTheDocument();
	});

	it("lists the template and every addon in order on the composition tab", () => {
		mockAuth(null);
		mockStack(stack);

		render(<StackDetail stackRef="nest-saas" />);
		openTab(/composition/i);

		expect(screen.getByText("nest-express").closest("a")).toHaveAttribute(
			"href",
			"/templates/nest-express",
		);

		const addons = screen.getAllByRole("listitem").map((li) => li.textContent);
		expect(addons[0]).toContain("nest-prisma-v7");
		expect(addons[1]).toContain("docker-compose");
	});

	it("shows pinned inputs alongside the addon that uses them", () => {
		mockAuth(null);
		mockStack(
			createStack({
				config: {
					addons: [
						{
							id: "nest-prisma-v7",
							command: "install",
							inputs: { provider: "postgresql" },
						},
					],
				},
			}),
		);

		render(<StackDetail stackRef="nest-saas" />);
		openTab(/composition/i);

		expect(screen.getByText("provider=postgresql")).toBeInTheDocument();
	});

	it("reports statistics, falling back to zero for missing counters", () => {
		mockAuth(null);
		mockStack(
			createStack({
				download_count: 1234,
				unique_downloaders: undefined,
				star_count: 7,
			}),
		);

		render(<StackDetail stackRef="nest-saas" />);
		openTab(/statistics/i);

		expect(screen.getByText("1,234")).toBeInTheDocument();
		expect(screen.getByText("0")).toBeInTheDocument();
		expect(screen.getByText("Unique downloaders")).toBeInTheDocument();
		expect(screen.getAllByText("7").length).toBeGreaterThan(0);
	});

	describe("settings tab", () => {
		it("is hidden from anonymous visitors", () => {
			mockAuth(null);
			mockStack(stack);

			render(<StackDetail stackRef="nest-saas" />);

			expect(
				screen.queryByRole("tab", { name: /settings/i }),
			).not.toBeInTheDocument();
		});

		it("is hidden from a logged-in user who does not own the stack", () => {
			mockAuth(createUser({ id: "someone-else", role: "user" }));
			mockStack(stack);

			render(<StackDetail stackRef="nest-saas" />);

			expect(
				screen.queryByRole("tab", { name: /settings/i }),
			).not.toBeInTheDocument();
		});

		it("is available to the owner", () => {
			mockAuth(createUser({ id: stack.owner_id, role: "user" }));
			mockStack(stack);

			render(<StackDetail stackRef="nest-saas" />);
			openTab(/settings/i);

			expect(screen.getByTestId("stack-settings")).toBeInTheDocument();
		});

		it("is available to an admin who does not own the stack", () => {
			mockAuth(createUser({ id: "an-admin", role: "admin" }));
			mockStack(stack);

			render(<StackDetail stackRef="nest-saas" />);
			openTab(/settings/i);

			expect(screen.getByTestId("stack-settings")).toBeInTheDocument();
		});
	});

	describe("starring", () => {
		it("is disabled for anonymous visitors", () => {
			mockAuth(null);
			mockStack(stack);

			render(<StackDetail stackRef="nest-saas" />);

			expect(screen.getByRole("button", { name: /star/i })).toBeDisabled();
		});

		it("updates the count from the server response and refreshes the caches", async () => {
			mockAuth(createUser());
			mockStack(stack);
			vi.mocked(starStack).mockResolvedValue({
				is_starred: true,
				star_count: 8,
			} as Awaited<ReturnType<typeof starStack>>);

			render(<StackDetail stackRef="nest-saas" />);
			fireEvent.click(screen.getByRole("button", { name: /star/i }));

			await waitFor(() => expect(starStack).toHaveBeenCalledWith("nest-saas"));
			await waitFor(() => expect(screen.getByText("8")).toBeInTheDocument());

			expect(invalidateQueries).toHaveBeenCalledWith({
				queryKey: ["stack", "nest-saas"],
			});
			expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ["stacks"] });
		});
	});
});
