import Link from "next/link";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const addonFlow = `oxide login
oxide new my-project nestjs
cd my-project
oxide addon install drizzle
oxide drizzle install
oxide drizzle connect`;

const addonCliSurface = `oxide addon install <addon_id>
oxide addon list
oxide addon remove <addon_id>
oxide <addon_id> <command>`;

const markerExample = `// @oxide:imports
import { Module } from '@nestjs/common';

@Module({
  imports: [
    // @oxide:modules
  ],
  providers: [
    // @oxide:providers
  ],
})
export class AppModule {}`;

const lockExample = `{
  "addons": [
    {
      "id": "drizzle",
      "version": "1.0.0",
      "variant": "nestjs",
      "commands_executed": ["install", "connect"]
    }
  ]
}`;

const topLevelExample = `{
  "schemaVersion": "1.0",
  "id": "drizzle",
  "name": "Drizzle ORM",
  "version": "1.0.0",
  "description": "Adds Drizzle ORM to a project",
  "author": {
    "name": "oxide-addons",
    "repo": "https://github.com/oxide-addons/drizzle"
  },
  "requires": ["config"]
}`;

const inputsExample = `"inputs": [
  {
    "name": "db_url",
    "type": "text",
    "description": "Database connection URL",
    "default": "postgresql://user:password@localhost:5432/mydb",
    "required": true
  },
  {
    "name": "driver",
    "type": "select",
    "description": "Database driver",
    "options": ["postgres", "mysql", "sqlite"],
    "default": "postgres",
    "required": true
  }
]`;

const detectExample = `"detect": [
  {
    "id": "nestjs",
    "rules": [
      {
        "type": "json_contains",
        "path": "package.json",
        "key_path": ["dependencies", "@nestjs/core"]
      }
    ]
  },
  {
    "id": "express",
    "rules": [
      {
        "type": "json_contains",
        "path": "package.json",
        "key_path": ["dependencies", "express"]
      },
      {
        "type": "json_contains",
        "path": "package.json",
        "key_path": ["dependencies", "@nestjs/core"],
        "negate": true
      }
    ],
    "match": "all"
  }
]`;

const variantsExample = `"variants": [
  {
    "when": "nestjs",
    "commands": []
  },
  {
    "when": "express",
    "commands": []
  },
  {
    "when": null,
    "commands": []
  }
]`;

const commandsExample = `"commands": [
  {
    "name": "install",
    "description": "Copies Drizzle files into the project",
    "once": true,
    "requires_commands": [],
    "steps": []
  },
  {
    "name": "connect",
    "description": "Wires Drizzle into the generated modules",
    "once": false,
    "requires_commands": ["install"],
    "steps": []
  }
]`;

const rollbackExample = `Error: marker "@oxide:modules" not found in src/app.module.ts

[k] keep changes made so far
[r] rollback all changes`;

const fullAddonExample = `{
  "schemaVersion": "1.0",
  "id": "drizzle",
  "name": "Drizzle ORM",
  "version": "1.0.0",
  "description": "Adds Drizzle ORM to a project",
  "author": {
    "name": "oxide-addons",
    "repo": "https://github.com/oxide-addons/drizzle"
  },
  "requires": ["config"],
  "inputs": [
    {
      "name": "db_url",
      "type": "text",
      "description": "Database connection URL",
      "default": "postgresql://user:password@localhost:5432/mydb",
      "required": true
    },
    {
      "name": "driver",
      "type": "select",
      "description": "Database driver",
      "options": ["postgres", "mysql", "sqlite"],
      "default": "postgres",
      "required": true
    }
  ],
  "detect": [
    {
      "id": "nestjs",
      "rules": [
        {
          "type": "json_contains",
          "path": "package.json",
          "key_path": ["dependencies", "@nestjs/core"]
        }
      ]
    },
    {
      "id": "express",
      "rules": [
        {
          "type": "json_contains",
          "path": "package.json",
          "key_path": ["dependencies", "express"]
        },
        {
          "type": "json_contains",
          "path": "package.json",
          "key_path": ["dependencies", "@nestjs/core"],
          "negate": true
        }
      ],
      "match": "all"
    }
  ],
  "variants": [
    {
      "when": "nestjs",
      "commands": [
        {
          "name": "install",
          "description": "Copies Drizzle files into the project",
          "once": true,
          "requires_commands": [],
          "steps": [
            {
              "type": "copy",
              "from": {
                "repo": "https://github.com/oxide-addons/drizzle",
                "ref": "main",
                "files": [
                  "templates/drizzle.config.ts",
                  "templates/src/database/drizzle.module.ts"
                ]
              },
              "to": {
                "templates/drizzle.config.ts": "drizzle.config.ts",
                "templates/src/database/drizzle.module.ts": "src/database/drizzle.module.ts"
              },
              "ifExists": "ask"
            },
            {
              "type": "append",
              "target": { "file": ".env.example" },
              "content": [
                "",
                "# Drizzle",
                "DATABASE_URL={{ db_url }}"
              ],
              "deduplicate": true
            }
          ]
        },
        {
          "name": "connect",
          "description": "Wires Drizzle into the generated modules",
          "once": false,
          "requires_commands": ["install"],
          "steps": [
            {
              "type": "inject",
              "target": { "glob": "src/**/*.module.ts" },
              "operations": [
                {
                  "marker": "@oxide:imports",
                  "position": "after",
                  "content": [
                    "import { DrizzleModule } from '../database/drizzle.module';"
                  ],
                  "deduplicate": true,
                  "ifNotFound": "warn_and_ask"
                },
                {
                  "marker": "@oxide:modules",
                  "position": "after",
                  "content": [
                    "DrizzleModule,"
                  ],
                  "deduplicate": true,
                  "ifNotFound": "warn_and_ask"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}`;

const rustTypesExample = `// DetectRule
#[derive(Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum DetectRule {
    FileExists   { path: String },
    FileContains { path: String, value: String },
    JsonContains { path: String, key_path: Vec<String> },
    TomlContains { path: String, key_path: Vec<String> },
    YamlContains { path: String, key_path: Vec<String> },
    XmlContains  { path: String, xpath: String },
}

// Step
#[derive(Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum Step {
    Copy(CopyStep),
    Create(CreateStep),
    Inject(InjectStep),
    Replace(ReplaceStep),
    Append(AppendStep),
    Delete(DeleteStep),
    Rename(RenameStep),
    Move(MoveStep),
}

#[derive(Deserialize, Default)]
#[serde(rename_all = "snake_case")]
pub enum MatchStrategy {
    #[default]
    Any,
    All,
}

#[derive(Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum InputType {
    Text,
    Select,
}`;

const cratesExample = `[dependencies]
serde        = { version = "1", features = ["derive"] }
serde_json   = "1"
toml         = "0.8"
serde_yaml   = "0.9"
roxmltree    = "0.19"`;

const addonPrinciples = [
	"Oxide is a declarative Rust CLI for scaffolding and code transformation.",
	"Addons are described entirely in JSON manifests instead of executable user scripts.",
	"Users scaffold a project first, then run named addon commands that perform file operations.",
];

const authoringSteps = [
	"Start from an official Oxide-generated project so the marker contract already exists.",
	"Create an `oxide.addon.json` manifest with metadata, dependencies, inputs, and variants.",
	"Define named commands such as `install` or `connect`, then break each command into file-operation steps.",
	"Test the addon against real generated projects for each detected variant and verify `oxide.lock` records the expected state.",
];

const lockUses = [
	"Tracks which addons are already installed in the current project.",
	"Stores the resolved variant and executed commands for each addon.",
	"Prevents `once: true` commands from running a second time.",
	"Validates addon dependencies and `requires_commands` before command execution starts.",
];

const manifestSections = [
	{
		title: "Top-level metadata",
		description:
			"`id`, `name`, `version`, `description`, and `author` identify the addon. `requires` lists other addon ids that must exist in `oxide.lock` before this addon can run.",
		code: topLevelExample,
	},
	{
		title: "Inputs and interpolation",
		description:
			"Oxide collects input values before any step executes. Use `text` or `select`, provide defaults when possible, and reference values anywhere in the manifest through `{{ name }}` placeholders.",
		code: inputsExample,
	},
	{
		title: "Detect and variants",
		description:
			"Detection decides which variant to use for the current project. Oxide resolves the first matching `id`, supports `match: \"any\" | \"all\"`, and lets you invert a rule with `negate: true`.",
		code: detectExample,
	},
	{
		title: "Variants and commands",
		description:
			"`when: null` is the fallback variant. Commands are explicit entry points, can be gated by `requires_commands`, and may be marked with `once: true`.",
		code: `${variantsExample}\n\n${commandsExample}`,
	},
];

const detectRules = [
	{
		name: "file_exists",
		description: "Checks whether a file is present.",
		example: `{ "type": "file_exists", "path": "nest-cli.json" }`,
	},
	{
		name: "file_contains",
		description:
			"Performs a direct substring check in plain text files such as `requirements.txt` or `go.mod`.",
		example:
			`{ "type": "file_contains", "path": "requirements.txt", "value": "django" }`,
	},
	{
		name: "json_contains",
		description:
			"Navigates through JSON keys, which is useful for files like `package.json` or `composer.json`.",
		example:
			`{ "type": "json_contains", "path": "package.json", "key_path": ["dependencies", "@nestjs/core"] }`,
	},
	{
		name: "toml_contains",
		description:
			"Navigates TOML key paths for files such as `Cargo.toml` or `pyproject.toml`.",
		example:
			`{ "type": "toml_contains", "path": "Cargo.toml", "key_path": ["dependencies", "actix-web"] }`,
	},
	{
		name: "yaml_contains",
		description:
			"Navigates YAML key paths for manifests like `pubspec.yaml` or `package.yaml`.",
		example:
			`{ "type": "yaml_contains", "path": "pubspec.yaml", "key_path": ["dependencies", "flutter"] }`,
	},
	{
		name: "xml_contains",
		description:
			"Searches XML via XPath, which covers files like `pom.xml` or `*.csproj`.",
		example:
			`{ "type": "xml_contains", "path": "pom.xml", "xpath": "//dependencies/dependency/artifactId" }`,
	},
];

const stepTypes = [
	{
		name: "copy",
		description:
			"Copies files from an external repository into the project. `ifExists: \"ask\"` lets the user decide whether to skip or overwrite.",
		code: `{
  "type": "copy",
  "from": {
    "repo": "https://github.com/oxide-addons/drizzle",
    "ref": "main",
    "files": [
      "templates/drizzle.config.ts",
      "templates/src/database/drizzle.module.ts"
    ]
  },
  "to": {
    "templates/drizzle.config.ts": "drizzle.config.ts",
    "templates/src/database/drizzle.module.ts": "src/database/drizzle.module.ts"
  },
  "ifExists": "ask"
}`,
	},
	{
		name: "create",
		description:
			"Creates a new file directly from manifest content and supports input interpolation.",
		code: `{
  "type": "create",
  "target": { "file": "src/config/database.ts" },
  "content": [
    "export const config = {",
    "  url: '{{ db_url }}',",
    "  driver: '{{ driver }}'",
    "}"
  ],
  "ifExists": "ask"
}`,
	},
	{
		name: "inject",
		description:
			"Finds files by glob and inserts content relative to markers. `deduplicate: true` checks each inserted line independently.",
		code: `{
  "type": "inject",
  "target": { "glob": "src/**/*.module.ts" },
  "operations": [
    {
      "marker": "@oxide:imports",
      "position": "after",
      "content": [
        "import { DrizzleModule } from '../database/drizzle.module';"
      ],
      "deduplicate": true,
      "ifNotFound": "warn_and_ask"
    },
    {
      "marker": "@oxide:modules",
      "position": "after",
      "content": [
        "DrizzleModule,"
      ],
      "deduplicate": true,
      "ifNotFound": "warn_and_ask"
    }
  ]
}`,
	},
	{
		name: "replace",
		description:
			"Replaces content relative to a marker instead of relying on fragile global search and replace.",
		code: `{
  "type": "replace",
  "target": { "file": "drizzle.config.ts" },
  "marker": "@oxide:driver",
  "content": [
    "driver: '{{ driver }}'"
  ]
}`,
	},
	{
		name: "append",
		description:
			"Adds content to the end of a file. `deduplicate: true` avoids appending duplicate lines.",
		code: `{
  "type": "append",
  "target": { "file": ".env.example" },
  "content": [
    "",
    "# Drizzle",
    "DATABASE_URL={{ db_url }}"
  ],
  "deduplicate": true
}`,
	},
	{
		name: "delete",
		description:
			"Supports deleting an entire file or deleting the region between two markers. `include_markers: true` removes the marker lines themselves.",
		code: `{
  "type": "delete",
  "mode": "file",
  "target": { "file": "prisma/schema.prisma" }
}

{
  "type": "delete",
  "mode": "between_markers",
  "target": { "glob": "src/**/*.ts" },
  "marker_start": "@oxide:delete_start",
  "marker_end": "@oxide:delete_end",
  "include_markers": true
}`,
	},
	{
		name: "rename",
		description:
			"Renames a file in place. Oxide errors if the destination name already exists.",
		code: `{
  "type": "rename",
  "from": "src/app.module.ts",
  "to": "src/core.module.ts"
}`,
	},
	{
		name: "move",
		description:
			"Moves a file to another directory. Oxide errors if the destination path already exists.",
		code: `{
  "type": "move",
  "from": "src/database.ts",
  "to": "src/database/index.ts"
}`,
	},
];

export default function DocsAddonsPage() {
	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-10 lg:px-8">
			<section className="space-y-3">
				<p className="text-sm font-medium text-primary">Addons</p>
				<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
					Build safe Oxide addons with JSON manifests
				</h1>
				<p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
					Oxide addons are declarative extension packages for generated projects.
					The core design constraint is strict: no user-supplied executable code
					runs inside the CLI. Everything is expressed through a JSON manifest and
					resolved into deterministic file operations.
				</p>
			</section>

			<Card className="border-dashed">
				<CardHeader>
					<CardTitle className="text-base">Current CLI and backend status</CardTitle>
					<CardDescription>
						The live backend surface for addons now includes publishing,
						discovery, archive resolution, and deletion. The public CLI can
						cache addons with `oxide addon ...`, list and remove cached entries,
						and run named addon commands inside a project through
						<code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">oxide &lt;addon_id&gt; &lt;command&gt;</code>.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<CodeBlock code={addonCliSurface} />
					<p className="text-sm text-muted-foreground">
						Addon archive resolution is authenticated, so log in before
						<code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">
							oxide addon install
						</code>
						or the first
						<code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">
							oxide &lt;addon_id&gt; &lt;command&gt;
						</code>
						run.
					</p>
					<div className="flex flex-wrap gap-3">
						<Button variant="outline" asChild>
							<Link href="/addons">Open addon registry</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/account/addons">Manage your addons</Link>
						</Button>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>What an addon flow looks like</CardTitle>
						<CardDescription>
							Users authenticate, scaffold first, warm the addon cache when it helps, then run named addon commands explicitly inside the project.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<CodeBlock code={addonFlow} />
						<p className="text-sm text-muted-foreground">
							Explicit <code>oxide addon install</code> keeps the global addon cache
							warm. If you skip it, the first <code>oxide &lt;addon_id&gt; &lt;command&gt;</code>
							run downloads the addon before execution.
						</p>
						<ul className="space-y-3 text-sm text-muted-foreground">
							{addonPrinciples.map((item) => (
								<li key={item} className="flex gap-2">
									<span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>How to create an addon</CardTitle>
						<CardDescription>
							Authoring is mostly about defining a reliable contract, not writing
							custom logic.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3 text-sm text-muted-foreground">
						{authoringSteps.map((item, index) => (
							<p key={item}>
								{index + 1}. {item}
							</p>
						))}
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Markers are the integration contract</CardTitle>
					<CardDescription>
						Markers are normal code comments placed by the template author so
						addons know exactly where to edit files.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<CodeBlock code={markerExample} />
					<p className="text-sm text-muted-foreground">
						Oxide works only with projects created through Oxide templates. That
						is a deliberate reliability tradeoff: official templates guarantee
						that required markers exist, so addon operations stay deterministic.
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>`oxide.lock` records addon state</CardTitle>
					<CardDescription>
						Each generated project keeps addon installation state at the root.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<CodeBlock code={lockExample} />
					<ul className="space-y-3 text-sm text-muted-foreground">
						{lockUses.map((item) => (
							<li key={item} className="flex gap-2">
								<span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
								<span>{item}</span>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>

			<section className="space-y-4">
				<div className="space-y-2">
					<h2 className="text-2xl font-bold tracking-tight">
						Anatomy of `oxide.addon.json`
					</h2>
					<p className="max-w-3xl text-sm leading-6 text-muted-foreground">
						The manifest defines metadata, user prompts, project detection,
						variant selection, command boundaries, and the exact file operations
						Oxide will execute.
					</p>
				</div>

				<div className="grid gap-6 lg:grid-cols-2">
					{manifestSections.map((section) => (
						<Card key={section.title}>
							<CardHeader>
								<CardTitle>{section.title}</CardTitle>
								<CardDescription>{section.description}</CardDescription>
							</CardHeader>
							<CardContent>
								<CodeBlock code={section.code} />
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			<section className="space-y-4">
				<div className="space-y-2">
					<h2 className="text-2xl font-bold tracking-tight">Detect rule types</h2>
					<p className="max-w-3xl text-sm leading-6 text-muted-foreground">
						Detection rules let one addon support several project shapes without
						embedding imperative logic in the addon itself.
					</p>
				</div>

				<div className="grid gap-4 lg:grid-cols-2">
					{detectRules.map((rule) => (
						<Card key={rule.name}>
							<CardHeader>
								<CardTitle className="font-mono text-base">{rule.name}</CardTitle>
								<CardDescription>{rule.description}</CardDescription>
							</CardHeader>
							<CardContent>
								<CodeBlock code={rule.example} />
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			<section className="space-y-4">
				<div className="space-y-2">
					<h2 className="text-2xl font-bold tracking-tight">Step types</h2>
					<p className="max-w-3xl text-sm leading-6 text-muted-foreground">
						Commands are composed from file-system focused steps. Each step is
						declarative and bounded by the manifest schema.
					</p>
				</div>

				<div className="grid gap-4 lg:grid-cols-2">
					{stepTypes.map((step) => (
						<Card key={step.name}>
							<CardHeader>
								<CardTitle className="font-mono text-base">{step.name}</CardTitle>
								<CardDescription>{step.description}</CardDescription>
							</CardHeader>
							<CardContent>
								<CodeBlock code={step.code} />
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Rollback behavior</CardTitle>
						<CardDescription>
							If a step fails halfway through, Oxide should explain what failed
							and let the user decide whether to keep or rollback prior changes.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<CodeBlock code={rollbackExample} />
						<p className="text-sm text-muted-foreground">
							This keeps partial edits explicit instead of silently leaving the
							project in an unclear state.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Rust types and crates</CardTitle>
						<CardDescription>
							The manifest format maps naturally to tagged serde enums and a
							small parsing dependency set.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<CodeBlock code={rustTypesExample} />
						<CodeBlock code={cratesExample} />
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Complete example</CardTitle>
					<CardDescription>
						A full addon manifest tying together metadata, detection, inputs,
						variants, commands, and steps.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<CodeBlock code={fullAddonExample} />
				</CardContent>
			</Card>

			<DocsPagination currentHref="/docs/addons" />
		</div>
	);
}
