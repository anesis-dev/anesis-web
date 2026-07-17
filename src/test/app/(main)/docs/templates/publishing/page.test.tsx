import { render, screen } from "@testing-library/react";
import DocsTemplatesPublishingPage from "@/app/(main)/docs/templates/publishing/page";

describe("DocsTemplatesPublishingPage", () => {
	it("renders the publishing templates heading", () => {
		render(<DocsTemplatesPublishingPage />);

		expect(
			screen.getByRole("heading", { name: /publish your template to the registry/i }),
		).toBeInTheDocument();
	});

	it("shows publish and update commands", () => {
		render(<DocsTemplatesPublishingPage />);

		expect(screen.getAllByText(/anesis template publish https:\/\/github\.com\/owner\/repo/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/anesis template update/i).length).toBeGreaterThan(0);
	});

	it("documents the GitHub URL rules", () => {
		render(<DocsTemplatesPublishingPage />);

		expect(screen.getByText(/the host must be/i)).toBeInTheDocument();
		expect(screen.getByText(/tree\/<branch>\/<path>/i)).toBeInTheDocument();
	});

	it("explains what publish does step by step", () => {
		render(<DocsTemplatesPublishingPage />);

		expect(screen.getByText(/validate the url locally/i)).toBeInTheDocument();
		expect(screen.getByText(/backend fetches the tree/i)).toBeInTheDocument();
		expect(screen.getByText(/registry entry is created/i)).toBeInTheDocument();
	});
});
