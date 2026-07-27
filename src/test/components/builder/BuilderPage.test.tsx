import { fireEvent, render, screen, within } from "@testing-library/react";
import { BuilderPage } from "@/components/builder/BuilderPage";
import { createAddon, createTemplate, createUser } from "@/test/fixtures";
import { AddonManifest } from "@/types/addon-manifest";

vi.mock("@/hooks/useAllTemplates", () => ({ useAllTemplates: vi.fn() }));
vi.mock("@/hooks/useAllAddons", () => ({ useAllAddons: vi.fn() }));
vi.mock("@/hooks/useAddonManifest", () => ({ useAddonManifest: vi.fn() }));
vi.mock("@/hooks/useAuth", () => ({ useAuth: vi.fn() }));

vi.mock("@/components/stacks/PublishStackDialog", () => ({
	PublishStackDialog: () => <button type="button">Publish stack</button>,
}));

vi.mock("@/components/CommandCard", () => ({
	CommandCard: ({ command }: { command: string }) => (
		<pre data-testid="command">{command}</pre>
	),
}));

import { useAllTemplates } from "@/hooks/useAllTemplates";
import { useAllAddons } from "@/hooks/useAllAddons";
import { useAddonManifest } from "@/hooks/useAddonManifest";
import { useAuth } from "@/hooks/useAuth";

const template = createTemplate({
	id: "template-1",
	config: {
		name: "nest-express",
		metadata: {
			displayName: "NestJS + Express",
			description: "A NestJS API on Express.",
		},
	},
});

const prisma = createAddon({
	id: "addon-prisma",
	addon_id: "nest-prisma-v7",
	name: "Nest Prisma",
	url: "https://github.com/anesis-dev/addons/tree/main/nest-prisma-v7",
	config: { id: "nest-prisma-v7", name: "Nest Prisma", description: "Prisma ORM." },
});

const auth = createAddon({
	id: "addon-auth",
	addon_id: "nest-auth-jwt",
	name: "Nest Auth",
	url: "https://github.com/anesis-dev/addons/tree/main/nest-auth-jwt",
	config: { id: "nest-auth-jwt", name: "Nest Auth", description: "JWT auth." },
});

const manifestsByUrl: Record<string, AddonManifest | undefined> = {};

function setManifest(addonUrl: string, manifest: AddonManifest | undefined) {
	manifestsByUrl[addonUrl] = manifest;
}

function manifest(overrides: Partial<AddonManifest> = {}): AddonManifest {
	return {
		schema_version: "1",
		id: "an-addon",
		name: "An Addon",
		version: "1.0.0",
		description: "",
		author: "anesis",
		requires: [],
		inputs: [],
		detect: [],
		variants: [],
		...overrides,
	} as AddonManifest;
}

function setup({
	templatesLoading = false,
	addonsLoading = false,
	user = null as ReturnType<typeof createUser> | null,
} = {}) {
	const login = vi.fn();

	vi.mocked(useAllTemplates).mockReturnValue({
		templates: templatesLoading ? [] : [template],
		isLoading: templatesLoading,
	} as unknown as ReturnType<typeof useAllTemplates>);

	vi.mocked(useAllAddons).mockReturnValue({
		addons: addonsLoading ? [] : [prisma, auth],
		isLoading: addonsLoading,
	} as unknown as ReturnType<typeof useAllAddons>);

	vi.mocked(useAddonManifest).mockImplementation(
		(url?: string) =>
			({
				manifest: url ? manifestsByUrl[url] : undefined,
				isLoading: false,
				isError: false,
			}) as unknown as ReturnType<typeof useAddonManifest>,
	);

	vi.mocked(useAuth).mockReturnValue({
		user,
		isLoading: false,
		login,
	} as unknown as ReturnType<typeof useAuth>);

	return { login };
}

function pickTemplate() {
	fireEvent.click(screen.getByRole("button", { name: /NestJS \+ Express/ }));
}

function toggleAddon(name: RegExp) {
	const section = screen.getByRole("heading", { name: /3\. Addons/ }).parentElement!;
	fireEvent.click(within(section).getByRole("button", { name }));
}

function commandText() {
	return screen.getByTestId("command").textContent ?? "";
}

beforeEach(() => {
	for (const key of Object.keys(manifestsByUrl)) delete manifestsByUrl[key];
});

describe("BuilderPage", () => {
	it("does not offer a command until a template is chosen", () => {
		setup();
		render(<BuilderPage />);

		expect(screen.queryByTestId("command")).not.toBeInTheDocument();
		expect(
			screen.getByText(/pick a template to generate your setup command/i),
		).toBeInTheDocument();
	});

	it("shows loading states for templates and addons", () => {
		setup({ templatesLoading: true, addonsLoading: true });
		render(<BuilderPage />);

		expect(screen.getByText(/loading templates/i)).toBeInTheDocument();
		expect(screen.getByText(/loading addons/i)).toBeInTheDocument();
	});

	it("builds the scaffold command from the chosen template", () => {
		setup();
		render(<BuilderPage />);

		pickTemplate();

		expect(commandText()).toBe("anesis new my-app nest-express");
	});

	it("slugifies the project name into the command", () => {
		setup();
		render(<BuilderPage />);

		fireEvent.change(screen.getByPlaceholderText("my-app"), {
			target: { value: "  My Cool App!!  " },
		});
		pickTemplate();

		expect(commandText()).toContain("anesis new my-cool-app nest-express");
	});

	it("falls back to my-app when the project name has nothing usable in it", () => {
		setup();
		render(<BuilderPage />);

		fireEvent.change(screen.getByPlaceholderText("my-app"), {
			target: { value: "!!!" },
		});
		pickTemplate();

		expect(commandText()).toContain("anesis new my-app nest-express");
	});

	it("appends an `anesis use` line per selected addon, in order", () => {
		setup();
		render(<BuilderPage />);

		pickTemplate();
		toggleAddon(/Nest Prisma/);
		toggleAddon(/Nest Auth/);

		expect(commandText()).toBe(
			[
				"anesis new my-app nest-express",
				"cd my-app",
				"anesis use nest-prisma-v7 install",
				"anesis use nest-auth-jwt install",
			].join("\n"),
		);
	});

	it("removes an addon's line when it is deselected", () => {
		setup();
		render(<BuilderPage />);

		pickTemplate();
		toggleAddon(/Nest Prisma/);
		expect(commandText()).toContain("nest-prisma-v7");

		toggleAddon(/Nest Prisma/);
		expect(commandText()).not.toContain("nest-prisma-v7");
	});

	it("includes resolved manifest inputs as --input flags", () => {
		setManifest(
			prisma.url,
			manifest({
				id: "nest-prisma-v7",
				inputs: [
					{ name: "provider", type: "select", default: "postgresql", options: ["postgresql", "mysql"] },
					{ name: "schema_path", type: "text" },
				],
			} as Partial<AddonManifest>),
		);
		setup();
		render(<BuilderPage />);

		pickTemplate();
		toggleAddon(/Nest Prisma/);

		expect(commandText()).toContain(
			"anesis use nest-prisma-v7 install --input provider=postgresql",
		);
		expect(commandText()).not.toContain("schema_path=");
	});

	describe("custom commands", () => {
		it("adds a typed command to the sequence and clears the draft", () => {
			setup();
			render(<BuilderPage />);
			pickTemplate();

			const input = screen.getByPlaceholderText("bun add tailwindcss");
			fireEvent.change(input, { target: { value: "bun add zod" } });
			fireEvent.click(screen.getByRole("button", { name: /^add$/i }));

			expect(commandText()).toContain("bun add zod");
			expect(input).toHaveValue("");
		});

		it("adds on Enter too", () => {
			setup();
			render(<BuilderPage />);
			pickTemplate();

			const input = screen.getByPlaceholderText("bun add tailwindcss");
			fireEvent.change(input, { target: { value: "bun add zod" } });
			fireEvent.keyDown(input, { key: "Enter" });

			expect(commandText()).toContain("bun add zod");
		});

		it("refuses to add a blank command", () => {
			setup();
			render(<BuilderPage />);

			const input = screen.getByPlaceholderText("bun add tailwindcss");
			fireEvent.change(input, { target: { value: "   " } });

			expect(screen.getByRole("button", { name: /^add$/i })).toBeDisabled();
		});

		it("can be removed from the sequence", () => {
			setup();
			render(<BuilderPage />);
			pickTemplate();

			fireEvent.change(screen.getByPlaceholderText("bun add tailwindcss"), {
				target: { value: "bun add zod" },
			});
			fireEvent.click(screen.getByRole("button", { name: /^add$/i }));
			fireEvent.click(screen.getByRole("button", { name: "Remove: bun add zod" }));

			expect(commandText()).not.toContain("bun add zod");
		});
	});

	describe("ordering", () => {
		it("moves an item later and reflects it in the command", () => {
			setup();
			render(<BuilderPage />);

			pickTemplate();
			toggleAddon(/Nest Prisma/);
			toggleAddon(/Nest Auth/);

			fireEvent.click(
				screen.getByRole("button", { name: "Move later: Nest Prisma" }),
			);

			const lines = commandText().split("\n");
			expect(lines.indexOf("anesis use nest-auth-jwt install")).toBeLessThan(
				lines.indexOf("anesis use nest-prisma-v7 install"),
			);
		});

		it("disables the move buttons at the ends of the list", () => {
			setup();
			render(<BuilderPage />);

			pickTemplate();
			toggleAddon(/Nest Prisma/);
			toggleAddon(/Nest Auth/);

			expect(
				screen.getByRole("button", { name: "Move earlier: Nest Prisma" }),
			).toBeDisabled();
			expect(
				screen.getByRole("button", { name: "Move later: Nest Auth" }),
			).toBeDisabled();
		});
	});

	describe("dependencies", () => {
		it("warns when a selected addon requires one that is not selected", () => {
			setManifest(
				auth.url,
				manifest({ id: "nest-auth-jwt", requires: ["nest-prisma-v7"] }),
			);
			setup();
			render(<BuilderPage />);

			pickTemplate();
			toggleAddon(/Nest Auth/);

			expect(screen.getByText(/some selected addons require/i)).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: /add required addons/i }),
			).toBeInTheDocument();
		});

		it("inserts a missing requirement ahead of its dependent", () => {
			setManifest(
				auth.url,
				manifest({ id: "nest-auth-jwt", requires: ["nest-prisma-v7"] }),
			);
			setup();
			render(<BuilderPage />);

			pickTemplate();
			toggleAddon(/Nest Auth/);
			fireEvent.click(screen.getByRole("button", { name: /add required addons/i }));

			const lines = commandText().split("\n");
			expect(lines.indexOf("anesis use nest-prisma-v7 install")).toBeLessThan(
				lines.indexOf("anesis use nest-auth-jwt install"),
			);
			expect(
				screen.queryByText(/some selected addons require/i),
			).not.toBeInTheDocument();
		});

		it("flags a requirement that is selected but runs too late, and can fix it", () => {
			setManifest(
				auth.url,
				manifest({ id: "nest-auth-jwt", requires: ["nest-prisma-v7"] }),
			);
			setup();
			render(<BuilderPage />);

			pickTemplate();
			toggleAddon(/Nest Auth/);
			toggleAddon(/Nest Prisma/); // selected, but after its dependent

			expect(screen.getByText(/which runs later in this list/i)).toBeInTheDocument();

			fireEvent.click(screen.getByRole("button", { name: /fix order/i }));

			const lines = commandText().split("\n");
			expect(lines.indexOf("anesis use nest-prisma-v7 install")).toBeLessThan(
				lines.indexOf("anesis use nest-auth-jwt install"),
			);
			expect(
				screen.queryByText(/which runs later in this list/i),
			).not.toBeInTheDocument();
		});
	});

	describe("download", () => {
		it("writes an anesis.stack.json containing the template and addon order", () => {
			setManifest(
				prisma.url,
				manifest({
					id: "nest-prisma-v7",
					inputs: [{ name: "provider", type: "text", default: "postgresql" }],
				} as Partial<AddonManifest>),
			);
			setup();

			const createObjectURL = vi.fn(() => "blob:stack");
			const revokeObjectURL = vi.fn();
			vi.stubGlobal("URL", { ...URL, createObjectURL, revokeObjectURL });
			const click = vi
				.spyOn(HTMLAnchorElement.prototype, "click")
				.mockImplementation(() => {});

			render(<BuilderPage />);
			pickTemplate();
			toggleAddon(/Nest Prisma/);
			fireEvent.change(screen.getByPlaceholderText("my-app"), {
				target: { value: "Billing API" },
			});

			fireEvent.click(
				screen.getByRole("button", { name: /download anesis\.stack\.json/i }),
			);

			expect(click).toHaveBeenCalled();
			const blob = createObjectURL.mock.calls[0][0] as unknown as Blob;
			expect(blob).toBeInstanceOf(Blob);
			expect(revokeObjectURL).toHaveBeenCalledWith("blob:stack");

			vi.unstubAllGlobals();
		});
	});

	describe("publishing", () => {
		it("prompts anonymous visitors to log in", () => {
			const { login } = setup({ user: null });
			render(<BuilderPage />);
			pickTemplate();

			fireEvent.click(screen.getByRole("button", { name: /login to publish/i }));
			expect(login).toHaveBeenCalled();
		});

		it("offers the publish dialog to a logged-in user", () => {
			setup({ user: createUser() });
			render(<BuilderPage />);
			pickTemplate();

			expect(
				screen.getByRole("button", { name: /^publish stack$/i }),
			).toBeInTheDocument();
		});
	});
});
