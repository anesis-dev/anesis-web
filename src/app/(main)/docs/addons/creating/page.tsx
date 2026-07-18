import { BoxesIcon } from "lucide-react";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { DocsHero } from "@/components/docs/DocsHero";
import { CodeBlock } from "@/components/docs/CodeBlock";
import {
	DocsSection,
	DocsSubheading,
	DocsList,
} from "@/components/docs/prose";

const manifestOverview = `{
  "schema_version": "1",
  "id": "nest-drizzle",
  "name": "Nest Drizzle",
  "version": "0.1.0",
  "description": "Adds Drizzle ORM to a NestJS project.",
  "author": "your-github-username",
  "requires": ["dotenv"],
  "inputs": [...],
  "detect": [...],
  "variants": [...]
}`;

const inputsExample = `"inputs": [
  {
    "name": "package_name",
    "type": "text",
    "description": "Package scope to use (e.g. @myorg)",
    "default": "@app",
    "required": true
  },
  {
    "name": "use_ssl",
    "type": "boolean",
    "description": "Enable SSL for the database connection?",
    "default": false,
    "required": false
  },
  {
    "name": "driver",
    "type": "select",
    "description": "Database driver",
    "default": "postgres",
    "required": true,
    "options": ["postgres", "sqlite", "mysql"]
  }
]`;

const derivedVariables = `# Given input name: "package_name" with value "@myorg/api"
{{ package_name }}         → @myorg/api
{{ package_name_pascal }}  → MyorgApi
{{ package_name_camel }}   → myorgApi
{{ package_name_kebab }}   → myorg-api
{{ package_name_snake }}   → myorg_api`;

const detectExample = `"detect": [
  {
    "id": "fastify",
    "match": "all",
    "rules": [
      {
        "type": "json_contains",
        "file": "package.json",
        "key_path": "dependencies.@nestjs/platform-fastify"
      }
    ]
  },
  {
    "id": "has-env",
    "match": "any",
    "rules": [
      { "type": "file_exists", "file": ".env" },
      { "type": "file_exists", "file": ".env.local" }
    ]
  }
]`;

const variantsExample = `"variants": [
  {
    "when": "fastify",
    "commands": [
      { "name": "install", "steps": [...] }
    ]
  },
  {
    "when": null,
    "commands": [
      { "name": "install", "steps": [...] }
    ]
  }
]`;

const commandExample = `{
  "name": "install",
  "description": "Install Drizzle ORM support",
  "once": true,
  "requires_commands": ["bootstrap"],
  "inputs": [
    {
      "name": "driver",
      "type": "select",
      "description": "Database driver",
      "default": "postgres",
      "required": true,
      "options": ["postgres", "sqlite"]
    }
  ],
  "steps": [...]
}`;

const stepCopy = `{
  "type": "copy",
  "src": "templates/drizzle.config.ts",
  "dest": "drizzle.config.ts",
  "if_exists": "ask"
}`;

const stepCreate = `{
  "type": "create",
  "path": "src/db/{{ driver_kebab }}.ts",
  "content": "export const driver = '{{ driver }}';\\n",
  "if_exists": "overwrite"
}`;

const stepInject = `{
  "type": "inject",
  "target": { "type": "file", "file": "src/app.module.ts" },
  "content": "import { DrizzleModule } from './db/drizzle.module';",
  "after": "// anesis:top-imports",
  "if_not_found": "error"
}`;

const stepReplace = `{
  "type": "replace",
  "target": { "type": "glob", "glob": "src/**/*.ts" },
  "find": "// TODO: add-db-import",
  "replace": "import { db } from './db';",
  "if_not_found": "skip"
}`;

const stepAppend = `{
  "type": "append",
  "target": { "type": "file", "file": ".env" },
  "content": "DATABASE_URL={{ db_url }}\\n"
}`;

const stepDelete = `{
  "type": "delete",
  "target": { "type": "file", "file": "src/db/placeholder.ts" }
}`;

const stepRename = `{
  "type": "rename",
  "from": "src/db/template.ts",
  "to": "src/db/{{ driver_snake }}.ts"
}`;

const stepPackages = `{
  "type": "packages",
  "dependencies": ["drizzle-orm", "{{ driver }}"],
  "dev_dependencies": ["drizzle-kit"]
}`;

const stepRun = `{
  "type": "run",
  "command": "npx drizzle-kit generate --dialect {{ driver }}",
  "description": "Generate the initial Drizzle migration"
}`;

const topLevelFields = [
	{ field: "schema_version", desc: 'Always "1" for the current format.' },
	{
		field: "id",
		desc: "The registry identifier — used in CLI commands as the addon-id.",
	},
	{ field: "name", desc: "Human-readable display name shown in the registry UI." },
	{ field: "version", desc: "Semantic version of this addon." },
	{
		field: "description",
		desc: "One-line description of what the addon adds to a project.",
	},
	{ field: "author", desc: "The author's GitHub username or organization." },
	{
		field: "requires",
		desc: "Array of addon IDs that must already be applied in this project (present in anesis.lock) before this addon runs — not merely cached. Anesis refuses to run with a clear error naming the missing dependency.",
	},
];

const detectRules = [
	{ rule: "file_exists", desc: "Passes when a given file path exists in the project." },
	{ rule: "file_contains", desc: "Passes when a file contains a specific string." },
	{
		rule: "json_contains",
		desc: "Passes when a JSON file has a value at a specific key path (dot-separated).",
	},
	{
		rule: "toml_contains",
		desc: "Passes when a TOML file has a value at a specific key path.",
	},
	{
		rule: "yaml_contains",
		desc: "Passes when a YAML file has a value at a specific key path.",
	},
	{ rule: "negate: true", desc: "Add to any rule to invert its result." },
];

const commandFields = [
	{
		field: "once",
		desc: 'When true, the command will not run if its name already appears in anesis.lock for this addon. Use this for one-time setup commands like "install".',
	},
	{
		field: "requires_commands",
		desc: "A list of command names that must have already run (appear in anesis.lock) before this command executes. Enforces ordering between commands.",
	},
];

const stepTypes: {
	name: string;
	id: string;
	summary: string;
	code: string;
	note?: React.ReactNode;
}[] = [
	{
		name: "copy",
		id: "step-copy",
		summary: "Copy a file from your addon's directory into the project.",
		code: stepCopy,
		note: (
			<>
				<code>if_exists</code> controls behavior when the destination file
				already exists: <code>overwrite</code> (default), <code>ask</code>, or{" "}
				<code>skip</code>.
			</>
		),
	},
	{
		name: "create",
		id: "step-create",
		summary: "Create a new file with rendered content at a given path.",
		code: stepCreate,
		note: (
			<>
				Both <code>path</code> and <code>content</code> are rendered through
				Tera. Use input variables in the path to generate files with dynamic
				names.
			</>
		),
	},
	{
		name: "inject",
		id: "step-inject",
		summary: "Insert content into an existing file at a named marker.",
		code: stepInject,
		note: (
			<>
				Use <code>after</code> or <code>before</code> to name a marker string. If
				neither is specified, content is prepended to the file. The{" "}
				<code>if_not_found</code> field controls what happens if the marker is
				absent: <code>warn_and_ask</code> (default), <code>skip</code>, or{" "}
				<code>error</code>.
			</>
		),
	},
	{
		name: "replace",
		id: "step-replace",
		summary: "Find a string in file(s) and replace it with new content.",
		code: stepReplace,
		note: (
			<>
				Both <code>find</code> and <code>replace</code> are rendered through Tera.
				Use glob targets to apply the same replacement across many files. Use{" "}
				<code>// anesis:</code> comment markers in your template source to create
				predictable insertion points.
			</>
		),
	},
	{
		name: "append",
		id: "step-append",
		summary: "Append rendered content to the end of one or more files.",
		code: stepAppend,
		note: (
			<>
				Anesis ensures the file ends with a newline before appending, so you
				don&apos;t get content accidentally concatenated onto the last existing
				line.
			</>
		),
	},
	{
		name: "delete",
		id: "step-delete",
		summary:
			"Remove files from the project. Supports both single files and glob patterns.",
		code: stepDelete,
		note: (
			<>
				Delete is not rolled back on failure. If you need to delete files as part
				of a reversible operation, place delete steps at the end of your step
				list after all create/inject steps succeed.
			</>
		),
	},
	{
		name: "rename and move",
		id: "step-rename",
		summary:
			"Rename a file or move it to a new location. Both the source and destination paths are rendered through Tera.",
		code: stepRename,
	},
	{
		name: "packages",
		id: "step-packages",
		summary:
			"Add production and/or dev dependencies using whatever package manager the project already uses.",
		code: stepPackages,
		note: (
			<>
				Anesis detects the manager from lockfiles/manifests already in the
				project root — <code>bun.lock(b)</code>, <code>pnpm-lock.yaml</code>,{" "}
				<code>yarn.lock</code>, <code>package.json</code> (npm), or{" "}
				<code>Cargo.toml</code> — and runs its native add command (
				<code>npm install</code> for npm, <code>&lt;pm&gt; add</code>{" "}
				otherwise, with each tool&apos;s own dev-dependency flag). The
				manifest and lockfile are snapshotted first and restored if the
				command fails, so a failed install doesn&apos;t leave a half-modified
				package.json.
			</>
		),
	},
	{
		name: "run",
		id: "step-run",
		summary:
			"Execute an arbitrary shell command in the project root — for anything the other step types can't express, like running a code generator.",
		code: stepRun,
		note: (
			<>
				<code>command</code> is rendered through Tera first. Because this runs
				unsandboxed code, Anesis always prints the exact resolved command and
				asks for an explicit yes before executing it — unless{" "}
				<code>--yes</code> or non-interactive mode is active. A run step is{" "}
				<span className="font-medium text-foreground">not reversible</span>:
				it's recorded in the rollback journal as an irreversible action, so{" "}
				<code>anesis undo</code> skips it rather than trying to undo its
				side effects.
			</>
		),
	},
];

const rollbackNote = [
	"Steps are applied in order. If any step fails, Anesis asks whether to keep the partial changes or roll back everything that ran before the failure.",
	"Copy and create steps restore the original file (or delete newly created files) on rollback.",
	"Inject, replace, and append steps restore the file content to its pre-step state on rollback.",
	"A packages step snapshots the package manifest/lockfile before running and restores them if the install command fails or a later step fails.",
	"Delete steps are not rolled back — the file is gone. Place delete steps at the end of your step list if order matters.",
	"Run steps are never rolled back — they're recorded as an irreversible action in the journal, so `anesis undo` skips them and leaves their side effects in place.",
];

const safetyPoints = [
	"Addon source paths (used in `copy` steps) are validated against the addon's cache directory. An addon cannot read files outside its own cached folder.",
	"Project target paths are normalized and checked to ensure they stay inside the project root. A step cannot write to `../../etc/passwd` or any path outside the current directory.",
	"Glob targets are canonicalized after expansion so symlinks cannot be used to escape the project root.",
];

function FieldList({
	items,
}: {
	items: { field?: string; rule?: string; desc: string }[];
}) {
	return (
		<dl className="space-y-3">
			{items.map((item) => (
				<div
					key={item.field ?? item.rule}
					className="flex flex-col gap-1 sm:flex-row sm:gap-4"
				>
					<dt className="sm:w-44 sm:shrink-0">
						<code className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-foreground">
							{item.field ?? item.rule}
						</code>
					</dt>
					<dd className="text-muted-foreground">{item.desc}</dd>
				</div>
			))}
		</dl>
	);
}

export default function DocsAddonsCreatingPage() {
	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-5 py-10 lg:px-8">
			<DocsHero
				eyebrow="Addons / Creating Addons"
				eyebrowIcon={BoxesIcon}
				title="Build your own addon"
				description={
					<>
						An addon is a directory with an{" "}
						<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
							anesis.addon.json
						</code>{" "}
						manifest. The manifest declares who the addon is, what it depends on,
						how to detect which variant of a project it&apos;s working with, and
						what commands it exposes — each with its own inputs and file
						operation steps.
					</>
				}
				chips={[
					"anesis.addon.json",
					"Variant detection",
					"10 step types",
					"Rollback on failure",
				]}
			/>

			<div className="flex flex-col gap-10">
				<DocsSection
					id="manifest"
					title="The manifest at a glance"
					lead="anesis.addon.json must be at the root of your addon directory. All top-level fields are required except requires."
				>
					<CodeBlock code={manifestOverview} lang="json" />
					<DocsSubheading id="top-level-fields">Top-level fields</DocsSubheading>
					<FieldList items={topLevelFields} />
				</DocsSection>

				<DocsSection
					id="inputs"
					title="Inputs — prompting users for information"
					lead="Inputs are declared at two levels: the manifest level (asked once per addon run) and the command level (asked when a specific command runs). Both use the same structure."
				>
					<CodeBlock code={inputsExample} lang="json" />
					<DocsSubheading id="derived-variables">
						Derived variable forms
					</DocsSubheading>
					<p>
						Every input value is automatically available in step templates in
						five casing forms. You don&apos;t need to transform strings manually:
					</p>
					<CodeBlock code={derivedVariables} />
				</DocsSection>

				<DocsSection
					id="detect"
					title="Detection — choosing the right variant"
					lead="The detect array lets your addon behave differently depending on the target project's setup. Anesis evaluates each detect block in order and uses the first one that matches."
				>
					<CodeBlock code={detectExample} lang="json" />
					<DocsSubheading id="detect-rules">Rule types</DocsSubheading>
					<FieldList items={detectRules} />
					<p>
						<code>match: &quot;all&quot;</code> requires every rule in the block to
						pass. <code>match: &quot;any&quot;</code> (the default) requires at
						least one rule to pass. If no detect block matches, Anesis falls back
						to the variant with <code>when: null</code>.
					</p>
				</DocsSection>

				<DocsSection
					id="variants"
					title="Variants — conditional command sets"
					lead="Each variant holds a set of commands. The variant whose when matches the detected id is used. Include a variant with when: null as a fallback for projects that don't match any detect block."
				>
					<CodeBlock code={variantsExample} lang="json" />
					<p>
						You can have as many variants as you need. Each variant can expose a
						different set of commands — or the same command names with different
						step implementations for different project setups.
					</p>
				</DocsSection>

				<DocsSection
					id="commands"
					title="Commands — the user-facing operations"
					lead="Each command in a variant has a name, optional constraints, its own inputs, and a list of steps to execute."
				>
					<CodeBlock code={commandExample} lang="json" />
					<FieldList items={commandFields} />
				</DocsSection>

				<DocsSection
					id="steps"
					title="Ten step types for all file and shell operations"
					lead={
						<>
							Steps are executed in order. Every step that writes to a file
							renders its content and paths through Tera — inputs and their
							derived forms are all available. Targets can be a single{" "}
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
								{'{ "type": "file", "file": "path" }'}
							</code>{" "}
							or a glob{" "}
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
								{'{ "type": "glob", "glob": "src/**/*.ts" }'}
							</code>
							.
						</>
					}
				>
					{stepTypes.map((step) => (
						<div key={step.id} className="space-y-3">
							<DocsSubheading id={step.id}>{step.name}</DocsSubheading>
							<p>{step.summary}</p>
							<CodeBlock code={step.code} lang="json" />
							{step.note ? <p>{step.note}</p> : null}
						</div>
					))}
				</DocsSection>

				<DocsSection
					id="rollback"
					title="Rollback on failure"
					lead="If a step fails mid-run, Anesis gives the user a choice: keep the partial changes as they are, or roll back all completed steps."
				>
					<DocsList items={rollbackNote} />
				</DocsSection>

				<DocsSection
					id="safety"
					title="Safety model"
					lead="The CLI enforces path boundaries so addons cannot read or write outside their designated directories."
				>
					<DocsList items={safetyPoints} />
				</DocsSection>
			</div>

			<DocsPagination currentHref="/docs/addons/creating" />
		</div>
	);
}
