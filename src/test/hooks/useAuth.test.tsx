import { act, renderHook, waitFor } from "@testing-library/react";
import {
	createQueryClientWrapper,
	createTestQueryClient,
} from "@/test/render";
import { mockUser } from "@/test/fixtures";

vi.mock("@/services/user", () => ({
	fetchMe: vi.fn(),
}));

vi.mock("@/services/auth", () => ({
	getLoginUrl: vi.fn(),
	logoutRequest: vi.fn(),
}));

import { useAuth } from "@/hooks/useAuth";
import { getLoginUrl, logoutRequest } from "@/services/auth";
import { fetchMe } from "@/services/user";

describe("useAuth", () => {
	const originalLocation = window.location;

	beforeEach(() => {
		Object.defineProperty(window, "location", {
			configurable: true,
			value: { href: "http://localhost/" },
		});
	});

	afterEach(() => {
		Object.defineProperty(window, "location", {
			configurable: true,
			value: originalLocation,
		});
		localStorage.clear();
	});

	it("returns the current user from the me query", async () => {
		vi.mocked(fetchMe).mockResolvedValueOnce(mockUser);
		const queryClient = createTestQueryClient();

		const { result } = renderHook(() => useAuth(), {
			wrapper: createQueryClientWrapper(queryClient),
		});

		await waitFor(() => expect(result.current.user).toEqual(mockUser));
		expect(result.current.isLoading).toBe(false);
	});

	it("redirects to the login url when login is called", async () => {
		vi.mocked(fetchMe).mockResolvedValueOnce(mockUser);
		vi.mocked(getLoginUrl).mockReturnValueOnce("http://localhost/auth/login");

		const { result } = renderHook(() => useAuth(), {
			wrapper: createQueryClientWrapper(createTestQueryClient()),
		});

		await waitFor(() => expect(result.current.user).toEqual(mockUser));
		act(() => {
			result.current.login();
		});

		expect(window.location.href).toBe("http://localhost/auth/login");
	});

	it("logs out, clears the me query and redirects home", async () => {
		vi.mocked(fetchMe).mockResolvedValueOnce(mockUser);
		vi.mocked(logoutRequest).mockResolvedValueOnce(undefined);
		const queryClient = createTestQueryClient();

		const { result } = renderHook(() => useAuth(), {
			wrapper: createQueryClientWrapper(queryClient),
		});

		await waitFor(() => expect(result.current.user).toEqual(mockUser));
		expect(queryClient.getQueryData(["me"])).toEqual(mockUser);

		await act(async () => {
			await result.current.logout();
		});

		expect(logoutRequest).toHaveBeenCalledTimes(1);
		expect(queryClient.getQueryData(["me"])).toBeUndefined();
		expect(window.location.href).toBe("/");
	});
});
