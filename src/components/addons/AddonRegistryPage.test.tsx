import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AddonRegistryPage } from "@/components/addons/AddonRegistryPage";
import { createAddon, createUser } from "@/test/fixtures";

vi.mock("@/hooks/useAddons", () => ({
	useAddons: vi.fn(),
}));

vi.mock("@/hooks/useAuth", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/components/addons/AddonCard", () => ({
	AddonCard: ({ addon }: { addon: { name: string } }) => (
		<div data-testid="addon-card">{addon.name}</div>
	),
}));

vi.mock("@/components/addons/PublishAddonDialog", () => ({
	PublishAddonDialog: () => <div>Publish Addon</div>,
}));

import { useAddons } from "@/hooks/useAddons";
import { useAuth } from "@/hooks/useAuth";

const addons = Array.from({ length: 10 }, (_, index) =>
	createAddon({
		id: `addon-${index + 1}`,
		addon_id: `addon-${index + 1}`,
		name: index === 9 ? "Special Addon" : `Addon ${index + 1}`,
		config: {
			id: `addon-${index + 1}`,
			name: index === 9 ? "Special Addon" : `Addon ${index + 1}`,
			description:
				index === 9 ? "Contains a unique search term." : `Description ${index + 1}`,
			author: index < 5 ? "anesis-core" : "community",
		},
	}),
);

describe("AddonRegistryPage", () => {
	it("shows an error state when addons fail to load", () => {
		vi.mocked(useAddons).mockReturnValue({
			addons: [],
			isLoading: false,
			isError: true,
		});
		vi.mocked(useAuth).mockReturnValue({
			user: null,
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});

		render(<AddonRegistryPage />);

		expect(screen.getByText("Failed to load addons")).toBeInTheDocument();
	});

	it("renders addons with filtering and pagination", async () => {
		vi.mocked(useAddons).mockReturnValue({
			addons,
			isLoading: false,
			isError: false,
		});
		vi.mocked(useAuth).mockReturnValue({
			user: createUser(),
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});

		render(<AddonRegistryPage />);

		expect(screen.getByText("Publish Addon")).toBeInTheDocument();
		expect(
			screen.getByText((_, element) => element?.textContent === "Showing 10 addons"),
		).toBeInTheDocument();
		expect(screen.getAllByTestId("addon-card")).toHaveLength(10);
		expect(screen.getByText("Special Addon")).toBeInTheDocument();

		fireEvent.change(
			screen.getByPlaceholderText(/search by addon id, name, description or author/i),
			{ target: { value: "special" } },
		);

		await waitFor(() =>
			expect(
				screen.getByText((_, element) => element?.textContent === "Showing 1 of 10 addons"),
			).toBeInTheDocument(),
		);
		expect(screen.getAllByTestId("addon-card")).toHaveLength(1);
		expect(screen.getByText("Special Addon")).toBeInTheDocument();
	});
});
