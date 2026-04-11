import { render, screen } from "@testing-library/react";

vi.mock("@/components/addons/AddonRegistryPage", () => ({
	AddonRegistryPage: () => <div>Addon Registry Page</div>,
}));

import AddonsPage from "@/app/(main)/addons/page";

describe("AddonsPage", () => {
	it("renders the addon registry on /addons", () => {
		render(<AddonsPage />);

		expect(screen.getByText("Addon Registry Page")).toBeInTheDocument();
	});
});
