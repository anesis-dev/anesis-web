vi.mock("@/config/env", () => ({
	env: {
		apiUrl: "http://api.example.test",
	},
}));

import { getLoginUrl, logoutRequest } from "@/services/auth";

describe("auth services", () => {
	afterEach(() => {
		localStorage.clear();
	});

	it("builds the github login url from the configured api base", () => {
		expect(getLoginUrl()).toBe("http://api.example.test/auth/login");
	});

	it("logs out through the backend and removes the local token", async () => {
		localStorage.setItem("token", "secret-token");
		const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce(
			new Response(null, { status: 200 }),
		);

		await logoutRequest();

		expect(localStorage.getItem("token")).toBeNull();
		expect(fetchSpy).toHaveBeenCalledWith(
			"http://api.example.test/auth/logout",
			{
				method: "GET",
				credentials: "include",
			},
		);
	});
});
