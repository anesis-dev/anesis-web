import { render, screen } from "@testing-library/react";
import DocsOverviewPage from "@/app/(main)/docs/page";

describe("DocsOverviewPage", () => {
	it("states that registry-backed template resolution is authenticated", () => {
		render(<DocsOverviewPage />);

		expect(
			screen.getByText(
				/authenticate before registry-backed template download, project scaffolding, publishing, and account actions/i,
			),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				/registry-backed template resolution is authenticated, so sign in before running install or scaffold flows against published templates/i,
			),
		).toBeInTheDocument();
	});
});
