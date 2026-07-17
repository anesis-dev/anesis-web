import { fireEvent, screen, waitFor } from "@testing-library/react";
import { OwnedTemplateCard } from "@/components/templates/OwnedTemplateCard";
import { renderWithQueryClient } from "@/test/render";
import { mockTemplate } from "@/test/fixtures";

vi.mock("@/services/template", () => ({
	updateTemplate: vi.fn(),
	updateTemplateAsOfficial: vi.fn(),
	deleteTemplate: vi.fn(),
}));

import {
	deleteTemplate,
	updateTemplate,
	updateTemplateAsOfficial,
} from "@/services/template";

describe("OwnedTemplateCard", () => {
	it("renders owner actions without the api url button", () => {
		renderWithQueryClient(<OwnedTemplateCard template={mockTemplate} />);

		expect(
			screen.getAllByRole("link", { name: /open package/i }).length,
		).toBeGreaterThan(0);
		expect(
			screen.getByRole("button", { name: /update template/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /delete template/i }),
		).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: /update as official/i }),
		).not.toBeInTheDocument();
		expect(screen.queryByRole("button", { name: /copy api url/i })).not.toBeInTheDocument();
	});

	it("refreshes template metadata and invalidates related queries", async () => {
		vi.mocked(updateTemplate).mockResolvedValueOnce(undefined);
		const { queryClient } = renderWithQueryClient(
			<OwnedTemplateCard template={mockTemplate} />,
		);
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

		fireEvent.click(screen.getByRole("button", { name: /update template/i }));

		await waitFor(() =>
			expect(updateTemplate).toHaveBeenCalledWith(mockTemplate.url),
		);
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["templates"] });
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["my-templates"] });
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["template", "demo-repo@0.1.0"],
		});
		expect(screen.getByText("Action completed")).toBeInTheDocument();
		expect(
			screen.getByText("Template metadata refreshed from GitHub."),
		).toBeInTheDocument();
	});

	it("shows the admin refresh action only for administrators", () => {
		renderWithQueryClient(
			<OwnedTemplateCard template={mockTemplate} isAdmin />,
		);

		expect(
			screen.getByRole("button", { name: /update as official/i }),
		).toBeInTheDocument();
	});

	it("refreshes official template metadata for administrators", async () => {
		vi.mocked(updateTemplateAsOfficial).mockResolvedValueOnce(undefined);
		const { queryClient } = renderWithQueryClient(
			<OwnedTemplateCard template={mockTemplate} isAdmin />,
		);
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

		fireEvent.click(
			screen.getByRole("button", { name: /update as official/i }),
		);

		await waitFor(() =>
			expect(updateTemplateAsOfficial).toHaveBeenCalledWith(mockTemplate.url),
		);
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["templates"] });
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["my-templates"] });
		expect(screen.getByText("Action completed")).toBeInTheDocument();
		expect(
			screen.getByText(/refreshed from github and kept official/i),
		).toBeInTheDocument();
	});

	it("shows refresh failures inline", async () => {
		vi.mocked(updateTemplate).mockRejectedValueOnce(new Error("Refresh failed"));
		renderWithQueryClient(<OwnedTemplateCard template={mockTemplate} />);

		fireEvent.click(screen.getByRole("button", { name: /update template/i }));

		await waitFor(() =>
			expect(screen.getByText("Action failed")).toBeInTheDocument(),
		);
		expect(screen.getByText("Refresh failed")).toBeInTheDocument();
	});

	it("deletes templates after confirmation", async () => {
		vi.mocked(deleteTemplate).mockResolvedValueOnce(undefined);
		const { queryClient } = renderWithQueryClient(
			<OwnedTemplateCard template={mockTemplate} />,
		);
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const removeSpy = vi.spyOn(queryClient, "removeQueries");

		fireEvent.click(screen.getAllByRole("button", { name: /delete template/i })[0]);
		fireEvent.click(screen.getByRole("button", { name: /delete template/i }));
		
		await waitFor(() =>
			expect(deleteTemplate).toHaveBeenCalledWith(
				"demo-repo@0.1.0",
			),
		);
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["templates"] });
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["my-templates"] });
		expect(removeSpy).toHaveBeenCalledWith({
			queryKey: ["template", "demo-repo@0.1.0"],
		});
	});
});
