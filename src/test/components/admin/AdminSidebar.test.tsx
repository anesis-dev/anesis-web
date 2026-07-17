import { render, screen } from "@testing-library/react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { createUser } from "@/test/fixtures";

vi.mock("next/navigation", () => ({
	usePathname: vi.fn(),
}));

vi.mock("@/hooks/useAuth", () => ({
	useAuth: vi.fn(),
}));

import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

describe("AdminSidebar", () => {
	it("highlights the active route and renders the current user", () => {
		vi.mocked(usePathname).mockReturnValue("/admin/templates");
		vi.mocked(useAuth).mockReturnValue({
			user: createUser(),
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});

		render(<AdminSidebar />);

		expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /addons/i })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /templates/i })).toHaveClass(
			"bg-primary",
		);
		expect(screen.getByText("@octocat")).toBeInTheDocument();
	});
});
