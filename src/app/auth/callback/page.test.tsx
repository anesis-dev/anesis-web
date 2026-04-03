import { render, waitFor } from "@testing-library/react";

vi.mock("next/navigation", () => ({
	useRouter: vi.fn(),
}));

import AuthCallbackPage from "@/app/auth/callback/page";
import { useRouter } from "next/navigation";

describe("AuthCallbackPage", () => {
	it("stores the token and redirects to the home page", async () => {
		const replace = vi.fn();
		vi.mocked(useRouter).mockReturnValue({
			replace,
		} as never);
		window.history.pushState({}, "", "/auth/callback?token=secret-token");

		render(<AuthCallbackPage />);

		await waitFor(() =>
			expect(localStorage.getItem("token")).toBe("secret-token"),
		);
		expect(replace).toHaveBeenCalledWith("/");
	});
});
