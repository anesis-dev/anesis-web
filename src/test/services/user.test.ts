vi.mock("@/api/client", () => ({
	ApiError: class ApiError extends Error {
		constructor(
			public readonly status: number,
			message: string,
		) {
			super(message);
			this.name = "ApiError";
		}
	},
	api: {
		get: vi.fn(),
		post: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn(),
	},
}));

vi.mock("@/lib/api-contracts", () => ({
	parseMeResponse: vi.fn(),
	parseUsersResponse: vi.fn(),
}));

import { ApiError, api } from "@/api/client";
import { parseMeResponse, parseUsersResponse } from "@/lib/api-contracts";
import {
	deleteUser,
	fetchAllUsers,
	fetchMe,
	fetchUserByLogin,
	updateUserRole,
} from "@/services/user";

describe("user services", () => {
	it("fetches the current user", async () => {
		vi.mocked(api.get).mockResolvedValueOnce({ data: { id: "me" } });
		vi.mocked(parseMeResponse).mockReturnValueOnce({ id: "me" } as never);

		await expect(fetchMe()).resolves.toEqual({ id: "me" });
		expect(api.get).toHaveBeenCalledWith("/user/info");
		expect(parseMeResponse).toHaveBeenCalledWith({ data: { id: "me" } });
	});

	it("fetches all users for admin pages", async () => {
		vi.mocked(api.get).mockResolvedValueOnce({ data: [] });
		vi.mocked(parseUsersResponse).mockReturnValueOnce([{ id: "u1" }] as never);

		await expect(fetchAllUsers()).resolves.toEqual([{ id: "u1" }]);
		expect(api.get).toHaveBeenCalledWith("/user/all");
		expect(parseUsersResponse).toHaveBeenCalledWith({ data: [] });
	});

	it("fetches a public user by login", async () => {
		vi.mocked(api.get).mockResolvedValueOnce({ data: { id: "u1" } });
		vi.mocked(parseMeResponse).mockReturnValueOnce({ id: "u1" } as never);

		await expect(fetchUserByLogin("Octo Cat")).resolves.toEqual({ id: "u1" });
		expect(api.get).toHaveBeenCalledWith("/user/by-login/Octo%20Cat");
		expect(parseMeResponse).toHaveBeenCalledWith({ data: { id: "u1" } });
	});

	it("falls back to post when the backend registered user lookup with a non-get method", async () => {
		vi.mocked(api.get).mockRejectedValueOnce(new ApiError(405, "Method Not Allowed"));
		vi.mocked(api.post).mockResolvedValueOnce({ data: { id: "u1" } });
		vi.mocked(parseMeResponse).mockReturnValueOnce({ id: "u1" } as never);

		await expect(fetchUserByLogin("octocat")).resolves.toEqual({ id: "u1" });
		expect(api.get).toHaveBeenCalledWith("/user/by-login/octocat");
		expect(api.post).toHaveBeenCalledWith("/user/by-login/octocat");
		expect(parseMeResponse).toHaveBeenCalledWith({ data: { id: "u1" } });
	});

	it("deletes a user for admin pages", async () => {
		vi.mocked(api.delete).mockResolvedValueOnce(undefined);

		await expect(deleteUser("user-1")).resolves.toBeUndefined();
		expect(api.delete).toHaveBeenCalledWith("/user/user-1");
	});

	it("updates a user role for admin pages", async () => {
		vi.mocked(api.patch).mockResolvedValueOnce(undefined);

		await expect(updateUserRole("user-1", true)).resolves.toBeUndefined();
		expect(api.patch).toHaveBeenCalledWith("/user/user-1/role?admin=true");
	});
});
