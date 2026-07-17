import { screen } from "@testing-library/react";
import { renderWithQueryClient } from "@/test/render";

vi.mock("@/components/addons/AddonRegistryPage", () => ({
	AddonRegistryPage: () => <div>Addon Registry Page</div>,
}));

vi.mock("@/lib/prefetch", () => ({
	dehydrateQuery: vi.fn().mockResolvedValue({ mutations: [], queries: [] }),
}));

import AddonsPage from "@/app/(main)/addons/page";

describe("AddonsPage", () => {
	it("renders the addon registry on /addons", async () => {
		renderWithQueryClient(await AddonsPage());

		expect(screen.getByText("Addon Registry Page")).toBeInTheDocument();
	});
});
