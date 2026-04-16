import Link from "next/link";
import {
	ArrowRightIcon,
	BoxesIcon,
	DownloadIcon,
	FileTextIcon,
	ListIcon,
	PencilRulerIcon,
	PlayIcon,
	RefreshCwIcon,
	Trash2Icon,
} from "lucide-react";
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

const installExample = `# Install an addon by its registry ID
oxide addon install nest-drizzle

# Oxide downloads the addon and caches it at:
# ~/.oxide/cache/addons/nest-drizzle/`;

const runCommandExample = `# Run an addon command from your project root
oxide use nest-drizzle install

# The general form is:
oxide use <addon-id> <command>`;

const autoInstallNote = `# If the addon isn't cached yet, Oxide installs it automatically:
oxide use nest-drizzle install
# → addon not found locally, installing...
# → prompting for inputs...
# → applying steps...`;

const typicalFlow = `# 1. Log in (required for registry access)
oxide login

# 2. Install an addon (optional — running a command auto-installs)
oxide addon install nest-drizzle

# 3. Create a new project
oxide new my-project nestjs
cd my-project

# 4. Run addon commands from inside the project
oxide use nest-drizzle install
oxide use nest-drizzle generate`;

const listRemoveExample = `# See which addons are cached locally
oxide addon list

# Remove an addon from the local cache
oxide addon remove nest-drizzle`;

const updateExample = `# Re-fetch an addon from its source URL
oxide addon update https://github.com/owner/repo`;

const lockFacts = [
	"`oxide.lock` is created in the project root the first time an addon command runs successfully.",
	"It records the addon id, version, chosen variant, and the names of all commands executed.",
	'Commands marked with `"once": true` in the manifest will not run again if their name already appears in `oxide.lock`.',
	"The lock file is project-specific — one per project directory. It is safe to commit to version control.",
];

const inputTypes = [
	{
		type: "text",
		description:
			"Free-form string input with an optional default value. Used for names, paths, and identifiers.",
	},
	{
		type: "boolean",
		description:
			"Yes/no prompt with an optional default. Used for enabling optional features.",
	},
	{
		type: "select",
		description:
			"Multiple-choice prompt with a list of options. Used when there are a fixed set of valid choices (e.g. a database driver).",
	},
];

export default function DocsAddonsPage() {
	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 lg:px-8">
			<section className="relative overflow-hidden rounded-[2rem] border bg-card px-6 py-8 shadow-sm sm:px-8">
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(181,111,43,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(112,73,35,0.12),transparent_30%)]" />
				<div className="relative space-y-5">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<BoxesIcon className="size-4" />
						Addons
					</div>
					<div className="max-w-4xl space-y-3">
						<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Extend existing projects with addons
						</h1>
						<p className="text-sm leading-6 text-muted-foreground sm:text-base">
							An addon is a declarative package that modifies an existing project.
							You run it from inside your project directory, and Oxide reads the
							addon's manifest, detects your project setup, asks for any needed
							inputs, and applies file operations — creating, injecting, replacing, or
							appending content. The result is recorded in{" "}
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
								oxide.lock
							</code>
							.
						</p>
					</div>
					<div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
						<span className="rounded-full border bg-background/80 px-3 py-1">
							oxide use &lt;addon-id&gt; &lt;command&gt;
						</span>
						<span className="rounded-full border bg-background/80 px-3 py-1">
							Variant detection
						</span>
						<span className="rounded-full border bg-background/80 px-3 py-1">
							oxide.lock tracking
						</span>
					</div>
					<div className="flex flex-wrap gap-3">
						<Button asChild>
							<Link href="/addons">
								Browse addons
								<ArrowRightIcon className="size-4" />
							</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/docs/addons/creating">
								<PencilRulerIcon className="size-4" />
								Create an addon
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Install */}
			<div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
				<Card>
					<CardHeader className="gap-3">
						<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<DownloadIcon className="size-5" />
						</div>
						<div>
							<CardTitle>Installing an addon</CardTitle>
							<CardDescription>
								<code>oxide addon install</code> pre-downloads the addon and saves it
								to the local cache. You can skip this step — running an addon command
								will auto-install if the addon isn't cached yet.
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<CodeBlock code={installExample} />
						<p className="text-sm text-muted-foreground">
							Explicit installation is useful in CI environments or when you want to
							ensure an addon is available before moving into a project directory.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Finding addons</CardTitle>
						<CardDescription>
							Browse the addon registry to see what's available.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3 text-sm text-muted-foreground">
						<p>
							The addon ID is what you pass to{" "}
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
								oxide addon install
							</code>{" "}
							and then to{" "}
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
								oxide use &lt;addon-id&gt; &lt;command&gt;
							</code>
							.
						</p>
						<p>
							Each addon also lists the commands it exposes and which project types
							it supports.
						</p>
						<Button variant="outline" asChild>
							<Link href="/addons">
								Open addon registry
								<ArrowRightIcon className="size-4" />
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* Running commands */}
			<Card>
				<CardHeader className="gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<PlayIcon className="size-5" />
					</div>
					<div>
						<CardTitle>Running addon commands</CardTitle>
						<CardDescription>
							This is the primary way to use an addon. Run it from your project root —
							Oxide handles detection, inputs, and file operations automatically.
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid gap-6 lg:grid-cols-2">
						<div className="space-y-2">
							<p className="text-sm font-medium">The command form</p>
							<CodeBlock code={runCommandExample} />
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium">Auto-install on first run</p>
							<CodeBlock code={autoInstallNote} />
						</div>
					</div>
					<div className="space-y-3 text-sm text-muted-foreground">
						<p>
							When you run{" "}
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
								oxide use &lt;addon-id&gt; &lt;command&gt;
							</code>
							, Oxide:
						</p>
						<ol className="space-y-1.5 list-none">
							{[
								"Loads the addon manifest (auto-installs if missing).",
								"Detects your project variant by checking for files, packages, or config values defined in the manifest.",
								"Prompts for any manifest-level inputs (asked once per run).",
								"Prompts for any command-level inputs (specific to the command you ran).",
								"Applies each step in order — creating files, injecting code, replacing strings, etc.",
								"Records the result in oxide.lock.",
							].map((text, i) => (
								<li key={i} className="flex gap-2">
									<span className="mt-0.5 text-primary font-medium">{i + 1}.</span>
									<span>{text}</span>
								</li>
							))}
						</ol>
					</div>
				</CardContent>
			</Card>

			{/* Typical flow */}
			<Card>
				<CardHeader>
					<CardTitle>Typical workflow</CardTitle>
					<CardDescription>
						Addons are designed to run after your project is scaffolded. Install the
						template first, then apply addons.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<CodeBlock code={typicalFlow} />
				</CardContent>
			</Card>

			{/* List + Remove */}
			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader className="gap-3">
						<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<ListIcon className="size-5" />
						</div>
						<div>
							<CardTitle>Listing and removing addons</CardTitle>
							<CardDescription>
								Both commands operate on local cache files only — no network call
								required.
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent>
						<CodeBlock code={listRemoveExample} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="gap-3">
						<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<RefreshCwIcon className="size-5" />
						</div>
						<div>
							<CardTitle>Updating an addon</CardTitle>
							<CardDescription>
								Re-fetch the addon from its source URL when the addon author has
								pushed new changes.
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<CodeBlock code={updateExample} />
						<p className="text-sm text-muted-foreground">
							Updating the cache does not affect any{" "}
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
								oxide.lock
							</code>{" "}
							files in your projects. Those track what was applied, not the current
							addon version.
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Input prompts */}
			<Card>
				<CardHeader>
					<CardTitle>Input prompts</CardTitle>
					<CardDescription>
						Addons ask questions before applying changes. Answers are used throughout
						the file operations as template variables.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					{inputTypes.map((item) => (
						<div key={item.type} className="flex gap-3 rounded-xl border bg-muted/10 p-3">
							<code className="mt-0.5 shrink-0 rounded bg-muted px-2 py-0.5 font-mono text-xs text-foreground">
								{item.type}
							</code>
							<p className="text-sm text-muted-foreground">{item.description}</p>
						</div>
					))}
					<p className="text-sm text-muted-foreground pt-1">
						Every input value is available in steps in multiple casing forms:{" "}
						<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
							_pascal
						</code>
						,{" "}
						<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
							_camel
						</code>
						,{" "}
						<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
							_kebab
						</code>
						, and{" "}
						<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
							_snake
						</code>
						.
					</p>
				</CardContent>
			</Card>

			{/* Lock file */}
			<Card>
				<CardHeader className="gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<FileTextIcon className="size-5" />
					</div>
					<div>
						<CardTitle>The oxide.lock file</CardTitle>
						<CardDescription>
							A file in your project root that tracks which addons have been applied
							and which commands have run.
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent>
					<ul className="space-y-3 text-sm text-muted-foreground">
						{lockFacts.map((item) => (
							<li key={item} className="flex gap-2">
								<span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
								<span>{item}</span>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>

			{/* Sub-page links */}
			<div className="grid gap-4 sm:grid-cols-2">
				<Card className="border-dashed">
					<CardHeader>
						<CardTitle className="text-base">Creating your own addon</CardTitle>
						<CardDescription>
							Learn how to write an `oxide.addon.json` manifest with detection rules,
							variants, input prompts, and declarative file operation steps.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button variant="outline" asChild>
							<Link href="/docs/addons/creating">
								Creating Addons
								<ArrowRightIcon className="size-4" />
							</Link>
						</Button>
					</CardContent>
				</Card>

				<Card className="border-dashed">
					<CardHeader>
						<CardTitle className="text-base">Publishing to the registry</CardTitle>
						<CardDescription>
							Learn how to publish and update an addon in the Oxide registry using a
							GitHub URL.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button variant="outline" asChild>
							<Link href="/docs/addons/publishing">
								Publishing Addons
								<ArrowRightIcon className="size-4" />
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>

			<DocsPagination currentHref="/docs/addons" />
		</div>
	);
}
