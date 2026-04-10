import { render, screen } from "@testing-library/react";
import DocsCliPage from "@/app/(main)/docs/cli/page";

describe("DocsCliPage", () => {
	it("documents the current template and addon command groups", () => {
		render(<DocsCliPage />);

		expect(
			screen.getByRole("heading", { name: /use the oxide cli effectively/i }),
		).toBeInTheDocument();
		expect(screen.getByText(/oxide template install <TEMPLATE_NAME>/i)).toBeInTheDocument();
		expect(screen.getByText(/oxide addon install <ADDON_ID>/i)).toBeInTheDocument();
		expect(screen.getAllByText(/oxide <ADDON_ID> <COMMAND>/i).length).toBeGreaterThan(0);
		expect(screen.getByText(/oxide template publish <GITHUB_URL>/i)).toBeInTheDocument();
	});
});
