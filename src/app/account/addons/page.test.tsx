import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AccountAddonsPage from "@/app/account/addons/page";
import { createAddon, createUser } from "@/test/fixtures";

vi.mock("@/hooks/useAuth", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/hooks/useMyAddons", () => ({
	useMyAddons: vi.fn(),
}));

vi.mock("@/components/addons/OwnedAddonCard", () => ({
	OwnedAddonCard: ({ addon }: { addon: { name: string } }) => (
		<div data-testid="owned-addon-card">{addon.name}</div>
	),
}));

vi.mock("@/components/addons/PublishAddonDialog", () => ({
	PublishAddonDialog: () => <div>Publish Addon</div>,
}));

import { useAuth } from "@/hooks/useAuth";
import { useMyAddons } from "@/hooks/useMyAddons";

const myAddons = Array.from({ length: 7 }, (_, index) =>
	createAddon({
		id: `mine-${index + 1}`,
		addon_id: `addon-${index + 1}`,
		name: `Addon ${index + 1}`,
		config: {
			id: `addon-${index + 1}`,
			name: `Addon ${index + 1}`,
			description:
				index === 6 ? "Special personal addon" : `Owned addon ${index + 1}`,
		},
	}),
);

describe("AccountAddonsPage", () => {
	it("asks guests to sign in before viewing private addons", () => {
		vi.mocked(useAuth).mockReturnValue({
			user: null,
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});
		vi.mocked(useMyAddons).mockReturnValue({
			addons: [],
			isLoading: false,
			isError: false,
		});

		render(<AccountAddonsPage />);

		expect(screen.getByText("Your addons")).toBeInTheDocument();
		expect(
			screen.getByText(/sign in with github to view and manage addons/i),
		).toBeInTheDocument();
	});

	it("renders, paginates and filters the signed-in user's addons", async () => {
		vi.mocked(useAuth).mockReturnValue({
			user: createUser(),
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});
		vi.mocked(useMyAddons).mockReturnValue({
			addons: myAddons,
			isLoading: false,
			isError: false,
		});

		render(<AccountAddonsPage />);

		expect(screen.getByText("Publish Addon")).toBeInTheDocument();
		expect(screen.getByText("7 addon(s)")).toBeInTheDocument();
		expect(screen.getAllByTestId("owned-addon-card")).toHaveLength(6);

		fireEvent.click(screen.getByRole("button", { name: "Next" }));
		expect(screen.getAllByTestId("owned-addon-card")).toHaveLength(1);
		expect(screen.getByText("Addon 7")).toBeInTheDocument();

		fireEvent.change(screen.getByPlaceholderText(/search your addons/i), {
			target: { value: "special" },
		});

		await waitFor(() =>
			expect(screen.getByText("1 addon(s)")).toBeInTheDocument(),
		);
		expect(screen.getAllByTestId("owned-addon-card")).toHaveLength(1);
		expect(screen.getByText("Addon 7")).toBeInTheDocument();
	});
});
