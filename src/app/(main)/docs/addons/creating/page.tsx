import {
	BoxesIcon,
	CopyIcon,
	FileCodeIcon,
	FilePlusIcon,
	GitMergeIcon,
	LayersIcon,
	PenIcon,
	RefreshCwIcon,
	RouteIcon,
	ShieldCheckIcon,
	TextCursorInputIcon,
	Trash2Icon,
} from "lucide-react";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { CodeBlock } from "@/components/docs/CodeBlock";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

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

const rollbackNote = [
	"Steps are applied in order. If any step fails, Anesis asks whether to keep the partial changes or roll back everything that ran before the failure.",
	"Copy and create steps restore the original file (or delete newly created files) on rollback.",
	"Inject, replace, and append steps restore the file content to its pre-step state on rollback.",
	"Delete steps are not rolled back — the file is gone. Place delete steps at the end of your step list if order matters.",
];

const safetyPoints = [
	"Addon source paths (used in `copy` steps) are validated against the addon's cache directory. An addon cannot read files outside its own cached folder.",
	"Project target paths are normalized and checked to ensure they stay inside the project root. A step cannot write to `../../etc/passwd` or any path outside the current directory.",
	"Glob targets are canonicalized after expansion so symlinks cannot be used to escape the project root.",
];

export default function DocsAddonsCreatingPage() {
	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 lg:px-8">
			<section className="relative overflow-hidden rounded-[2rem] border bg-card px-6 py-8 shadow-sm sm:px-8">
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(181,111,43,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(112,73,35,0.12),transparent_30%)]" />
				<div className="relative space-y-5">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<BoxesIcon className="size-4" />
						Addons / Creating Addons
					</div>
					<div className="max-w-4xl space-y-3">
						<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Build your own addon
						</h1>
						<p className="text-sm leading-6 text-muted-foreground sm:text-base">
							An addon is a directory with an{" "}
							<code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">
								anesis.addon.json
							</code>{" "}
							manifest. The manifest declares who the addon is, what it depends on,
							how to detect which variant of a project it's working with, and what
							commands it exposes — each with its own inputs and file operation steps.
						</p>
					</div>
					<div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
						<span className="rounded-full border bg-background/80 px-3 py-1">
							anesis.addon.json
						</span>
						<span className="rounded-full border bg-background/80 px-3 py-1">
							Variant detection
						</span>
						<span className="rounded-full border bg-background/80 px-3 py-1">
							8 step types
						</span>
						<span className="rounded-full border bg-background/80 px-3 py-1">
							Rollback on failure
						</span>
					</div>
				</div>
			</section>

			{/* Top-level manifest fields */}
			<div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
				<Card>
					<CardHeader className="gap-3">
						<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<FileCodeIcon className="size-5" />
						</div>
						<div>
							<CardTitle>The manifest at a glance</CardTitle>
							<CardDescription>
								`anesis.addon.json` must be at the root of your addon directory. All
								top-level fields are required except `requires`.
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent>
						<CodeBlock code={manifestOverview} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Top-level fields</CardTitle>
						<CardDescription>
							These fields describe the addon to the registry and CLI.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						{[
							{ field: "schema_version", desc: 'Always "1" for the current format.' },
							{ field: "id", desc: "The registry identifier — used in CLI commands as the addon-id." },
							{ field: "name", desc: "Human-readable display name shown in the registry UI." },
							{ field: "version", desc: "Semantic version of this addon." },
							{ field: "description", desc: "One-line description of what the addon adds to a project." },
							{ field: "author", desc: "The author's GitHub username or organization." },
							{ field: "requires", desc: "Array of addon IDs that must already be cached locally before this addon runs." },
						].map((item) => (
							<div key={item.field} className="flex gap-3 rounded-lg border bg-muted/10 p-3">
								<code className="mt-0.5 shrink-0 rounded bg-muted px-2 py-0.5 font-mono text-xs text-foreground">
									{item.field}
								</code>
								<p className="text-sm text-muted-foreground">{item.desc}</p>
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			{/* Inputs */}
			<Card>
				<CardHeader className="gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<TextCursorInputIcon className="size-5" />
					</div>
					<div>
						<CardTitle>Inputs — prompting users for information</CardTitle>
						<CardDescription>
							Inputs are declared at two levels: the manifest level (asked once per
							addon run) and the command level (asked when a specific command runs).
							Both use the same structure.
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					<CodeBlock code={inputsExample} />
					<div>
						<p className="mb-3 text-sm font-medium">Derived variable forms</p>
						<p className="mb-3 text-sm text-muted-foreground">
							Every input value is automatically available in step templates in five
							casing forms. You don't need to transform strings manually:
						</p>
						<CodeBlock code={derivedVariables} />
					</div>
				</CardContent>
			</Card>

			{/* Detection */}
			<Card>
				<CardHeader className="gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<RouteIcon className="size-5" />
					</div>
					<div>
						<CardTitle>Detection — choosing the right variant</CardTitle>
						<CardDescription>
							The `detect` array lets your addon behave differently depending on the
							target project's setup. Anesis evaluates each detect block in order and
							uses the first one that matches.
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					<CodeBlock code={detectExample} />
					<div className="grid gap-3 sm:grid-cols-2">
						{[
							{ rule: "file_exists", desc: "Passes when a given file path exists in the project." },
							{ rule: "file_contains", desc: "Passes when a file contains a specific string." },
							{ rule: "json_contains", desc: "Passes when a JSON file has a value at a specific key path (dot-separated)." },
							{ rule: "toml_contains", desc: "Passes when a TOML file has a value at a specific key path." },
							{ rule: "yaml_contains", desc: "Passes when a YAML file has a value at a specific key path." },
						].map((item) => (
							<div key={item.rule} className="rounded-xl border bg-muted/10 p-3 space-y-1">
								<code className="font-mono text-xs text-foreground">{item.rule}</code>
								<p className="text-sm text-muted-foreground">{item.desc}</p>
							</div>
						))}
						<div className="rounded-xl border bg-muted/10 p-3 space-y-1">
							<code className="font-mono text-xs text-foreground">negate: true</code>
							<p className="text-sm text-muted-foreground">Add to any rule to invert its result.</p>
						</div>
					</div>
					<p className="text-sm text-muted-foreground">
						<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">match: "all"</code>{" "}
						requires every rule in the block to pass.{" "}
						<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">match: "any"</code>{" "}
						(the default) requires at least one rule to pass. If no detect block matches,
						Anesis falls back to the variant with{" "}
						<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">when: null</code>.
					</p>
				</CardContent>
			</Card>

			{/* Variants */}
			<Card>
				<CardHeader className="gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<GitMergeIcon className="size-5" />
					</div>
					<div>
						<CardTitle>Variants — conditional command sets</CardTitle>
						<CardDescription>
							Each variant holds a set of commands. The variant whose `when` matches
							the detected id is used. Include a variant with `when: null` as a
							fallback for projects that don't match any detect block.
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<CodeBlock code={variantsExample} />
					<p className="text-sm text-muted-foreground">
						You can have as many variants as you need. Each variant can expose a
						different set of commands — or the same command names with different step
						implementations for different project setups.
					</p>
				</CardContent>
			</Card>

			{/* Commands */}
			<Card>
				<CardHeader className="gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<LayersIcon className="size-5" />
					</div>
					<div>
						<CardTitle>Commands — the user-facing operations</CardTitle>
						<CardDescription>
							Each command in a variant has a name, optional constraints, its own
							inputs, and a list of steps to execute.
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<CodeBlock code={commandExample} />
					<div className="grid gap-3 sm:grid-cols-2">
						{[
							{ field: "once", desc: 'When true, the command will not run if its name already appears in anesis.lock for this addon. Use this for one-time setup commands like "install".' },
							{ field: "requires_commands", desc: "A list of command names that must have already run (appear in anesis.lock) before this command executes. Enforces ordering between commands." },
						].map((item) => (
							<div key={item.field} className="rounded-xl border bg-muted/10 p-3 space-y-1">
								<code className="font-mono text-xs text-foreground">{item.field}</code>
								<p className="text-sm text-muted-foreground">{item.desc}</p>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Steps */}
			<section className="space-y-4">
				<div className="space-y-2">
					<p className="text-sm font-medium text-primary">Step types</p>
					<h2 className="text-2xl font-bold tracking-tight">
						Eight step types for all file operations
					</h2>
					<p className="text-sm text-muted-foreground">
						Steps are executed in order. Every step that writes to a file renders its
						content and paths through Tera — inputs and their derived forms are all
						available. Targets can be a single{" "}
						<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
							{"{ \"type\": \"file\", \"file\": \"path\" }"}
						</code>{" "}
						or a glob:{" "}
						<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
							{"{ \"type\": \"glob\", \"glob\": \"src/**/*.ts\" }"}
						</code>
						.
					</p>
				</div>

				<div className="grid gap-6 lg:grid-cols-2">
					<Card>
						<CardHeader className="gap-3">
							<div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<CopyIcon className="size-4" />
							</div>
							<div>
								<CardTitle className="text-base">copy</CardTitle>
								<CardDescription>
									Copy a file from your addon's directory into the project.
								</CardDescription>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							<CodeBlock code={stepCopy} />
							<p className="text-sm text-muted-foreground">
								<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">if_exists</code>{" "}
								controls behavior when the destination file already exists:{" "}
								<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">overwrite</code>{" "}
								(default),{" "}
								<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ask</code>, or{" "}
								<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">skip</code>.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="gap-3">
							<div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<FilePlusIcon className="size-4" />
							</div>
							<div>
								<CardTitle className="text-base">create</CardTitle>
								<CardDescription>
									Create a new file with rendered content at a given path.
								</CardDescription>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							<CodeBlock code={stepCreate} />
							<p className="text-sm text-muted-foreground">
								Both <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">path</code>{" "}
								and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">content</code>{" "}
								are rendered through Tera. Use input variables in the path to generate
								files with dynamic names.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="gap-3">
							<div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<PenIcon className="size-4" />
							</div>
							<div>
								<CardTitle className="text-base">inject</CardTitle>
								<CardDescription>
									Insert content into an existing file at a named marker.
								</CardDescription>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							<CodeBlock code={stepInject} />
							<p className="text-sm text-muted-foreground">
								Use{" "}
								<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">after</code>{" "}
								or{" "}
								<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">before</code>{" "}
								to name a marker string. If neither is specified, content is prepended
								to the file. The{" "}
								<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">if_not_found</code>{" "}
								field controls what happens if the marker is absent:{" "}
								<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">warn_and_ask</code>{" "}
								(default),{" "}
								<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">skip</code>, or{" "}
								<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">error</code>.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="gap-3">
							<div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<RefreshCwIcon className="size-4" />
							</div>
							<div>
								<CardTitle className="text-base">replace</CardTitle>
								<CardDescription>
									Find a string in file(s) and replace it with new content.
								</CardDescription>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							<CodeBlock code={stepReplace} />
							<p className="text-sm text-muted-foreground">
								Both{" "}
								<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">find</code>{" "}
								and{" "}
								<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">replace</code>{" "}
								are rendered through Tera. Use glob targets to apply the same
								replacement across many files. Use{" "}
								<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">// anesis:</code>{" "}
								comment markers in your template source to create predictable
								insertion points.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="gap-3">
							<div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<LayersIcon className="size-4" />
							</div>
							<div>
								<CardTitle className="text-base">append</CardTitle>
								<CardDescription>
									Append rendered content to the end of one or more files.
								</CardDescription>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							<CodeBlock code={stepAppend} />
							<p className="text-sm text-muted-foreground">
								Anesis ensures the file ends with a newline before appending, so you
								don't get content accidentally concatenated onto the last existing
								line.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="gap-3">
							<div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<Trash2Icon className="size-4" />
							</div>
							<div>
								<CardTitle className="text-base">delete</CardTitle>
								<CardDescription>
									Remove files from the project. Supports both single files and glob
									patterns.
								</CardDescription>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							<CodeBlock code={stepDelete} />
							<p className="text-sm text-muted-foreground">
								Delete is not rolled back on failure. If you need to delete files as
								part of a reversible operation, place delete steps at the end of your
								step list after all create/inject steps succeed.
							</p>
						</CardContent>
					</Card>

					<Card className="lg:col-span-2">
						<CardHeader className="gap-3">
							<div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<FileCodeIcon className="size-4" />
							</div>
							<div>
								<CardTitle className="text-base">rename and move</CardTitle>
								<CardDescription>
									Rename a file or move it to a new location. Both the source and
									destination paths are rendered through Tera.
								</CardDescription>
							</div>
						</CardHeader>
						<CardContent>
							<CodeBlock code={stepRename} />
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Rollback */}
			<Card>
				<CardHeader className="gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<RefreshCwIcon className="size-5" />
					</div>
					<div>
						<CardTitle>Rollback on failure</CardTitle>
						<CardDescription>
							If a step fails mid-run, Anesis gives the user a choice: keep the
							partial changes as they are, or roll back all completed steps.
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent>
					<ul className="space-y-3 text-sm text-muted-foreground">
						{rollbackNote.map((item) => (
							<li key={item} className="flex gap-2">
								<span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
								<span>{item}</span>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>

			{/* Safety */}
			<Card>
				<CardHeader className="gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<ShieldCheckIcon className="size-5" />
					</div>
					<div>
						<CardTitle>Safety model</CardTitle>
						<CardDescription>
							The CLI enforces path boundaries so addons cannot read or write outside
							their designated directories.
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent>
					<ul className="space-y-3 text-sm text-muted-foreground">
						{safetyPoints.map((item) => (
							<li key={item} className="flex gap-2">
								<span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
								<span>{item}</span>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>

			<DocsPagination currentHref="/docs/addons/creating" />
		</div>
	);
}
