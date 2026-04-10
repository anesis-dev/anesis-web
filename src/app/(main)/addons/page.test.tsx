import { render, screen } from "@testing-library/react";

vi.mock("@/services/addon-catalog", () => ({
	getLocalAddonCatalog: vi.fn(),
}));

import AddonsPage from "@/app/(main)/addons/page";
import { getLocalAddonCatalog } from "@/services/addon-catalog";

describe("AddonsPage", () => {
	it("renders the manifest-driven addon catalog", async () => {
		vi.mocked(getLocalAddonCatalog).mockResolvedValueOnce([
			{
				$schema: "https://api.example.test/schema/oxide.addon.schema.json",
				schema_version: "1",
				id: "nest-drizzle",
				name: "Nest Drizzle",
				version: "0.1.0",
				description: "Adds Drizzle ORM to a NestJS project.",
				author: "oxide-cli",
				requires: [],
				inputs: [],
				detect: [
					{
						id: "fastify",
						match: "all",
						rules: [
							{
								type: "json_contains",
								file: "package.json",
								key_path: "dependencies.@nestjs/platform-fastify",
								negate: false,
							},
						],
					},
				],
				variants: [
					{
						when: "fastify",
						commands: [
							{
								name: "install",
								description: "Installs Drizzle",
								once: true,
								requires_commands: [],
								inputs: [],
								steps: [{ type: "create" }, { type: "inject" }],
							},
						],
					},
					{
						when: null,
						commands: [
							{
								name: "generate",
								description: "Generates a resource",
								once: false,
								requires_commands: ["install"],
								inputs: [],
								steps: [{ type: "replace" }],
							},
						],
					},
				],
				manifestPath: "addons/nest-drizzle/oxide.addon.json",
				rawManifest: "{\n  \"id\": \"nest-drizzle\"\n}",
				commandNames: ["generate", "install"],
				stepTypes: ["create", "inject", "replace"],
				inputNames: [],
			},
		]);

		render(await AddonsPage());

		expect(
			screen.getByRole("heading", {
				name: /official addons generated from live oxide\.addon\.json/i,
			}),
		).toBeInTheDocument();
		expect(screen.getByText("Nest Drizzle")).toBeInTheDocument();
		expect(screen.getByText(/dependencies\.\@nestjs\/platform-fastify/i)).toBeInTheDocument();
		expect(screen.getByText("Fallback variant")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /open registry explorer/i })).toHaveAttribute(
			"href",
			"/addons/registry",
		);
	});
});
