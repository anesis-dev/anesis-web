import { render, screen } from "@testing-library/react";
import AdminDashboard from "@/app/admin/page";
import { createAddon, createTemplate, createUser } from "@/test/fixtures";

vi.mock("@/hooks/useTemplates", () => ({
	useTemplates: vi.fn(),
}));

vi.mock("@/hooks/useAddons", () => ({
	useAddons: vi.fn(),
}));

vi.mock("@/hooks/useUsers", () => ({
	useUsers: vi.fn(),
}));

import { useAddons } from "@/hooks/useAddons";
import { useTemplates } from "@/hooks/useTemplates";
import { useUsers } from "@/hooks/useUsers";

describe("AdminDashboard", () => {
	it("renders platform stats and recent templates", () => {
		const templates = Array.from({ length: 11 }, (_, index) =>
			createTemplate({
				id: `template-${index + 1}`,
				official: index < 4,
				created_at: `2026-04-${String(index + 1).padStart(2, "0")}T10:00:00Z`,
				config: {
					metadata: {
						displayName: `Dashboard Template ${index + 1}`,
						description: `Description ${index + 1}`,
					},
				},
			}),
		);

		vi.mocked(useTemplates).mockReturnValue({
			templates,
			pagination: undefined,
			isLoading: false,
			isError: false,
		} as unknown as ReturnType<typeof useTemplates>);
		vi.mocked(useAddons).mockReturnValue({
			addons: [createAddon(), createAddon({ id: "addon-2", addon_id: "eslint" })],
			pagination: undefined,
			isLoading: false,
			isError: false,
		} as unknown as ReturnType<typeof useAddons>);
		vi.mocked(useUsers).mockReturnValue({
			users: [
				createUser({ created_at: "2026-03-20T08:30:00Z" }),
				createUser({
					id: "user-2",
					login: "builder",
					role: "user",
					created_at: "2026-04-12T12:00:00Z",
				}),
				createUser({
					id: "user-3",
					login: "ops",
					role: "user",
					created_at: "2026-04-21T12:00:00Z",
				}),
			],
			isLoading: false,
			isError: false,
		});

		render(<AdminDashboard />);

		expect(screen.getByText("Total Templates")).toBeInTheDocument();
		expect(screen.getByText("Official Templates")).toBeInTheDocument();
		expect(screen.getByText("Community Templates")).toBeInTheDocument();
		expect(screen.getByText("Published Addons")).toBeInTheDocument();
		expect(screen.getByText("Total Users")).toBeInTheDocument();
		expect(screen.getByText("11")).toBeInTheDocument();
		expect(screen.getByText("4")).toBeInTheDocument();
		expect(screen.getByText("7")).toBeInTheDocument();
		expect(screen.getByText("2")).toBeInTheDocument();
		expect(screen.getByText("3")).toBeInTheDocument();
		expect(screen.getByText("Dashboard Template 11")).toBeInTheDocument();
		expect(screen.getByText("Dashboard Template 4")).toBeInTheDocument();
		expect(screen.getByText("Recent Users")).toBeInTheDocument();
		expect(screen.getByText("@ops")).toBeInTheDocument();
		expect(screen.getByText("Apr 21, 2026")).toBeInTheDocument();
	});
});
