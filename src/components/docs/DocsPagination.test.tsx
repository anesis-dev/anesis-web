import { render, screen } from "@testing-library/react";
import { DocsPagination } from "@/components/docs/DocsPagination";

describe("DocsPagination", () => {
	it("renders adjacent docs links for known pages", () => {
		render(<DocsPagination currentHref="/docs/templates" />);

		expect(screen.getByRole("link", { name: /cli/i })).toHaveAttribute(
			"href",
			"/docs/cli",
		);
		expect(screen.getByRole("link", { name: /addons/i })).toHaveAttribute(
			"href",
			"/docs/addons",
		);
	});

	it("returns nothing for unknown pages", () => {
		render(<DocsPagination currentHref="/docs/unknown" />);

		expect(screen.queryByRole("link")).not.toBeInTheDocument();
	});
});
