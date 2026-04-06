import { fireEvent, screen, waitFor } from "@testing-library/react";
import AdminUsersPage from "@/app/admin/users/page";
import { renderWithQueryClient } from "@/test/render";
import { createUser } from "@/test/fixtures";

vi.mock("@/hooks/useUsers", () => ({
	useUsers: vi.fn(),
}));

vi.mock("@/services/user", async () => {
	const actual = await vi.importActual<typeof import("@/services/user")>(
		"@/services/user",
	);

	return {
		...actual,
		deleteUser: vi.fn(),
	};
});

import { useUsers } from "@/hooks/useUsers";
import { deleteUser } from "@/services/user";

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
		renderWithQueryClient(<AdminUsersPage />);

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

	it("deletes a user through the admin dialog", async () => {
		const user = createUser({
			id: "user-2",
			login: "builder",
		});
		vi.mocked(useUsers).mockReturnValue({
			users: [user],
			isLoading: false,
			isError: false,
		});
		vi.mocked(deleteUser).mockResolvedValueOnce(undefined);

		const { queryClient } = renderWithQueryClient(<AdminUsersPage />);
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

		fireEvent.click(
			screen.getByRole("button", {
				name: /delete builder/i,
			}),
		);

		expect(
			screen.getByRole("dialog"),
		).toHaveTextContent("@builder");

		fireEvent.click(
			screen.getByRole("button", {
				name: /delete user/i,
			}),
		);

		await waitFor(() =>
			expect(deleteUser).toHaveBeenCalledWith("user-2"),
		);
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["admin", "users"],
		});
		expect(screen.getByText(/was deleted from the platform/i)).toBeInTheDocument();
	});
});
