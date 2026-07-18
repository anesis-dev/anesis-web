import { fireEvent, screen, waitFor } from "@testing-library/react";
import { PublishStackDialog } from "@/components/stacks/PublishStackDialog";
import { publishStack } from "@/services/stack";
import { renderWithQueryClient } from "@/test/render";

vi.mock("@/services/stack", () => ({
	publishStack: vi.fn(),
}));

describe("PublishStackDialog", () => {
	it("rejects non-GitHub-tree URLs before calling the API", async () => {
		renderWithQueryClient(<PublishStackDialog />);

		fireEvent.click(screen.getByRole("button", { name: /publish stack/i }));
		fireEvent.change(screen.getByLabelText(/github stack directory url/i), {
			target: { value: "https://example.com/not-github" },
		});
		fireEvent.click(screen.getByRole("button", { name: /^publish$/i }));

		expect(
			await screen.findByText(/only github repository urls are supported/i),
		).toBeInTheDocument();
		expect(publishStack).not.toHaveBeenCalled();
	});

	it("publishes the stack and shows a success confirmation", async () => {
		vi.mocked(publishStack).mockResolvedValue({
			message: "ok",
			stack_id: "full-stack",
		});

		renderWithQueryClient(<PublishStackDialog />);

		fireEvent.click(screen.getByRole("button", { name: /publish stack/i }));
		fireEvent.change(screen.getByLabelText(/github stack directory url/i), {
			target: { value: "https://github.com/owner/repo/tree/main/stack" },
		});
		fireEvent.click(screen.getByRole("button", { name: /^publish$/i }));

		await waitFor(() =>
			expect(publishStack).toHaveBeenCalledWith(
				"https://github.com/owner/repo/tree/main/stack",
			),
		);
		expect(await screen.findByText(/published successfully/i)).toBeInTheDocument();
		expect(screen.getByText("full-stack")).toBeInTheDocument();
	});
});
