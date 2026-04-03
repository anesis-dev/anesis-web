import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminTemplatesPage from "@/app/admin/templates/page";
import { createTemplate } from "@/test/fixtures";

vi.mock("@/hooks/useTemplates", () => ({
	useTemplates: vi.fn(),
}));

import { useTemplates } from "@/hooks/useTemplates";

describe("AdminTemplatesPage", () => {
	it("renders moderation guidance and filters templates", async () => {
		const templates = Array.from({ length: 11 }, (_, index) =>
			createTemplate({
				id: `admin-template-${index + 1}`,
				name: `owner/template-${index + 1}`,
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
		render(<AdminTemplatesPage />);

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
});
