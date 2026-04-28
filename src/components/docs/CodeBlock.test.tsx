import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CodeBlock } from "@/components/docs/CodeBlock";

describe("CodeBlock", () => {
	it("renders formatted code content", () => {
		render(<CodeBlock code={'{ "name": "anesis" }'} />);

		expect(screen.getByText('{ "name": "anesis" }')).toBeInTheDocument();
		expect(screen.getByText('{ "name": "anesis" }').tagName).toBe("CODE");
	});

	it("copies code to the clipboard", async () => {
		render(<CodeBlock code="anesis new my-app" />);

		fireEvent.click(screen.getByRole("button", { name: /copy/i }));

		await waitFor(() =>
			expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
				"anesis new my-app",
			),
		);
		expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();
	});
});
