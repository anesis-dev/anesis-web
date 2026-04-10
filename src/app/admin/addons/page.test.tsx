import { fireEvent, screen, waitFor } from "@testing-library/react";
import AdminAddonsPage from "@/app/admin/addons/page";
import { renderWithQueryClient } from "@/test/render";
import { createAddon } from "@/test/fixtures";

vi.mock("@/hooks/useAddons", () => ({
	useAddons: vi.fn(),
}));

vi.mock("@/services/addon", () => ({
	deleteAddon: vi.fn(),
}));

import { useAddons } from "@/hooks/useAddons";
import { deleteAddon } from "@/services/addon";

describe("AdminAddonsPage", () => {
	it("renders moderation controls and filters addons", async () => {
		const addons = Array.from({ length: 11 }, (_, index) =>
			createAddon({
				id: `admin-addon-${index + 1}`,
				addon_id: `addon-${index + 1}`,
				name: `Addon ${index + 1}`,
				config: {
					id: `addon-${index + 1}`,
					name: `Addon ${index + 1}`,
					author: index < 5 ? "oxide-core" : "community",
				},
			}),
		);

		vi.mocked(useAddons).mockReturnValue({
			addons,
			isLoading: false,
			isError: false,
		});

		renderWithQueryClient(<AdminAddonsPage />);

		expect(screen.getByText(/addon moderation actions/i)).toBeInTheDocument();
		expect(screen.getByText("11 total")).toBeInTheDocument();

		fireEvent.change(
			screen.getByPlaceholderText(/search by addon id, name, author or version/i),
			{ target: { value: "oxide-core" } },
		);

		await waitFor(() =>
			expect(screen.getByText("5 / 11")).toBeInTheDocument(),
		);
		expect(screen.getByText("Addon 1")).toBeInTheDocument();
		expect(screen.queryByText("Addon 11")).not.toBeInTheDocument();
	});

	it("deletes an addon through the admin dialog", async () => {
		const addon = createAddon({
			id: "addon-2",
			addon_id: "drizzle",
			name: "Drizzle ORM",
			version: "1.2.3",
			config: {
				id: "drizzle",
				name: "Drizzle ORM",
			},
		});
		vi.mocked(useAddons).mockReturnValue({
			addons: [addon],
			isLoading: false,
			isError: false,
		});
		vi.mocked(deleteAddon).mockResolvedValueOnce(undefined);

		const { queryClient } = renderWithQueryClient(<AdminAddonsPage />);
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

		fireEvent.click(
			screen.getByRole("button", {
				name: /delete drizzle orm/i,
			}),
		);

		expect(screen.getByText(/drizzle@1.2.3/i)).toBeInTheDocument();

		fireEvent.click(
			screen.getByRole("button", {
				name: /delete addon/i,
			}),
		);

		await waitFor(() =>
			expect(deleteAddon).toHaveBeenCalledWith("drizzle", "1.2.3"),
		);
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["addons"] });
		expect(screen.getByText(/was deleted from the registry/i)).toBeInTheDocument();
	});
});
