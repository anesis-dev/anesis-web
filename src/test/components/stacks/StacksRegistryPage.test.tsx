import { fireEvent, render, screen } from "@testing-library/react";
import { StacksRegistryPage } from "@/components/stacks/StacksRegistryPage";
import { createStack, createUser } from "@/test/fixtures";

vi.mock("@/hooks/useStacks", () => ({
	useStacks: vi.fn(),
}));

vi.mock("@/hooks/useAuth", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/components/stacks/StackCard", () => ({
	StackCard: ({ stack }: { stack: { name: string } }) => (
		<div data-testid="stack-card">{stack.name}</div>
	),
}));

vi.mock("@/components/stacks/PublishStackDialog", () => ({
	PublishStackDialog: () => <button type="button">Publish stack</button>,
}));

import { useStacks } from "@/hooks/useStacks";
import { useAuth } from "@/hooks/useAuth";

function pagination(overrides: Partial<ReturnType<typeof basePagination>> = {}) {
	return { ...basePagination(), ...overrides };
}

function basePagination() {
	return { total: 0, page: 1, pageSize: 24, totalPages: 1 };
}

function mockStacks(
	stacks: ReturnType<typeof createStack>[],
	overrides: { isLoading?: boolean; isError?: boolean; totalPages?: number } = {},
) {
	vi.mocked(useStacks).mockReturnValue({
		stacks,
		isLoading: overrides.isLoading ?? false,
		isError: overrides.isError ?? false,
		pagination: pagination({
			total: stacks.length,
			totalPages: overrides.totalPages ?? 1,
		}),
	});
}

function mockLoggedOut() {
	const login = vi.fn();
	vi.mocked(useAuth).mockReturnValue({
		user: null,
		isLoading: false,
		login,
	} as unknown as ReturnType<typeof useAuth>);
	return login;
}

function mockLoggedIn() {
	vi.mocked(useAuth).mockReturnValue({
		user: createUser(),
		isLoading: false,
		login: vi.fn(),
	} as unknown as ReturnType<typeof useAuth>);
}

describe("StacksRegistryPage", () => {
	it("renders a card per stack", () => {
		mockLoggedOut();
		mockStacks([
			createStack({ stack_id: "one", name: "One" }),
			createStack({ stack_id: "two", name: "Two" }),
		]);

		render(<StacksRegistryPage />);

		expect(screen.getAllByTestId("stack-card")).toHaveLength(2);
		expect(screen.getByText("One")).toBeInTheDocument();
		expect(screen.getByText("Two")).toBeInTheDocument();
	});

	it("shows an error state when stacks fail to load", () => {
		mockLoggedOut();
		mockStacks([], { isError: true });

		render(<StacksRegistryPage />);

		expect(screen.getByText(/could not load stacks/i)).toBeInTheDocument();
		expect(screen.queryByTestId("stack-card")).not.toBeInTheDocument();
	});

	it("shows skeletons while loading rather than the empty state", () => {
		mockLoggedOut();
		mockStacks([], { isLoading: true });

		render(<StacksRegistryPage />);

		expect(
			screen.queryByText(/no stacks published yet/i),
		).not.toBeInTheDocument();
	});

	it("shows an empty state when the registry has no stacks", () => {
		mockLoggedOut();
		mockStacks([]);

		render(<StacksRegistryPage />);

		expect(screen.getByText(/no stacks published yet/i)).toBeInTheDocument();
	});

	it("sorts official stacks first, then newest", () => {
		mockLoggedOut();
		mockStacks([
			createStack({
				stack_id: "community-new",
				name: "Community New",
				official: false,
				created_at: "2026-05-01T00:00:00Z",
			}),
			createStack({
				stack_id: "official-old",
				name: "Official Old",
				official: true,
				created_at: "2026-01-01T00:00:00Z",
			}),
			createStack({
				stack_id: "community-old",
				name: "Community Old",
				official: false,
				created_at: "2026-02-01T00:00:00Z",
			}),
		]);

		render(<StacksRegistryPage />);

		const names = screen.getAllByTestId("stack-card").map((el) => el.textContent);
		expect(names).toEqual(["Official Old", "Community New", "Community Old"]);
	});

	it("offers a login button instead of publish when logged out", () => {
		const login = mockLoggedOut();
		mockStacks([]);

		render(<StacksRegistryPage />);

		const loginButton = screen.getByRole("button", { name: /login to publish/i });
		fireEvent.click(loginButton);
		expect(login).toHaveBeenCalled();

		expect(
			screen.queryByRole("button", { name: /^publish stack$/i }),
		).not.toBeInTheDocument();
	});

	it("offers the publish dialog when logged in", () => {
		mockLoggedIn();
		mockStacks([]);

		render(<StacksRegistryPage />);

		expect(
			screen.getByRole("button", { name: /^publish stack$/i }),
		).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: /login to publish/i }),
		).not.toBeInTheDocument();
	});

	it("always links to the builder", () => {
		mockLoggedOut();
		mockStacks([]);

		render(<StacksRegistryPage />);

		expect(screen.getByRole("link", { name: /build a stack/i })).toHaveAttribute(
			"href",
			"/builder",
		);
	});

	it("passes the search term through to the query", () => {
		mockLoggedOut();
		mockStacks([]);

		render(<StacksRegistryPage />);

		fireEvent.change(screen.getByPlaceholderText(/search stacks/i), {
			target: { value: "nest" },
		});

		expect(useStacks).toHaveBeenLastCalledWith(
			{ page: 1, pageSize: 24 },
			{ search: "nest" },
		);
	});

	it("resets to the first page when the search changes", () => {
		mockLoggedOut();
		mockStacks([], { totalPages: 5 });

		render(<StacksRegistryPage />);

		fireEvent.click(screen.getByRole("button", { name: /next/i }));
		expect(useStacks).toHaveBeenLastCalledWith(
			{ page: 2, pageSize: 24 },
			{ search: "" },
		);

		fireEvent.change(screen.getByPlaceholderText(/search stacks/i), {
			target: { value: "prisma" },
		});

		expect(useStacks).toHaveBeenLastCalledWith(
			{ page: 1, pageSize: 24 },
			{ search: "prisma" },
		);
	});

	it("hides pagination while loading and on error", () => {
		mockLoggedOut();
		mockStacks([], { isLoading: true, totalPages: 3 });
		const { rerender } = render(<StacksRegistryPage />);
		expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument();

		mockStacks([], { isError: true, totalPages: 3 });
		rerender(<StacksRegistryPage />);
		expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument();
	});
});
