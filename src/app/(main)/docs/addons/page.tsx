import Link from "next/link";
import { ArrowRightIcon, BoxesIcon, PencilRulerIcon } from "lucide-react";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { DocsHero } from "@/components/docs/DocsHero";
import { CodeBlock } from "@/components/docs/CodeBlock";
import {
	DocsSection,
	DocsSubheading,
	DocsList,
	Markup,
} from "@/components/docs/prose";
import { Button } from "@/components/ui/button";

const installExample = `# Install an addon by its registry ID
anesis addon install nest-drizzle

# Anesis downloads the addon and caches it at:
# ~/.anesis/cache/addons/nest-drizzle/`;

const runCommandExample = `# Run an addon command from your project root
anesis use nest-drizzle install

# The general form is:
anesis use <addon-id> <command>`;

const autoInstallNote = `# If the addon isn't cached yet, Anesis installs it automatically:
anesis use nest-drizzle install
# → addon not found locally, installing...
# → prompting for inputs...
# → applying steps...`;

const typicalFlow = `# 1. Log in (required for registry access)
anesis login

# 2. Install an addon (optional — running a command auto-installs)
anesis addon install nest-drizzle

# 3. Create a new project
anesis new my-project nestjs
cd my-project

# 4. Run addon commands from inside the project
anesis use nest-drizzle install
anesis use nest-drizzle generate`;

const listRemoveExample = `# See which addons are cached locally
anesis addon list

# Remove an addon from the local cache
anesis addon remove nest-drizzle`;

const updateExample = `# Re-fetch an addon from its source URL
anesis addon update https://github.com/owner/repo`;

const runSteps = [
	"Loads the addon manifest (auto-installs if missing).",
	"Detects your project variant by checking for files, packages, or config values defined in the manifest.",
	"Prompts for any manifest-level inputs (asked once per run).",
	"Prompts for any command-level inputs (specific to the command you ran).",
	"Applies each step in order — creating files, injecting code, replacing strings, etc.",
	"Records the result in `anesis.lock`.",
];

const lockFacts = [
	"`anesis.lock` is created in the project root the first time an addon command runs successfully.",
	"It records the addon id, version, chosen variant, and the names of all commands executed.",
	'Commands marked with `"once": true` in the manifest will not run again if their name already appears in `anesis.lock`.',
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
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-5 py-10 lg:px-8">
			<DocsHero
				eyebrow="Addons"
				eyebrowIcon={BoxesIcon}
				title="Extend existing projects with addons"
				description={
					<>
						An addon is a declarative package that modifies an existing project.
						You run it from inside your project directory, and Anesis reads the
						addon&apos;s manifest, detects your project setup, asks for any
						needed inputs, and applies file operations — creating, injecting,
						replacing, or appending content. The result is recorded in{" "}
						<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
							anesis.lock
						</code>
						.
					</>
				}
				chips={[
					"anesis use <addon-id> <command>",
					"Variant detection",
					"anesis.lock tracking",
				]}
				actions={
					<>
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
					</>
				}
			/>

			<div className="flex flex-col gap-10">
				<DocsSection
					id="install"
					title="Installing an addon"
					lead="anesis addon install pre-downloads the addon and saves it to the local cache. You can skip this step — running an addon command auto-installs it if it isn't cached yet."
				>
					<CodeBlock code={installExample} />
					<p>
						Explicit installation is useful in CI environments or when you want
						to ensure an addon is available before moving into a project
						directory.
					</p>
				</DocsSection>

				<DocsSection
					id="finding"
					title="Finding addons"
					lead="Browse the addon registry to see what's available."
				>
					<p>
						The addon ID is what you pass to <code>anesis addon install</code> and
						then to <code>anesis use &lt;addon-id&gt; &lt;command&gt;</code>. Each
						addon also lists the commands it exposes and which project types it
						supports.
					</p>
					<p>
						<Link
							href="/addons"
							className="font-medium text-primary hover:underline"
						>
							Open the addon registry →
						</Link>
					</p>
				</DocsSection>

				<DocsSection
					id="run"
					title="Running addon commands"
					lead="This is the primary way to use an addon. Run it from your project root — Anesis handles detection, inputs, and file operations automatically."
				>
					<DocsSubheading id="command-form">The command form</DocsSubheading>
					<CodeBlock code={runCommandExample} />

					<DocsSubheading id="auto-install">
						Auto-install on first run
					</DocsSubheading>
					<CodeBlock code={autoInstallNote} />

					<p>
						When you run <code>anesis use &lt;addon-id&gt; &lt;command&gt;</code>,
						Anesis works through these steps:
					</p>
					<DocsList items={runSteps} ordered />
				</DocsSection>

				<DocsSection
					id="workflow"
					title="Typical workflow"
					lead="Addons are designed to run after your project is scaffolded. Install the template first, then apply addons."
				>
					<CodeBlock code={typicalFlow} />
				</DocsSection>

				<DocsSection
					id="list-remove"
					title="Listing and removing addons"
					lead="Both commands operate on local cache files only — no network call required."
				>
					<CodeBlock code={listRemoveExample} />
				</DocsSection>

				<DocsSection
					id="update"
					title="Updating an addon"
					lead="Re-fetch the addon from its source URL when the addon author has pushed new changes."
				>
					<CodeBlock code={updateExample} />
					<p>
						Updating the cache does not affect any <code>anesis.lock</code> files
						in your projects. Those track what was applied, not the current addon
						version.
					</p>
				</DocsSection>

				<DocsSection
					id="inputs"
					title="Input prompts"
					lead="Addons ask questions before applying changes. Answers are used throughout the file operations as template variables."
				>
					<dl className="space-y-3">
						{inputTypes.map((item) => (
							<div
								key={item.type}
								className="flex flex-col gap-1 sm:flex-row sm:gap-4"
							>
								<dt className="sm:w-24 sm:shrink-0">
									<code className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-foreground">
										{item.type}
									</code>
								</dt>
								<dd className="text-muted-foreground">{item.description}</dd>
							</div>
						))}
					</dl>
					<p>
						Every input value is available in steps in multiple casing forms:{" "}
						<code>_pascal</code>, <code>_camel</code>, <code>_kebab</code>, and{" "}
						<code>_snake</code>.
					</p>
				</DocsSection>

				<DocsSection
					id="lock"
					title="The anesis.lock file"
					lead="A file in your project root that tracks which addons have been applied and which commands have run."
				>
					<DocsList items={lockFacts} />
				</DocsSection>

				<DocsSection
					id="next-steps"
					title="Next steps"
					lead="Ready to build and share your own?"
				>
					<ul className="space-y-2 pl-5 list-disc marker:text-muted-foreground/60">
						<li className="pl-1">
							<Link
								href="/docs/addons/creating"
								className="font-medium text-primary hover:underline"
							>
								Creating Addons
							</Link>{" "}
							— write an <code>anesis.addon.json</code> manifest with detection
							rules, variants, input prompts, and declarative file-operation
							steps.
						</li>
						<li className="pl-1">
							<Link
								href="/docs/addons/publishing"
								className="font-medium text-primary hover:underline"
							>
								Publishing Addons
							</Link>{" "}
							— <Markup>publish and update an addon in the Anesis registry using a GitHub URL.</Markup>
						</li>
					</ul>
				</DocsSection>
			</div>

			<DocsPagination currentHref="/docs/addons" />
		</div>
	);
}
