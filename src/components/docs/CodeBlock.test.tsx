import { render, screen } from "@testing-library/react";
import { CodeBlock } from "@/components/docs/CodeBlock";

describe("CodeBlock", () => {
	it("renders formatted code content", () => {
		render(<CodeBlock code={'{ "name": "oxide" }'} />);

		expect(screen.getByText('{ "name": "oxide" }')).toBeInTheDocument();
		expect(screen.getByText('{ "name": "oxide" }').tagName).toBe("CODE");
	});
});
