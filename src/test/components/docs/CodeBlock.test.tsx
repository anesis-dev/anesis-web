import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CodeBlock } from "@/components/docs/CodeBlock";

describe("CodeBlock", () => {
	it("renders formatted code content", () => {
		const { container } = render(<CodeBlock code={'{ "name": "anesis" }'} lang="json" />);

		const code = container.querySelector("code.hljs");
		expect(code).toBeInTheDocument();
		expect(code?.textContent).toBe('{ "name": "anesis" }');
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
