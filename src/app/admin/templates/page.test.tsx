import { fireEvent, screen, waitFor } from "@testing-library/react";
import AdminTemplatesPage from "@/app/admin/templates/page";
import { renderWithQueryClient } from "@/test/render";
import { createTemplate } from "@/test/fixtures";

vi.mock("@/hooks/useTemplates", () => ({
	useTemplates: vi.fn(),
}));

vi.mock("@/services/template", () => ({
	deleteTemplate: vi.fn(),
	updateTemplateOfficialStatus: vi.fn(),
}));

import { useTemplates } from "@/hooks/useTemplates";
import {
	deleteTemplate,
	updateTemplateOfficialStatus,
} from "@/services/template";

describe("AdminTemplatesPage", () => {
	it("renders moderation controls and filters templates", async () => {
		const templates = Array.from({ length: 11 }, (_, index) =>
			createTemplate({
				id: `admin-template-${index + 1}`,
				name: `template-${index + 1}`,
				config: {
					specialization: index < 5 ? "backend" : "frontend",
					metadata: {
						displayName: `Admin Template ${index + 1}`,
						description: `Description ${index + 1}`,
						tags: [`tag-${index + 1}`],
					},
					author: {
						github: index < 5 ? "api-dev" : "ui-dev",
					},
				},
			}),
		);
		vi.mocked(useTemplates).mockReturnValue({
			templates,
			isLoading: false,
			isError: false,
		});
		renderWithQueryClient(<AdminTemplatesPage />);

		expect(
			screen.getByText(/template moderation actions/i),
		).toBeInTheDocument();
		expect(screen.getByText("11 total")).toBeInTheDocument();

		fireEvent.change(
			screen.getByPlaceholderText(/search by name, author or specialization/i),
			{ target: { value: "backend" } },
		);

		await waitFor(() =>
			expect(screen.getByText("5 / 11")).toBeInTheDocument(),
		);
		expect(screen.getByText("Admin Template 1")).toBeInTheDocument();
		expect(screen.queryByText("Admin Template 11")).not.toBeInTheDocument();
	});

	it("updates template official status through the admin action", async () => {
		const template = createTemplate({
			id: "template-1",
			official: false,
			config: {
				metadata: {
					displayName: "Admin Template 1",
				},
			},
		});
		vi.mocked(useTemplates).mockReturnValue({
			templates: [template],
			isLoading: false,
			isError: false,
		});
		vi.mocked(updateTemplateOfficialStatus).mockResolvedValueOnce(undefined);

		const { queryClient } = renderWithQueryClient(<AdminTemplatesPage />);
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

		fireEvent.click(
			screen.getByRole("button", {
				name: /mark admin template 1 as official/i,
			}),
		);

		await waitFor(() =>
			expect(updateTemplateOfficialStatus).toHaveBeenCalledWith(
				"template-1",
				true,
			),
		);
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["templates"] });
		expect(screen.getByText(/is now marked as official/i)).toBeInTheDocument();
	});

	it("deletes a template through the admin dialog", async () => {
		const template = createTemplate({
			id: "template-2",
			name: "demo-repo",
			version: "1.2.3",
			config: {
				metadata: {
					displayName: "Admin Template 2",
				},
			},
		});
		vi.mocked(useTemplates).mockReturnValue({
			templates: [template],
			isLoading: false,
			isError: false,
		});
		vi.mocked(deleteTemplate).mockResolvedValueOnce(undefined);

		const { queryClient } = renderWithQueryClient(<AdminTemplatesPage />);
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

		fireEvent.click(
			screen.getByRole("button", {
				name: /delete admin template 2/i,
			}),
		);

		expect(screen.getByText(/demo-repo@1.2.3/i)).toBeInTheDocument();

		fireEvent.click(
			screen.getByRole("button", {
				name: /delete template/i,
			}),
		);

		await waitFor(() =>
			expect(deleteTemplate).toHaveBeenCalledWith("demo-repo@1.2.3"),
		);
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["templates"] });
		expect(screen.getByText(/was deleted from the registry/i)).toBeInTheDocument();
	});
});
