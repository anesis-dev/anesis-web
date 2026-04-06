vi.mock("@/api/client", () => ({
	api: {
		get: vi.fn(),
		delete: vi.fn(),
	},
}));

vi.mock("@/lib/api-contracts", () => ({
	parseMeResponse: vi.fn(),
	parseUsersResponse: vi.fn(),
}));

import { api } from "@/api/client";
import { parseMeResponse, parseUsersResponse } from "@/lib/api-contracts";
import { deleteUser, fetchAllUsers, fetchMe } from "@/services/user";

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

	it("deletes a user for admin pages", async () => {
		vi.mocked(api.delete).mockResolvedValueOnce(undefined);

		await expect(deleteUser("user-1")).resolves.toBeUndefined();
		expect(api.delete).toHaveBeenCalledWith("/user/user-1");
	});
});
