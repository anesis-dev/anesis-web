import { render, screen, within } from "@testing-library/react";
import Header from "@/components/Header";

vi.mock("@/components/Search", () => ({
	Search: ({ variant }: { variant?: string }) => (
		<div data-testid={variant === "icon" ? "search-icon" : "search-full"} />
	),
}));

vi.mock("@/components/AuthButton", () => ({
	default: () => <div data-testid="auth-button" />,
}));

vi.mock("@/components/HeaderNotifications", () => ({
	HeaderNotifications: () => <div data-testid="notifications" />,
}));

vi.mock("@/components/MobileHeaderMenu", () => ({
	MobileHeaderMenu: () => <div data-testid="mobile-menu" />,
}));

describe("Header", () => {
	beforeEach(() => {
		render(<Header />);
	});

	it("uses a banner landmark containing the primary navigation", () => {
		const banner = screen.getByRole("banner");
		expect(banner).toBeInTheDocument();
		expect(within(banner).getByRole("navigation")).toBeInTheDocument();
	});

	it("links every top-level section", () => {
		const nav = screen.getByRole("navigation");

		for (const [name, href] of [
			["Docs", "/docs"],
			["Templates", "/templates"],
			["Addons", "/addons"],
			["Stacks", "/stacks"],
		] as const) {
			expect(within(nav).getByRole("link", { name })).toHaveAttribute(
				"href",
				href,
			);
		}
	});

	it("links the logo home", () => {
		expect(screen.getAllByRole("link", { name: /anesis/i })[0]).toHaveAttribute(
			"href",
			"/",
		);
	});

	it("renders both the wide and narrow control sets", () => {
		expect(screen.getByTestId("search-full")).toBeInTheDocument();
		expect(screen.getByTestId("search-icon")).toBeInTheDocument();
		expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
		expect(screen.getByTestId("auth-button")).toBeInTheDocument();
		expect(screen.getAllByTestId("notifications")).toHaveLength(2);
	});
});
