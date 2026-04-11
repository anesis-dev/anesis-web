import { render, screen } from "@testing-library/react";
import DocsAuthenticationPage from "@/app/(main)/docs/authentication/page";

describe("DocsAuthenticationPage", () => {
	it("documents browser login and local auth state", () => {
		render(<DocsAuthenticationPage />);

		expect(
			screen.getByRole("heading", {
				name: /browser login, local session storage, and when auth is actually needed/i,
			}),
		).toBeInTheDocument();
		expect(screen.queryByText(/Go to your browser/i)).not.toBeInTheDocument();
		expect(screen.getByText(/open the browser to/i)).toBeInTheDocument();
		expect(screen.getAllByText(/~\/\.oxide\/auth\.json/i).length).toBeGreaterThan(0);
	});
});
