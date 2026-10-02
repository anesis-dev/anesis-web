import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/(main)/page";
import { FeaturedAddons } from "@/components/home/FeaturedRegistry";

vi.mock("@/services/template", () => ({
	fetchTemplates: vi.fn(),
}));

vi.mock("@/services/addon", () => ({
	fetchAddons: vi.fn(),
}));

vi.mock("@/services/stack", () => ({
	fetchStacks: vi.fn(),
}));

vi.mock("@/components/templates/TemplateCard", () => ({
	TemplateCard: () => <div data-testid="template-card" />,
}));

vi.mock("@/components/addons/AddonCard", () => ({
	AddonCard: ({ addon }: { addon: { name: string } }) => (
		<div data-testid="addon-card">{addon.name}</div>
	),
}));

vi.mock("@/components/stacks/StackCard", () => ({
	StackCard: () => <div data-testid="stack-card" />,
}));
import { fetchAddons } from "@/services/addon";
import { fetchStacks } from "@/services/stack";
import { fetchTemplates } from "@/services/template";

const emptyPage = { data: [], total: 0, page: 1, pageSize: 100, totalPages: 0 };

describe("Home", () => {
	beforeEach(() => {
		vi.mocked(fetchTemplates).mockResolvedValue(emptyPage);
		vi.mocked(fetchAddons).mockResolvedValue(emptyPage);
		vi.mocked(fetchStacks).mockResolvedValue(emptyPage);
	});

	it("shows a compact single-command install card on the hero", () => {
		render(<Home />);

		expect(screen.queryByText(/quick start/i)).not.toBeInTheDocument();
		expect(screen.queryByText(/all installation options/i)).not.toBeInTheDocument();
		expect(
			screen.getByText("npm install -g anesis-cli"),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /copy npm install command/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /^copy install command$/i }),
		).toBeInTheDocument();
		expect(screen.queryByText("anesis login")).not.toBeInTheDocument();
	});

	it("copies the npm install command from the command text", async () => {
		render(<Home />);

		fireEvent.click(
			screen.getByRole("button", { name: /copy npm install command/i }),
		);

		await waitFor(() =>
			expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
				"npm install -g anesis-cli",
			),
		);
		expect(
			screen.getByRole("button", { name: /install command copied/i }),
		).toBeInTheDocument();
	});

	it("copies the npm install command from the copy button", async () => {
		render(<Home />);

		fireEvent.click(
			screen.getByRole("button", { name: /^copy install command$/i }),
		);

		await waitFor(() =>
			expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
				"npm install -g anesis-cli",
			),
		);
		expect(
			screen.getByRole("button", { name: /install command copied/i }),
		).toBeInTheDocument();
	});

	it("surfaces recent addons on the homepage", async () => {
		vi.mocked(fetchAddons).mockResolvedValue({
			...emptyPage,
			data: [
				{
					id: "addon-1",
					owner_id: "owner-1",
					url: "https://github.com/anesis-dev/quality-addon",
					addon_id: "quality-addon",
					name: "quality-addon",
					version: "1.0.0",
					commit_sha: "abc123",
					official: true,
					config: {
						schema_version: "1",
						id: "quality-addon",
						name: "Quality Addon",
						version: "1.0.0",
						description: "Runs repeated project checks.",
						author: "Anesis",
					},
					created_at: "2026-04-10T10:00:00.000Z",
					updated_at: "2026-04-10T10:00:00.000Z",
				},
			],
		});

		// Async server component: resolve it here, jsdom can't suspend on it.
		render(await FeaturedAddons());
		expect(screen.getAllByTestId("addon-card")).toHaveLength(1);

		render(<Home />);
		expect(screen.getByText("Recent addons")).toBeInTheDocument();
		expect(
			screen.getByText("Latest automations from the registry"),
		).toBeInTheDocument();
		expect(screen.getByText("Browse addons")).toBeInTheDocument();
		expect(screen.getByText("View all addons")).toBeInTheDocument();
	});

	it("features official addons first, then the newest, capped at four", async () => {
		const addon = (name: string, official: boolean, day: number) => ({
			name,
			official,
			created_at: `2026-04-${String(day).padStart(2, "0")}T10:00:00.000Z`,
		});
		vi.mocked(fetchAddons).mockResolvedValue({
			...emptyPage,
			data: [
				addon("old", false, 1),
				addon("newest", false, 9),
				addon("official-old", true, 2),
				addon("mid", false, 5),
				addon("newer", false, 7),
			],
		} as unknown as Awaited<ReturnType<typeof fetchAddons>>);

		render(await FeaturedAddons());

		expect(
			screen.getAllByTestId("addon-card").map((card) => card.textContent),
		).toEqual(["official-old", "newest", "newer", "mid"]);
	});
});
