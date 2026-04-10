import { Dirent, promises as fs } from "node:fs";
import path from "node:path";
import {
  AddonManifest,
  AddonManifestCommand,
  AddonManifestDetectBlock,
  AddonManifestDetectRule,
  AddonManifestInput,
  AddonManifestStep,
  AddonManifestVariant,
  LocalAddonCatalogEntry,
} from "@/types/addon-manifest";

function expectRecord(
  value: unknown,
  location: string,
): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${location} must be an object.`);
  }

  return value as Record<string, unknown>;
}

function expectString(value: unknown, location: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${location} must be a non-empty string.`);
  }

  return value;
}

function expectStringArray(value: unknown, location: string): string[] {
  if (!Array.isArray(value)) {
    throw new Error(`${location} must be an array.`);
  }

  return value.map((item, index) =>
    expectString(item, `${location}[${index}]`),
  );
}

function parseInput(value: unknown, location: string): AddonManifestInput {
  const input = expectRecord(value, location);
  const type = expectString(input.type, `${location}.type`);

  if (!["text", "boolean", "select"].includes(type)) {
    throw new Error(`${location}.type must be text, boolean, or select.`);
  }

  return {
    name: expectString(input.name, `${location}.name`),
    type: type as AddonManifestInput["type"],
    description: typeof input.description === "string" ? input.description : "",
    default: typeof input.default === "string" ? input.default : undefined,
    required: typeof input.required === "boolean" ? input.required : false,
    options: Array.isArray(input.options)
      ? expectStringArray(input.options, `${location}.options`)
      : [],
  };
}

function parseDetectRule(
  value: unknown,
  location: string,
): AddonManifestDetectRule {
  const rule = expectRecord(value, location);
  const type = expectString(rule.type, `${location}.type`);

  if (
    ![
      "file_exists",
      "file_contains",
      "json_contains",
      "toml_contains",
      "yaml_contains",
    ].includes(type)
  ) {
    throw new Error(`${location}.type is not supported by the web catalog.`);
  }

  return {
    type: type as AddonManifestDetectRule["type"],
    file: expectString(rule.file, `${location}.file`),
    contains: typeof rule.contains === "string" ? rule.contains : undefined,
    key_path: typeof rule.key_path === "string" ? rule.key_path : undefined,
    value: typeof rule.value === "string" ? rule.value : undefined,
    negate: typeof rule.negate === "boolean" ? rule.negate : false,
  };
}

function parseDetectBlock(
  value: unknown,
  location: string,
): AddonManifestDetectBlock {
  const block = expectRecord(value, location);
  const matchMode = typeof block.match === "string" ? block.match : "any";

  if (!["any", "all"].includes(matchMode)) {
    throw new Error(`${location}.match must be "any" or "all".`);
  }

  if (!Array.isArray(block.rules)) {
    throw new Error(`${location}.rules must be an array.`);
  }

  return {
    id: expectString(block.id, `${location}.id`),
    match: matchMode as AddonManifestDetectBlock["match"],
    rules: block.rules.map((rule, index) =>
      parseDetectRule(rule, `${location}.rules[${index}]`),
    ),
  };
}

function parseStep(value: unknown, location: string): AddonManifestStep {
  const step = expectRecord(value, location);

  return {
    type: expectString(step.type, `${location}.type`),
  };
}

function parseCommand(value: unknown, location: string): AddonManifestCommand {
  const command = expectRecord(value, location);

  if (!Array.isArray(command.steps)) {
    throw new Error(`${location}.steps must be an array.`);
  }

  return {
    name: expectString(command.name, `${location}.name`),
    description:
      typeof command.description === "string" ? command.description : "",
    once: typeof command.once === "boolean" ? command.once : false,
    requires_commands: Array.isArray(command.requires_commands)
      ? expectStringArray(
          command.requires_commands,
          `${location}.requires_commands`,
        )
      : [],
    inputs: Array.isArray(command.inputs)
      ? command.inputs.map((input, index) =>
          parseInput(input, `${location}.inputs[${index}]`),
        )
      : [],
    steps: command.steps.map((step, index) =>
      parseStep(step, `${location}.steps[${index}]`),
    ),
  };
}

function parseVariant(value: unknown, location: string): AddonManifestVariant {
  const variant = expectRecord(value, location);

  if (!Array.isArray(variant.commands)) {
    throw new Error(`${location}.commands must be an array.`);
  }

  return {
    when:
      typeof variant.when === "string" || variant.when === null
        ? variant.when
        : null,
    commands: variant.commands.map((command, index) =>
      parseCommand(command, `${location}.commands[${index}]`),
    ),
  };
}

export function parseAddonManifest(
  value: unknown,
  location: string,
): AddonManifest {
  const manifest = expectRecord(value, location);

  return {
    $schema:
      typeof manifest.$schema === "string" ? manifest.$schema : undefined,
    schema_version: expectString(
      manifest.schema_version,
      `${location}.schema_version`,
    ),
    id: expectString(manifest.id, `${location}.id`),
    name: expectString(manifest.name, `${location}.name`),
    version: expectString(manifest.version, `${location}.version`),
    description: expectString(manifest.description, `${location}.description`),
    author: expectString(manifest.author, `${location}.author`),
    requires: Array.isArray(manifest.requires)
      ? expectStringArray(manifest.requires, `${location}.requires`)
      : [],
    inputs: Array.isArray(manifest.inputs)
      ? manifest.inputs.map((input, index) =>
          parseInput(input, `${location}.inputs[${index}]`),
        )
      : [],
    detect: Array.isArray(manifest.detect)
      ? manifest.detect.map((block, index) =>
          parseDetectBlock(block, `${location}.detect[${index}]`),
        )
      : [],
    variants: Array.isArray(manifest.variants)
      ? manifest.variants.map((variant, index) =>
          parseVariant(variant, `${location}.variants[${index}]`),
        )
      : [],
  };
}

function getDefaultAddonsRoot(): string {
  if (process.env.OXIDE_ADDONS_DIR) {
    return path.resolve(process.env.OXIDE_ADDONS_DIR);
  }

  return path.resolve(process.cwd(), "..", "addons");
}

export async function getLocalAddonCatalog(
  addonsRoot = getDefaultAddonsRoot(),
): Promise<LocalAddonCatalogEntry[]> {
  let entries: Dirent[];

  try {
    entries = await fs.readdir(addonsRoot, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }

  const workspaceRoot = path.resolve(addonsRoot, "..");
  const manifests = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const manifestPath = path.join(
          addonsRoot,
          entry.name,
          "oxide.addon.json",
        );

        try {
          const rawManifest = await fs.readFile(manifestPath, "utf8");
          const manifest = parseAddonManifest(
            JSON.parse(rawManifest) as unknown,
            path.relative(workspaceRoot, manifestPath),
          );
          const commandNames = Array.from(
            new Set(
              manifest.variants.flatMap((variant) =>
                variant.commands.map((command) => command.name),
              ),
            ),
          ).sort();
          const stepTypes = Array.from(
            new Set(
              manifest.variants.flatMap((variant) =>
                variant.commands.flatMap((command) =>
                  command.steps.map((step) => step.type),
                ),
              ),
            ),
          ).sort();
          const inputNames = Array.from(
            new Set([
              ...manifest.inputs.map((input) => input.name),
              ...manifest.variants.flatMap((variant) =>
                variant.commands.flatMap((command) =>
                  command.inputs.map((input) => input.name),
                ),
              ),
            ]),
          ).sort();

          return {
            ...manifest,
            rawManifest,
            manifestPath: path.relative(workspaceRoot, manifestPath),
            commandNames,
            stepTypes,
            inputNames,
          } satisfies LocalAddonCatalogEntry;
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return null;
          }

          throw new Error(
            `Failed to load addon manifest at ${path.relative(
              workspaceRoot,
              manifestPath,
            )}: ${error instanceof Error ? error.message : "Unknown error."}`,
          );
        }
      }),
  );

  return manifests
    .filter((manifest): manifest is LocalAddonCatalogEntry => manifest !== null)
    .sort((left, right) => left.name.localeCompare(right.name));
}
