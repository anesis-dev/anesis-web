import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { getLocalAddonCatalog } from "@/services/addon-catalog";

describe("addon catalog service", () => {
	it("loads local addon manifests and derives catalog metadata", async () => {
		const root = await mkdtemp(path.join(os.tmpdir(), "oxide-addons-"));
		const addonDir = path.join(root, "nest-drizzle");
		await mkdir(addonDir, { recursive: true });
		await writeFile(
			path.join(addonDir, "oxide.addon.json"),
			JSON.stringify(
				{
					schema_version: "1",
					id: "nest-drizzle",
					name: "Nest Drizzle",
					version: "0.1.0",
					description: "Adds Drizzle ORM to a NestJS project.",
					author: "oxide-cli",
					requires: ["config"],
					inputs: [
						{
							name: "driver",
							type: "select",
							description: "Database driver",
							default: "postgres",
							required: true,
							options: ["postgres", "sqlite"],
						},
					],
					detect: [
						{
							id: "fastify",
							rules: [
								{
									type: "json_contains",
									file: "package.json",
									key_path: "dependencies.@nestjs/platform-fastify",
								},
							],
							match: "all",
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
									steps: [
										{ type: "create" },
										{ type: "inject" },
									],
								},
								{
									name: "generate",
									description: "Generates a resource",
									once: false,
									requires_commands: ["install"],
									inputs: [{ name: "name", type: "text" }],
									steps: [{ type: "replace" }],
								},
							],
						},
						{
							when: null,
							commands: [
								{
									name: "install",
									description: "Installs Drizzle",
									once: true,
									requires_commands: [],
									inputs: [],
									steps: [{ type: "create" }],
								},
							],
						},
					],
				},
				null,
				2,
			),
		);

		const catalog = await getLocalAddonCatalog(root);

		expect(catalog).toHaveLength(1);
		expect(catalog[0]).toMatchObject({
			id: "nest-drizzle",
			commandNames: ["generate", "install"],
			stepTypes: ["create", "inject", "replace"],
			inputNames: ["driver", "name"],
		});
		expect(catalog[0].manifestPath).toMatch(/nest-drizzle\/oxide\.addon\.json$/);
		expect(catalog[0].detect[0].rules[0]).toMatchObject({
			type: "json_contains",
			file: "package.json",
			key_path: "dependencies.@nestjs/platform-fastify",
		});

		await rm(root, { recursive: true, force: true });
	});

	it("returns an empty list when the addons directory is missing", async () => {
		const missing = path.join(os.tmpdir(), "oxide-addons-missing");

		await expect(getLocalAddonCatalog(missing)).resolves.toEqual([]);
	});
});
