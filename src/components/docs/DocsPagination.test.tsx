import { render, screen } from "@testing-library/react";
import { DocsPagination } from "@/components/docs/DocsPagination";

describe("DocsPagination", () => {
	it("renders adjacent docs links for known pages", () => {
		render(<DocsPagination currentHref="/docs/templates" />);

		expect(screen.getByRole("link", { name: /authentication/i })).toHaveAttribute(
			"href",
			"/docs/authentication",
		);
		expect(screen.getByRole("link", { name: /creating templates/i })).toHaveAttribute(
			"href",
			"/docs/templates/creating",
		);
	});

	it("returns nothing for unknown pages", () => {
		render(<DocsPagination currentHref="/docs/unknown" />);

		expect(screen.queryByRole("link")).not.toBeInTheDocument();
	});
});
