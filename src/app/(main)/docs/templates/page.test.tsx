import { render, screen } from "@testing-library/react";
import DocsTemplatesPage from "@/app/(main)/docs/templates/page";

describe("DocsTemplatesPage", () => {
	it("uses the current template publish command and URL guidance", () => {
		render(<DocsTemplatesPage />);

		expect(
			screen.getByRole("heading", { name: /create and publish oxide templates/i }),
		).toBeInTheDocument();
		expect(
			screen.getByText(/oxide template publish https:\/\/github\.com\/owner\/repo\/tree\/main\/my-template/i),
		).toBeInTheDocument();
		expect(screen.getByText(/directory containing the template manifest/i)).toBeInTheDocument();
		expect(screen.getByText(/paste a github repository url or a/i)).toBeInTheDocument();
	});
});
