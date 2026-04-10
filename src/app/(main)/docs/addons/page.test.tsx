import { render, screen } from "@testing-library/react";
import DocsAddonsPage from "@/app/(main)/docs/addons/page";

describe("DocsAddonsPage", () => {
	it("describes the current addon CLI flow", () => {
		render(<DocsAddonsPage />);

		expect(
			screen.getByRole("heading", { name: /build safe oxide addons with json manifests/i }),
		).toBeInTheDocument();
		expect(screen.getByText(/oxide addon install drizzle/i)).toBeInTheDocument();
		expect(screen.getByText(/oxide addon install <addon_id>/i)).toBeInTheDocument();
		expect(screen.getByText(/the public cli can cache addons with/i)).toBeInTheDocument();
	});
});
