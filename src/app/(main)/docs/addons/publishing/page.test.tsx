import { render, screen } from "@testing-library/react";
import DocsAddonsPublishingPage from "@/app/(main)/docs/addons/publishing/page";

describe("DocsAddonsPublishingPage", () => {
	it("renders the publishing addons heading", () => {
		render(<DocsAddonsPublishingPage />);

		expect(
			screen.getByRole("heading", { name: /publish your addon to the registry/i }),
		).toBeInTheDocument();
	});

	it("shows publish and update commands", () => {
		render(<DocsAddonsPublishingPage />);

		expect(screen.getAllByText(/oxide addon publish https:\/\/github\.com\/owner\/repo/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/oxide addon update/i).length).toBeGreaterThan(0);
	});

	it("documents the GitHub URL rules", () => {
		render(<DocsAddonsPublishingPage />);

		expect(screen.getByText(/the host must be `github\.com`/i)).toBeInTheDocument();
	});

	it("explains what publish does step by step", () => {
		render(<DocsAddonsPublishingPage />);

		expect(screen.getByText(/validate the url locally/i)).toBeInTheDocument();
		expect(screen.getByText(/backend fetches the tree/i)).toBeInTheDocument();
		expect(screen.getByText(/registry entry is created/i)).toBeInTheDocument();
	});
});
