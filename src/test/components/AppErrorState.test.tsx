import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppErrorState } from "@/components/AppErrorState";

describe("AppErrorState", () => {
	it("renders the title and description", () => {
		render(
			<AppErrorState
				title="Something broke"
				description="Please try again later."
				reset={vi.fn()}
			/>,
		);

		expect(
			screen.getByRole("heading", { name: "Something broke" }),
		).toBeInTheDocument();
		expect(screen.getByText("Please try again later.")).toBeInTheDocument();
	});

	it("calls reset when the retry button is clicked", async () => {
		const user = userEvent.setup();
		const reset = vi.fn();

		render(
			<AppErrorState title="Oops" description="error" reset={reset} />,
		);

		await user.click(screen.getByRole("button", { name: /try again/i }));
		expect(reset).toHaveBeenCalledTimes(1);
	});

	it("links back to the home page", () => {
		render(<AppErrorState title="Oops" description="error" reset={vi.fn()} />);

		expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute(
			"href",
			"/",
		);
	});
});
