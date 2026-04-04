import { fireEvent, screen, waitFor } from "@testing-library/react";
import { TemplateApiUrlButton } from "@/components/templates/TemplateApiUrlButton";
import { createUser } from "@/test/fixtures";
import { renderWithQueryClient } from "@/test/render";

vi.mock("@/hooks/useAuth", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/services/template", () => ({
	fetchTemplateUrl: vi.fn(),
}));

import { useAuth } from "@/hooks/useAuth";
import { fetchTemplateUrl } from "@/services/template";

describe("TemplateApiUrlButton", () => {
	it("triggers login when the user is not authenticated", async () => {
		const login = vi.fn();
		vi.mocked(useAuth).mockReturnValue({
			user: null,
			isLoading: false,
			login,
			logout: vi.fn(),
		});
		renderWithQueryClient(
			<TemplateApiUrlButton templateRef="demo-repo@0.1.0" />,
		);

		fireEvent.click(screen.getByRole("button", { name: /copy api url/i }));

		expect(login).toHaveBeenCalledTimes(1);
		expect(fetchTemplateUrl).not.toHaveBeenCalled();
	});

	it("copies the template api url for authenticated users", async () => {
		vi.mocked(useAuth).mockReturnValue({
			user: createUser(),
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});
		vi.mocked(fetchTemplateUrl).mockResolvedValueOnce({
			url: "https://api.example.test/template/demo-repo@0.1.0",
		});
		const onMessage = vi.fn();

		renderWithQueryClient(
			<TemplateApiUrlButton
				templateRef="demo-repo@0.1.0"
				onMessage={onMessage}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: /copy api url/i }));

		await waitFor(() =>
			expect(fetchTemplateUrl).toHaveBeenCalledWith(
				"demo-repo@0.1.0",
			),
		);
		expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
			"https://api.example.test/template/demo-repo@0.1.0",
		);
		expect(onMessage).toHaveBeenCalledWith(
			"Template API URL copied to clipboard.",
			"success",
		);
		expect(screen.getByRole("button", { name: /copied url/i })).toBeInTheDocument();
	});

	it("falls back to opening a new tab when clipboard access is unavailable", async () => {
		vi.mocked(useAuth).mockReturnValue({
			user: createUser(),
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});
		vi.mocked(fetchTemplateUrl).mockResolvedValueOnce({
			url: "https://api.example.test/template/demo-repo@0.1.0",
		});
		const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
		const originalWriteText = navigator.clipboard.writeText;
		Object.assign(navigator.clipboard, { writeText: undefined });
		const onMessage = vi.fn();

		renderWithQueryClient(
			<TemplateApiUrlButton
				templateRef="demo-repo@0.1.0"
				onMessage={onMessage}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: /copy api url/i }));

		await waitFor(() =>
			expect(openSpy).toHaveBeenCalledWith(
				"https://api.example.test/template/demo-repo@0.1.0",
				"_blank",
				"noopener,noreferrer",
			),
		);
		expect(onMessage).toHaveBeenCalledWith(
			"Template API URL opened in a new tab.",
			"success",
		);

		Object.assign(navigator.clipboard, { writeText: originalWriteText });
	});

	it("surfaces api failures through the callback", async () => {
		vi.mocked(useAuth).mockReturnValue({
			user: createUser(),
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});
		vi.mocked(fetchTemplateUrl).mockRejectedValueOnce(
			new Error("Failed to load template API URL."),
		);
		const onMessage = vi.fn();

		renderWithQueryClient(
			<TemplateApiUrlButton
				templateRef="demo-repo@0.1.0"
				onMessage={onMessage}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: /copy api url/i }));

		await waitFor(() =>
			expect(onMessage).toHaveBeenCalledWith(
				"Failed to load template API URL.",
				"error",
			),
		);
	});
});
