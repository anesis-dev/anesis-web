import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminUsersPage from "@/app/admin/users/page";
import { createUser } from "@/test/fixtures";

vi.mock("@/hooks/useUsers", () => ({
	useUsers: vi.fn(),
}));

import { useUsers } from "@/hooks/useUsers";

describe("AdminUsersPage", () => {
	it("renders user totals and filters by role", async () => {
		const users = Array.from({ length: 11 }, (_, index) =>
			createUser({
				id: `user-${index + 1}`,
				login: `user-${index + 1}`,
				role: index < 3 ? "admin" : "user",
				github_id: 1000 + index,
			}),
		);
		vi.mocked(useUsers).mockReturnValue({
			users,
			isLoading: false,
			isError: false,
		});
		render(<AdminUsersPage />);

		expect(screen.getByText("11 total / 3 admins")).toBeInTheDocument();

		fireEvent.change(
			screen.getByPlaceholderText(/search by login, github id or role/i),
			{ target: { value: "admin" } },
		);

		await waitFor(() =>
			expect(screen.getByText("3 / 11")).toBeInTheDocument(),
		);
		expect(screen.getByText("@user-1")).toBeInTheDocument();
		expect(screen.queryByText("@user-11")).not.toBeInTheDocument();
	});
});
