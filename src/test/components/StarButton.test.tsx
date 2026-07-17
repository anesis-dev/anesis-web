import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StarButton } from "@/components/StarButton";

describe("StarButton", () => {
	it("renders the current star count and unstarred label", () => {
		render(
			<StarButton isStarred={false} starCount={7} onToggle={vi.fn()} />,
		);

		expect(screen.getByText("Star")).toBeInTheDocument();
		expect(screen.getByText("7")).toBeInTheDocument();
	});

	it("optimistically increments and calls onToggle when starring", async () => {
		const user = userEvent.setup();
		const onToggle = vi.fn().mockResolvedValue(undefined);

		render(<StarButton isStarred={false} starCount={7} onToggle={onToggle} />);

		await user.click(screen.getByRole("button", { name: /star/i }));

		expect(onToggle).toHaveBeenCalledTimes(1);
		expect(screen.getByText("Starred")).toBeInTheDocument();
		expect(screen.getByText("8")).toBeInTheDocument();
	});

	it("reverts the optimistic state when onToggle rejects", async () => {
		const user = userEvent.setup();
		const onToggle = vi.fn().mockRejectedValue(new Error("nope"));

		render(<StarButton isStarred={false} starCount={7} onToggle={onToggle} />);

		await user.click(screen.getByRole("button", { name: /star/i }));

		await waitFor(() => expect(screen.getByText("Star")).toBeInTheDocument());
		expect(screen.getByText("7")).toBeInTheDocument();
	});

	it("does not toggle when disabled", async () => {
		const user = userEvent.setup();
		const onToggle = vi.fn();

		render(
			<StarButton isStarred={false} starCount={7} onToggle={onToggle} disabled />,
		);

		await user.click(screen.getByRole("button"));
		expect(onToggle).not.toHaveBeenCalled();
	});
});
