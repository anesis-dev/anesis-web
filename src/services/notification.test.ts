vi.mock("@/api/client", () => ({
	api: {
		get: vi.fn(),
		post: vi.fn(),
		patch: vi.fn(),
	},
}));

vi.mock("@/lib/api-contracts", () => ({
	parseNotificationsResponse: vi.fn(),
}));

import { api } from "@/api/client";
import { parseNotificationsResponse } from "@/lib/api-contracts";
import {
	fetchNotifications,
	markAllNotificationsRead,
	markNotificationRead,
} from "@/services/notification";

describe("notification services", () => {
	it("fetches notifications through the parser", async () => {
		vi.mocked(api.get).mockResolvedValueOnce({ notifications: [] });
		vi.mocked(parseNotificationsResponse).mockReturnValueOnce({
			notifications: [],
			unread_count: 0,
		} as never);

		await expect(fetchNotifications()).resolves.toEqual({
			notifications: [],
			unread_count: 0,
		});
		expect(api.get).toHaveBeenCalledWith("/notifications");
		expect(parseNotificationsResponse).toHaveBeenCalledWith({ notifications: [] });
	});

	it("marks a single notification read with id encoding", async () => {
		vi.mocked(api.patch).mockResolvedValueOnce(undefined);

		await expect(markNotificationRead("n 1")).resolves.toBeUndefined();
		expect(api.patch).toHaveBeenCalledWith("/notifications/n%201/read", {});
	});

	it("marks all notifications read", async () => {
		vi.mocked(api.post).mockResolvedValueOnce(undefined);

		await expect(markAllNotificationsRead()).resolves.toBeUndefined();
		expect(api.post).toHaveBeenCalledWith("/notifications/read-all", {});
	});
});
