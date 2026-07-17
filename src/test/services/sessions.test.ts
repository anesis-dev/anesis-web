vi.mock("@/api/client", () => ({
	api: {
		get: vi.fn(),
	},
}));

import { api } from "@/api/client";
import { fetchSessions } from "@/services/sessions";

describe("sessions service", () => {
	it("fetches the active sessions from the auth endpoint", async () => {
		const sessions = [{ id: "s-1" }];
		vi.mocked(api.get).mockResolvedValueOnce(sessions);

		await expect(fetchSessions()).resolves.toBe(sessions);
		expect(api.get).toHaveBeenCalledWith("/auth/sessions");
	});
});
