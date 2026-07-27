import type { Metadata } from "next";
import Link from "next/link";
import {
	ArrowRightIcon,
	FolderOpenIcon,
	LayoutTemplateIcon,
} from "lucide-react";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { DocsHero } from "@/components/docs/DocsHero";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsSection, DocsList } from "@/components/docs/prose";
import { Button } from "@/components/ui/button";

const installExample = `# Install a template by name from the registry
anesis template install react-vite-ts

# Anesis downloads the template and caches it at:
# ~/.anesis/cache/templates/react-vite-ts/`;

const newExample = `# Create a new project from a template
anesis new my-app react-vite-ts

# Use "." to scaffold into the current directory
anesis new . react-vite-ts

# Omit the template to pick one interactively
anesis new my-app

# Only offer templates you've already downloaded
anesis new my-app --installed

# Non-interactive: accept defaults and pass input values up front
anesis new my-app react-vite-ts --yes --input use_ssl=true --input driver=postgres

# Scaffold a template + a pinned set of addons from a stack
anesis new my-app --stack nest-saas`;

const newSteps = [
	{
		title: "Validate the project name",
		body: 'The name must not already exist on disk. A single dot (".") is allowed to scaffold into the current directory. Names can use letters, numbers, hyphens, underscores, and dots, but cannot start with a dot or end with a dot or space.',
	},
	{
		title: "Ensure the template is available",
		body: "If the template isn't already in the local cache, Anesis fetches it from the registry automatically. This step requires a valid login. Pass --installed to only pick from templates already downloaded.",
	},
	{
		title: "Collect inputs",
		body: "If the template manifest declares an inputs array, Anesis prompts for each one (or reads it from --input NAME=VALUE / accepts the default with --yes) before generating any files.",
	},
	{
		title: "Render and copy files",
		body: "Files ending in .tera are rendered through Tera with the project name and every input (plus its pascal/camel/kebab/snake forms) in scope. Any paths matched by the manifest's exclude blocks are skipped. All other files are copied exactly as-is.",
	},
	{
		title: "Print next steps",
		body: 'Once the project is written, Anesis prints "cd <project-name>" so you know where to go. If any output file already existed on disk, it warns which paths were overwritten.',
	},
];

const listExample = `# See every template currently cached on this machine
anesis template list`;

const removeExample = `# Remove a template from the local cache
anesis template remove react-vite-ts

# The template can be re-installed at any time`;

const updateExample = `# Re-fetch a template and update the registry entry
anesis template republish https://github.com/owner/repo/tree/main/templates/react-vite-ts`;

const cacheFacts = [
	"Templates are stored at `~/.anesis/cache/templates/<name>/` after the first install.",
	"A cache index at `~/.anesis/cache/templates/anesis-templates.json` tracks name, version, source, and commit SHA.",
	"On install, Anesis compares the cached commit SHA against the latest value from the backend. If they match and the directory exists, the download is skipped.",
	"`anesis template remove` deletes the cached directory and removes the entry from the index.",
];

const linkExample = `# Validate a local directory as a template and cache it for testing
anesis template link ./my-template

# Overwrite an already-cached template of the same name without asking
anesis template link ./my-template --force

# Now scaffold from it like any other cached template
anesis new test-project my-template`;

export const metadata: Metadata = {
	title: "Using templates",
	description:
		"Scaffold a new project from an Anesis template, pin a version, and understand what the CLI generates.",
	alternates: { canonical: "/docs/templates" },
};

export default function DocsTemplatesPage() {
	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-5 py-10 lg:px-8">
			<DocsHero
				eyebrow="Templates"
				eyebrowIcon={LayoutTemplateIcon}
				title="Scaffold new projects from templates"
				description={
					<>
						A template is a project starter — a folder of files with an{" "}
						<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
							anesis.template.json
						</code>{" "}
						manifest. Install one, run{" "}
						<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
							anesis new
						</code>
						, and Anesis writes a fully-rendered project to disk with your
						project name substituted throughout.
					</>
				}
				chips={[
					"Local cache under ~/.anesis",
					".tera file rendering + inputs",
					"Commit-aware cache reuse",
					"Non-interactive: --yes, --input, --installed",
				]}
				actions={
					<>
						<Button asChild>
							<Link href="/templates">
								Browse templates
								<ArrowRightIcon className="size-4" />
							</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/docs/templates/creating">
								<FolderOpenIcon className="size-4" />
								Create a template
							</Link>
						</Button>
					</>
				}
			/>

			<div className="flex flex-col gap-10">
				<DocsSection
					id="install"
					title="Installing a template"
					lead="anesis template install downloads the template and saves it to your local cache. You only need to install once — subsequent uses are served from cache unless there's a newer version."
				>
					<CodeBlock code={installExample} />
					<p>
						Installing requires a valid login session from{" "}
						<code>anesis login</code>, because the CLI looks up the template in
						the backend registry.
					</p>
				</DocsSection>

				<DocsSection
					id="finding"
					title="Finding templates"
					lead="Browse the template registry to discover what's available before installing."
				>
					<p>
						Every template in the registry has a name, description, and version.
						The template name is what you pass to{" "}
						<code>anesis template install</code> and <code>anesis new</code>.
					</p>
					<p>
						Template names can only contain letters, numbers, hyphens, and
						underscores. Spaces and special characters are rejected by the CLI
						before it even contacts the backend.
					</p>
					<p>
						<Link
							href="/templates"
							className="font-medium text-primary hover:underline"
						>
							Open the template registry →
						</Link>
					</p>
				</DocsSection>

				<DocsSection
					id="new"
					title="Creating a new project with anesis new"
					lead="This is the primary command for using templates. It combines template auto-install (if needed) with project generation in a single step."
				>
					<CodeBlock code={newExample} />
					<p>When you run it, Anesis works through four steps:</p>
					<ol className="space-y-3 pl-5 list-decimal marker:text-muted-foreground/60">
						{newSteps.map((item) => (
							<li key={item.title} className="pl-1">
								<span className="font-medium text-foreground">{item.title}.</span>{" "}
								{item.body}
							</li>
						))}
					</ol>
				</DocsSection>

				<DocsSection
					id="list"
					title="Listing installed templates"
					lead="See which templates are already cached on this machine. This command reads only local files — no network call, no login required."
				>
					<CodeBlock code={listExample} />
				</DocsSection>

				<DocsSection
					id="remove"
					title="Removing a template"
					lead="Remove a template from the local cache. The template can be re-installed later; the registry entry is not affected. No login required."
				>
					<CodeBlock code={removeExample} />
				</DocsSection>

				<DocsSection
					id="update"
					title="Updating a template"
					lead="Re-fetch a template from its source URL and update its registry entry. Use this when the template author has pushed new changes."
				>
					<CodeBlock code={updateExample} />
					<p>
						The update command requires a GitHub URL pointing to the template
						directory — the same URL used when the template was originally
						published. A valid login is required.
					</p>
				</DocsSection>

				<DocsSection
					id="cache"
					title="How the cache works"
					lead="Anesis caches templates locally and avoids unnecessary re-downloads using commit SHAs."
				>
					<DocsList items={cacheFacts} />
				</DocsSection>

				<DocsSection
					id="link"
					title="Testing a template locally with anesis template link"
					lead="Validate a directory as a template and cache it under its manifest name, without publishing anything — the fastest local test loop."
				>
					<CodeBlock code={linkExample} />
				</DocsSection>

				<DocsSection
					id="stacks"
					title="Templates inside a stack"
					lead="A stack pins a template together with an ordered set of addons, so you can scaffold both in one command."
				>
					<p>
						<code>anesis new my-app --stack &lt;id&gt;</code> scaffolds the
						stack&apos;s template exactly as described above, then applies each
						addon in the stack in order. See{" "}
						<Link
							href="/docs/stacks"
							className="font-medium text-primary hover:underline"
						>
							Using Stacks →
						</Link>
					</p>
				</DocsSection>

				<DocsSection
					id="next-steps"
					title="Next steps"
					lead="Ready to build and share your own?"
				>
					<ul className="space-y-2 pl-5 list-disc marker:text-muted-foreground/60">
						<li className="pl-1">
							<Link
								href="/docs/templates/creating"
								className="font-medium text-primary hover:underline"
							>
								Creating Templates
							</Link>{" "}
							— author an <code>anesis.template.json</code> manifest, declare
							inputs, and use Tera variables for rendering.
						</li>
						<li className="pl-1">
							<Link
								href="/docs/templates/publishing"
								className="font-medium text-primary hover:underline"
							>
								Publishing Templates
							</Link>{" "}
							— publish and update a template in the Anesis registry using a
							GitHub URL.
						</li>
					</ul>
				</DocsSection>
			</div>

			<DocsPagination currentHref="/docs/templates" />
		</div>
	);
}
