import { screen, waitFor } from "@testing-library/react";
import { createQueryClientWrapper, createTestQueryClient } from "@/test/render";
import { render } from "@testing-library/react";

vi.mock("next/navigation", () => ({
	useRouter: vi.fn(),
}));

vi.mock("@/services/auth", () => ({
	getLoginUrl: vi.fn(() => "http://api.example.test/auth/login"),
}));

import AuthCallbackPage from "@/app/auth/callback/page";
import { useRouter } from "next/navigation";

describe("AuthCallbackPage", () => {
	it("clears cached data and redirects to the home page when the server signed the user in", async () => {
		const replace = vi.fn();
		vi.mocked(useRouter).mockReturnValue({
			replace,
		} as never);
		const queryClient = createTestQueryClient();
		queryClient.setQueryData(["me"], { id: "user-1" });
		window.history.pushState({}, "", "/auth/callback?signed_in=1");

		render(<AuthCallbackPage />, {
			wrapper: createQueryClientWrapper(queryClient),
		});

		await waitFor(() => expect(replace).toHaveBeenCalledWith("/"));
		expect(queryClient.getQueryData(["me"])).toBeUndefined();
	});

	it("invalidates sessions and redirects when an account was added", async () => {
		const replace = vi.fn();
		vi.mocked(useRouter).mockReturnValue({
			replace,
		} as never);
		const queryClient = createTestQueryClient();
		const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");
		window.history.pushState({}, "", "/auth/callback?account_added=1");

		render(<AuthCallbackPage />, {
			wrapper: createQueryClientWrapper(queryClient),
		});

		await waitFor(() => expect(replace).toHaveBeenCalledWith("/"));
		expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ["sessions"] });
	});

	it.each(["account_already_active", "account_already_added"])(
		"redirects home without touching cached data for %s=1",
		async (param) => {
			const replace = vi.fn();
			vi.mocked(useRouter).mockReturnValue({
				replace,
			} as never);
			window.history.pushState({}, "", `/auth/callback?${param}=1`);

			render(<AuthCallbackPage />, {
				wrapper: createQueryClientWrapper(createTestQueryClient()),
			});

			await waitFor(() => expect(replace).toHaveBeenCalledWith("/"));
		},
	);

	it("shows an error when the callback has no recognized marker", async () => {
		const replace = vi.fn();
		vi.mocked(useRouter).mockReturnValue({
			replace,
		} as never);
		window.history.pushState({}, "", "/auth/callback");

		render(<AuthCallbackPage />, {
			wrapper: createQueryClientWrapper(createTestQueryClient()),
		});

		await waitFor(() =>
			expect(screen.getByText(/invalid or has expired/i)).toBeInTheDocument(),
		);
		expect(replace).not.toHaveBeenCalled();
	});
});
