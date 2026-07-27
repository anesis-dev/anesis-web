import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { OwnedStackCard } from "@/components/stacks/OwnedStackCard";
import { renderWithQueryClient } from "@/test/render";
import { createStack } from "@/test/fixtures";

vi.mock("@/services/stack", () => ({
	deleteStack: vi.fn(),
	updateStackVisibility: vi.fn(),
}));

import { deleteStack, updateStackVisibility } from "@/services/stack";

describe("OwnedStackCard", () => {
	it("renders the stack's identity, version, visibility and composition", () => {
		renderWithQueryClient(<OwnedStackCard stack={createStack()} />);

		expect(screen.getByRole("link", { name: "Nest SaaS" })).toHaveAttribute(
			"href",
			"/stacks/nest-saas",
		);
		expect(screen.getByText("v1.0.0")).toBeInTheDocument();
		expect(screen.getByText("official")).toBeInTheDocument();
		expect(screen.getByText("public")).toBeInTheDocument();
		expect(screen.getByText("nest-express")).toBeInTheDocument();
		expect(screen.getByText("2 addons")).toBeInTheDocument();
	});

	it("shows a placeholder instead of an empty description", () => {
		renderWithQueryClient(
			<OwnedStackCard stack={createStack({ description: "" })} />,
		);

		expect(screen.getByText("No description.")).toBeInTheDocument();
	});

	it("marks a private stack as private", () => {
		renderWithQueryClient(
			<OwnedStackCard stack={createStack({ visibility: "private" })} />,
		);

		expect(screen.getByText("private")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /make public/i }),
		).toBeInTheDocument();
	});

	it("toggles visibility through the service", async () => {
		vi.mocked(updateStackVisibility).mockResolvedValue(
			undefined as Awaited<ReturnType<typeof updateStackVisibility>>,
		);
		const stack = createStack();
		renderWithQueryClient(<OwnedStackCard stack={stack} />);

		fireEvent.click(screen.getByRole("button", { name: /make private/i }));

		await waitFor(() =>
			expect(updateStackVisibility).toHaveBeenCalledWith(stack.id, "private"),
		);
	});

	it("surfaces a visibility failure instead of failing silently", async () => {
		vi.mocked(updateStackVisibility).mockRejectedValue(
			new Error("Only the owner can do that"),
		);
		renderWithQueryClient(<OwnedStackCard stack={createStack()} />);

		fireEvent.click(screen.getByRole("button", { name: /make private/i }));

		expect(
			await screen.findByText("Only the owner can do that"),
		).toBeInTheDocument();
	});

	describe("deleting", () => {
		it("asks for confirmation first and names the version being removed", () => {
			renderWithQueryClient(<OwnedStackCard stack={createStack()} />);

			fireEvent.click(screen.getByRole("button", { name: /delete stack/i }));

			expect(screen.getByRole("dialog")).toBeInTheDocument();
			expect(
				screen.getByText(/other published versions are not affected/i),
			).toBeInTheDocument();
			expect(deleteStack).not.toHaveBeenCalled();
		});

		it("deletes only the shown version once confirmed", async () => {
			vi.mocked(deleteStack).mockResolvedValue(
				undefined as Awaited<ReturnType<typeof deleteStack>>,
			);
			renderWithQueryClient(<OwnedStackCard stack={createStack()} />);

			fireEvent.click(screen.getByRole("button", { name: /delete stack/i }));
			const dialog = screen.getByRole("dialog");
			fireEvent.click(
				within(dialog).getByRole("button", { name: /delete stack/i }),
			);

			await waitFor(() =>
				expect(deleteStack).toHaveBeenCalledWith("nest-saas", "1.0.0"),
			);
		});

		it("can be cancelled", () => {
			renderWithQueryClient(<OwnedStackCard stack={createStack()} />);

			fireEvent.click(screen.getByRole("button", { name: /delete stack/i }));
			fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

			expect(deleteStack).not.toHaveBeenCalled();
		});

		it("reports a failed delete", async () => {
			vi.mocked(deleteStack).mockRejectedValue(new Error("Stack not found"));
			renderWithQueryClient(<OwnedStackCard stack={createStack()} />);

			fireEvent.click(screen.getByRole("button", { name: /delete stack/i }));
			const dialog = screen.getByRole("dialog");
			fireEvent.click(
				within(dialog).getByRole("button", { name: /delete stack/i }),
			);

			expect(await screen.findByText("Stack not found")).toBeInTheDocument();
		});
	});

	it("opens the source repository in a new tab safely", () => {
		const stack = createStack();
		renderWithQueryClient(<OwnedStackCard stack={stack} />);

		const link = screen.getByRole("link", { name: /view repository/i });
		expect(link).toHaveAttribute("href", stack.url);
		expect(link).toHaveAttribute("target", "_blank");
		expect(link.getAttribute("rel")).toContain("noopener");
	});
});
