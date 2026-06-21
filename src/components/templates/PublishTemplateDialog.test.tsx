import { fireEvent, screen, waitFor } from "@testing-library/react";
import { PublishTemplateDialog } from "@/components/templates/PublishTemplateDialog";
import { renderWithQueryClient } from "@/test/render";

vi.mock("@/services/template", () => ({
	publishTemplate: vi.fn(),
}));

import { publishTemplate } from "@/services/template";

describe("PublishTemplateDialog", () => {
	it("validates github template directory urls before submitting", async () => {
		renderWithQueryClient(<PublishTemplateDialog />);

		fireEvent.click(screen.getByRole("button", { name: /publish template/i }));
		fireEvent.change(screen.getByLabelText(/github template directory url/i), {
			target: { value: "hello" },
		});
		fireEvent.click(screen.getByRole("button", { name: /^publish$/i }));

		expect(
			screen.getByText("Enter a valid absolute URL."),
		).toBeInTheDocument();
		expect(publishTemplate).not.toHaveBeenCalled();
	});

	it("publishes templates and invalidates template queries", async () => {
		vi.mocked(publishTemplate).mockResolvedValueOnce({
			message: "ok",
			name: "demo-repo",
		});
		const { queryClient } = renderWithQueryClient(<PublishTemplateDialog />);
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

		fireEvent.click(screen.getByRole("button", { name: /publish template/i }));
		fireEvent.change(screen.getByLabelText(/github template directory url/i), {
			target: {
				value: "https://github.com/demo-owner/demo-repo/tree/main/template  ",
			},
		});
		fireEvent.click(screen.getByRole("button", { name: /^publish$/i }));

		await waitFor(() =>
			expect(publishTemplate).toHaveBeenCalledWith(
				"https://github.com/demo-owner/demo-repo/tree/main/template",
				"public",
			),
		);
		expect(
			screen.getByText("Published successfully!"),
		).toBeInTheDocument();
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["templates"] });
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["my-templates"] });
	});

	it("shows backend failures inline", async () => {
		vi.mocked(publishTemplate).mockRejectedValueOnce(
			new Error("Template already exists."),
		);
		renderWithQueryClient(<PublishTemplateDialog />);

		fireEvent.click(screen.getByRole("button", { name: /publish template/i }));
		fireEvent.change(screen.getByLabelText(/github template directory url/i), {
			target: {
				value: "https://github.com/demo-owner/demo-repo/tree/main/template",
			},
		});
		fireEvent.click(screen.getByRole("button", { name: /^publish$/i }));

		await waitFor(() =>
			expect(screen.getByText("Template already exists.")).toBeInTheDocument(),
		);
	});
});
