import { fireEvent, render, screen } from "@testing-library/react";
import { PaginationControls } from "@/components/PaginationControls";

describe("PaginationControls", () => {
	it("does not render when only one page is available", () => {
		render(
			<PaginationControls page={1} totalPages={1} onPageChange={vi.fn()} />,
		);

		expect(screen.queryByText(/Page 1 of 1/i)).not.toBeInTheDocument();
	});

	it("renders current pagination details and triggers page changes", () => {
		const onPageChange = vi.fn();
		render(
			<PaginationControls page={2} totalPages={4} onPageChange={onPageChange} />,
		);

		expect(screen.getByText("Page 2 of 4")).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: "Previous" }));
		fireEvent.click(screen.getByRole("button", { name: "Next" }));

		expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
		expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
	});

	it("disables boundary controls", () => {
		render(
			<PaginationControls page={1} totalPages={3} onPageChange={vi.fn()} />,
		);

		expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
	});
});
