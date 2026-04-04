import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CodeBlock } from "@/components/docs/CodeBlock";

describe("CodeBlock", () => {
	it("renders formatted code content", () => {
		render(<CodeBlock code={'{ "name": "oxide" }'} />);

		expect(screen.getByText('{ "name": "oxide" }')).toBeInTheDocument();
		expect(screen.getByText('{ "name": "oxide" }').tagName).toBe("CODE");
	});

	it("copies code to the clipboard", async () => {
		render(<CodeBlock code="oxide new my-app" />);

		fireEvent.click(screen.getByRole("button", { name: /copy/i }));

		await waitFor(() =>
			expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
				"oxide new my-app",
			),
		);
		expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();
	});
});
