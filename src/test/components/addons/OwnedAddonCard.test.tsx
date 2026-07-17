import { fireEvent, screen, waitFor } from "@testing-library/react";
import { OwnedAddonCard } from "@/components/addons/OwnedAddonCard";
import { mockAddon } from "@/test/fixtures";
import { renderWithQueryClient } from "@/test/render";

vi.mock("@/services/addon", () => ({
	deleteAddon: vi.fn(),
	updateAddon: vi.fn(),
	updateAddonOfficialStatus: vi.fn(),
}));

import { deleteAddon, updateAddon } from "@/services/addon";

describe("OwnedAddonCard", () => {
	it("renders owner actions and entry links", () => {
		renderWithQueryClient(<OwnedAddonCard addon={mockAddon} />);

		expect(
			screen.getByRole("link", { name: /open package/i }),
		).toHaveAttribute("href", "/addons/drizzle%401.0.0");
		expect(
			screen.getByRole("link", { name: /open repository for drizzle orm/i }),
		).toHaveAttribute(
			"href",
			"https://github.com/anesis-addons/drizzle/tree/main",
		);
		expect(
			screen.getByRole("button", { name: /update addon drizzle orm/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /delete addon drizzle orm/i }),
		).toBeInTheDocument();
	});

	it("refreshes addon metadata and invalidates related queries", async () => {
		vi.mocked(updateAddon).mockResolvedValueOnce(undefined);
		const { queryClient } = renderWithQueryClient(
			<OwnedAddonCard addon={mockAddon} />,
		);
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

		fireEvent.click(
			screen.getByRole("button", { name: /update addon drizzle orm/i }),
		);

		await waitFor(() => expect(updateAddon).toHaveBeenCalledWith(mockAddon.url));
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["addons"] });
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["addons", "my"] });
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["addon", "drizzle@1.0.0"],
		});
		expect(screen.getByText("Action completed")).toBeInTheDocument();
		expect(
			screen.getByText("Addon metadata refreshed from GitHub."),
		).toBeInTheDocument();
	});

	it("shows refresh failures inline", async () => {
		vi.mocked(updateAddon).mockRejectedValueOnce(new Error("Refresh failed"));
		renderWithQueryClient(<OwnedAddonCard addon={mockAddon} />);

		fireEvent.click(
			screen.getByRole("button", { name: /update addon drizzle orm/i }),
		);

		await waitFor(() =>
			expect(screen.getByText("Action failed")).toBeInTheDocument(),
		);
		expect(screen.getByText("Refresh failed")).toBeInTheDocument();
	});

	it("deletes addons after confirmation", async () => {
		vi.mocked(deleteAddon).mockResolvedValueOnce(undefined);
		const { queryClient } = renderWithQueryClient(
			<OwnedAddonCard addon={mockAddon} />,
		);
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const removeSpy = vi.spyOn(queryClient, "removeQueries");

		fireEvent.click(
			screen.getAllByRole("button", { name: /delete addon drizzle orm/i })[0],
		);
		fireEvent.click(screen.getByRole("button", { name: /delete addon/i }));

		await waitFor(() =>
			expect(deleteAddon).toHaveBeenCalledWith("drizzle", "1.0.0"),
		);
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["addons"] });
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["addons", "my"] });
		expect(removeSpy).toHaveBeenCalledWith({
			queryKey: ["addon", "drizzle@1.0.0"],
		});
		expect(screen.getByText("Action completed")).toBeInTheDocument();
		expect(
			screen.getByText("Addon removed from the registry."),
		).toBeInTheDocument();
	});
});
