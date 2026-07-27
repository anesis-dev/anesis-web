import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { StackSettings } from "@/components/stacks/StackSettings";
import { renderWithQueryClient } from "@/test/render";
import { createStack } from "@/test/fixtures";

vi.mock("@/services/stack", () => ({
	deleteStack: vi.fn(),
	updateStackOfficialStatus: vi.fn(),
	updateStackVisibility: vi.fn(),
}));

import {
	deleteStack,
	updateStackOfficialStatus,
	updateStackVisibility,
} from "@/services/stack";

function openDialog(name: RegExp) {
	fireEvent.click(screen.getByRole("button", { name }));
	return within(screen.getByRole("dialog"));
}

describe("StackSettings", () => {
	describe("official status", () => {
		it("is not offered to a non-admin", () => {
			renderWithQueryClient(<StackSettings stack={createStack()} />);

			expect(screen.queryByText("Official status")).not.toBeInTheDocument();
		});

		it("is offered to an admin", () => {
			renderWithQueryClient(<StackSettings stack={createStack()} isAdmin />);

			expect(screen.getByText("Official status")).toBeInTheDocument();
		});

		it("demotes an official stack back to community", async () => {
			vi.mocked(updateStackOfficialStatus).mockResolvedValue(
				undefined as Awaited<ReturnType<typeof updateStackOfficialStatus>>,
			);
			const stack = createStack({ official: true });
			renderWithQueryClient(<StackSettings stack={stack} isAdmin />);

			fireEvent.click(
				screen.getByRole("button", { name: /mark stack as community/i }),
			);

			await waitFor(() =>
				expect(updateStackOfficialStatus).toHaveBeenCalledWith(stack.id, false),
			);
			expect(
				await screen.findByText(/moved back to community/i),
			).toBeInTheDocument();
		});

		it("promotes a community stack", async () => {
			vi.mocked(updateStackOfficialStatus).mockResolvedValue(
				undefined as Awaited<ReturnType<typeof updateStackOfficialStatus>>,
			);
			const stack = createStack({ official: false });
			renderWithQueryClient(<StackSettings stack={stack} isAdmin />);

			fireEvent.click(
				screen.getByRole("button", { name: /mark stack as official/i }),
			);

			await waitFor(() =>
				expect(updateStackOfficialStatus).toHaveBeenCalledWith(stack.id, true),
			);
		});

		it("reports a failure rather than claiming success", async () => {
			vi.mocked(updateStackOfficialStatus).mockRejectedValue(
				new Error("Admins only"),
			);
			renderWithQueryClient(
				<StackSettings stack={createStack({ official: false })} isAdmin />,
			);

			fireEvent.click(
				screen.getByRole("button", { name: /mark stack as official/i }),
			);

			expect(await screen.findByText("Action failed")).toBeInTheDocument();
			expect(screen.getByText("Admins only")).toBeInTheDocument();
		});
	});

	describe("visibility", () => {
		it("states the current visibility, defaulting to public", () => {
			renderWithQueryClient(
				<StackSettings stack={createStack({ visibility: undefined })} />,
			);

			expect(screen.getByText("Currently public.")).toBeInTheDocument();
		});

		it("saves the selected visibility", async () => {
			vi.mocked(updateStackVisibility).mockResolvedValue(
				undefined as Awaited<ReturnType<typeof updateStackVisibility>>,
			);
			const stack = createStack();
			renderWithQueryClient(<StackSettings stack={stack} />);

			const dialog = openDialog(/change visibility/i);
			fireEvent.change(dialog.getByLabelText("Visibility"), {
				target: { value: "private" },
			});
			fireEvent.click(dialog.getByRole("button", { name: /save/i }));

			await waitFor(() =>
				expect(updateStackVisibility).toHaveBeenCalledWith(stack.id, "private"),
			);
			expect(
				await screen.findByText(/visibility changed to "private"/i),
			).toBeInTheDocument();
		});

		it("does nothing when cancelled", () => {
			renderWithQueryClient(<StackSettings stack={createStack()} />);

			const dialog = openDialog(/change visibility/i);
			fireEvent.click(dialog.getByRole("button", { name: /cancel/i }));

			expect(updateStackVisibility).not.toHaveBeenCalled();
		});
	});

	describe("deletion", () => {
		it("requires confirmation", () => {
			renderWithQueryClient(<StackSettings stack={createStack()} />);

			openDialog(/delete stack/i);

			expect(deleteStack).not.toHaveBeenCalled();
		});

		it("deletes the specific version once confirmed", async () => {
			vi.mocked(deleteStack).mockResolvedValue(
				undefined as Awaited<ReturnType<typeof deleteStack>>,
			);
			renderWithQueryClient(
				<StackSettings stack={createStack({ version: "2.1.0" })} />,
			);

			const dialog = openDialog(/delete stack/i);
			fireEvent.click(dialog.getByRole("button", { name: /delete stack/i }));

			await waitFor(() =>
				expect(deleteStack).toHaveBeenCalledWith("nest-saas", "2.1.0"),
			);
		});

		it("reports a failed delete", async () => {
			vi.mocked(deleteStack).mockRejectedValue(new Error("Not your stack"));
			renderWithQueryClient(<StackSettings stack={createStack()} />);

			const dialog = openDialog(/delete stack/i);
			fireEvent.click(dialog.getByRole("button", { name: /delete stack/i }));

			expect(await screen.findByText("Not your stack")).toBeInTheDocument();
		});
	});
});
