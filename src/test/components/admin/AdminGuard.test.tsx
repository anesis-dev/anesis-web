import { render, screen } from "@testing-library/react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { createUser } from "@/test/fixtures";

vi.mock("@/hooks/useAuth", () => ({
	useAuth: vi.fn(),
}));

import { useAuth } from "@/hooks/useAuth";

describe("AdminGuard", () => {
	it("shows a loading state while auth is resolving", () => {
		vi.mocked(useAuth).mockReturnValue({
			user: null,
			isLoading: true,
			login: vi.fn(),
			logout: vi.fn(),
		});

		render(<AdminGuard>secret</AdminGuard>);

		expect(screen.queryByText("secret")).not.toBeInTheDocument();
	});

	it("blocks non-admin users", () => {
		vi.mocked(useAuth).mockReturnValue({
			user: createUser({ role: "user" }),
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});

		render(<AdminGuard>secret</AdminGuard>);

		expect(screen.getByText("Access Denied")).toBeInTheDocument();
		expect(screen.queryByText("secret")).not.toBeInTheDocument();
	});

	it("renders protected content for admins", () => {
		vi.mocked(useAuth).mockReturnValue({
			user: createUser({ role: "admin" }),
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});

		render(<AdminGuard>secret</AdminGuard>);

		expect(screen.getByText("secret")).toBeInTheDocument();
	});
});
