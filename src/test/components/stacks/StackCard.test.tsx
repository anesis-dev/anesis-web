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
	version: "1.0.0",
	config: {
		schema_version: "1",
		id: "full-stack",
		name: "Full Stack",
		description: "Next.js template with auth and CI addons pinned.",
		version: "1.0.0",
		author: { name: "Anesis", github: "anesis-dev" },
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
		expect(screen.getByText("Official")).toBeInTheDocument();
		expect(screen.getByText("next-starter")).toBeInTheDocument();
		expect(screen.getByText("auth-addon")).toBeInTheDocument();
		expect(screen.getByText("v1.0.0")).toBeInTheDocument();

		expect(screen.getByRole("link", { name: "Full Stack" })).toHaveAttribute(
			"href",
			"/stacks/full-stack",
		);
	});

	it("links the author to their profile", () => {
		renderWithQueryClient(<StackCard stack={mockStack} />);

		expect(screen.getByRole("link", { name: "@anesis-dev" })).toHaveAttribute(
			"href",
			"/user/anesis-dev",
		);
	});
});
