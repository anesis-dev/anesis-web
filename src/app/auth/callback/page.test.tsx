import { screen, waitFor } from "@testing-library/react";
import { createQueryClientWrapper, createTestQueryClient } from "@/test/render";
import { render } from "@testing-library/react";

vi.mock("next/navigation", () => ({
	useRouter: vi.fn(),
}));

vi.mock("@/services/auth", () => ({
	exchangeAuthCode: vi.fn(),
	getLoginUrl: vi.fn(() => "http://api.example.test/auth/login"),
}));

import AuthCallbackPage from "@/app/auth/callback/page";
import { useRouter } from "next/navigation";
import { exchangeAuthCode } from "@/services/auth";

describe("AuthCallbackPage", () => {
	it("exchanges the callback code and redirects to the home page", async () => {
		const replace = vi.fn();
		vi.mocked(useRouter).mockReturnValue({
			replace,
		} as never);
		vi.mocked(exchangeAuthCode).mockResolvedValueOnce(undefined);
		const queryClient = createTestQueryClient();
		queryClient.setQueryData(["me"], { id: "user-1" });
		window.history.pushState({}, "", "/auth/callback?code=code-123");

		render(<AuthCallbackPage />, {
			wrapper: createQueryClientWrapper(queryClient),
		});

		await waitFor(() => expect(exchangeAuthCode).toHaveBeenCalledWith("code-123"));
		expect(queryClient.getQueryData(["me"])).toBeUndefined();
		expect(replace).toHaveBeenCalledWith("/");
	});

	it("shows an error when the callback code is missing", async () => {
		const replace = vi.fn();
		vi.mocked(useRouter).mockReturnValue({
			replace,
		} as never);
		window.history.pushState({}, "", "/auth/callback");

		render(<AuthCallbackPage />, {
			wrapper: createQueryClientWrapper(createTestQueryClient()),
		});

		await waitFor(() =>
			expect(screen.getByText(/missing authorization code/i)).toBeInTheDocument(),
		);
		expect(exchangeAuthCode).not.toHaveBeenCalled();
		expect(replace).not.toHaveBeenCalled();
	});

	it("shows the backend error when code exchange fails", async () => {
		const replace = vi.fn();
		vi.mocked(useRouter).mockReturnValue({
			replace,
		} as never);
		vi.mocked(exchangeAuthCode).mockRejectedValueOnce(
			new Error("Invalid or expired code"),
		);
		window.history.pushState({}, "", "/auth/callback?code=expired-code");

		render(<AuthCallbackPage />, {
			wrapper: createQueryClientWrapper(createTestQueryClient()),
		});

		await waitFor(() =>
			expect(screen.getByText("Invalid or expired code")).toBeInTheDocument(),
		);
		expect(replace).not.toHaveBeenCalled();
	});
});
