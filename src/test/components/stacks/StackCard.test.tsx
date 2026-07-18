import { screen } from "@testing-library/react";
import { StackCard } from "@/components/stacks/StackCard";
import { renderWithQueryClient } from "@/test/render";
import { IStack } from "@/types/stack";

vi.mock("@/hooks/useAuth", () => ({
	useAuth: vi.fn(() => ({ user: null, isLoading: false })),
}));

const mockStack: IStack = {
	id: "stack-uuid-1",
	owner_id: "owner-1",
	url: "https://github.com/anesis-dev/full-stack",
	stack_id: "full-stack",
	name: "Full Stack",
	description: "Next.js template with auth and CI addons pinned.",
	commit_sha: "abc123",
	official: true,
	config: {
		schema_version: "1",
		id: "full-stack",
		name: "Full Stack",
		description: "Next.js template with auth and CI addons pinned.",
		template: "next-starter",
		addons: [{ id: "auth-addon", command: "install" }],
	},
	created_at: "2026-04-10T10:00:00.000Z",
	updated_at: "2026-04-10T10:00:00.000Z",
	star_count: 3,
	is_starred: false,
};

describe("StackCard", () => {
	it("renders stack metadata and links to the stack detail page", () => {
		renderWithQueryClient(<StackCard stack={mockStack} />);

		expect(screen.getByText("Full Stack")).toBeInTheDocument();
		expect(screen.getByText("official")).toBeInTheDocument();
		expect(screen.getByText("next-starter")).toBeInTheDocument();
		expect(screen.getByText("1 addons")).toBeInTheDocument();

		expect(screen.getByRole("link", { name: "Full Stack" })).toHaveAttribute(
			"href",
			"/stacks/full-stack",
		);
	});
});
