import Link from "next/link";
import {
	ArrowRightIcon,
	DownloadIcon,
	FolderOpenIcon,
	LayoutTemplateIcon,
	ListIcon,
	PackageCheckIcon,
	RefreshCwIcon,
	Trash2Icon,
	WandSparklesIcon,
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

const installExample = `# Install a template by name from the registry
oxide template install react-vite-ts

# Oxide downloads the template and caches it at:
# ~/.oxide/cache/templates/react-vite-ts/`;

const newExample = `# Create a new project from a template
oxide new my-app react-vite-ts

# Use "." to scaffold into the current directory
oxide new . react-vite-ts`;

const newSteps = [
	{
		step: "1",
		title: "Validate the project name",
		body: 'The name must not already exist on disk. A single dot (".") is allowed to scaffold into the current directory. Names can use letters, numbers, hyphens, underscores, and dots, but cannot start with a dot or end with a dot or space.',
	},
	{
		step: "2",
		title: "Ensure the template is available",
		body: "If the template isn't already in the local cache, Oxide fetches it from the registry automatically. This step requires a valid login.",
	},
	{
		step: "3",
		title: "Render and copy files",
		body: "Files ending in .tera are rendered with your project name substituted in. All other files are copied exactly as-is.",
	},
	{
		step: "4",
		title: "Print next steps",
		body: 'Once the project is written, Oxide prints "cd <project-name>" so you know where to go.',
	},
];

const listExample = `# See every template currently cached on this machine
oxide template list`;

const removeExample = `# Remove a template from the local cache
oxide template remove react-vite-ts

# The template can be re-installed at any time`;

const updateExample = `# Re-fetch a template and update the registry entry
oxide template update https://github.com/owner/repo/tree/main/templates/react-vite-ts`;

const cacheFacts = [
	"Templates are stored at `~/.oxide/cache/templates/<name>/` after the first install.",
	"A cache index at `~/.oxide/cache/templates/oxide-templates.json` tracks name, version, source, and commit SHA.",
	"On install, Oxide compares the cached commit SHA against the latest value from the backend. If they match and the directory exists, the download is skipped.",
	"`oxide template remove` deletes the cached directory and removes the entry from the index.",
];

export default function DocsTemplatesPage() {
	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 lg:px-8">
			<section className="relative overflow-hidden rounded-[2rem] border bg-card px-6 py-8 shadow-sm sm:px-8">
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(181,111,43,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(112,73,35,0.12),transparent_30%)]" />
				<div className="relative space-y-5">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<LayoutTemplateIcon className="size-4" />
						Templates
					</div>
					<div className="max-w-4xl space-y-3">
						<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Scaffold new projects from templates
						</h1>
						<p className="text-sm leading-6 text-muted-foreground sm:text-base">
							A template is a project starter — a folder of files with an{" "}
							<code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">
								oxide.template.json
							</code>
							manifest. Install one, run{" "}
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
								oxide new
							</code>
							, and Oxide writes a fully-rendered project to disk with your project
							name substituted throughout.
						</p>
					</div>
					<div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
						<span className="rounded-full border bg-background/80 px-3 py-1">
							Local cache under ~/.oxide
						</span>
						<span className="rounded-full border bg-background/80 px-3 py-1">
							.tera file rendering
						</span>
						<span className="rounded-full border bg-background/80 px-3 py-1">
							Commit-aware cache reuse
						</span>
					</div>
					<div className="flex flex-wrap gap-3">
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
							<CardTitle>Installing a template</CardTitle>
							<CardDescription>
								<code>oxide template install</code> downloads the template and saves
								it to your local cache. You only need to install once — subsequent
								uses of that template are served from cache unless there's a newer
								version.
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<CodeBlock code={installExample} />
						<p className="text-sm text-muted-foreground">
							Installing requires a valid login session from{" "}
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
								oxide login
							</code>{" "}
							because the CLI looks up the template in the backend registry.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Finding templates</CardTitle>
						<CardDescription>
							Browse the template registry to discover what's available before
							installing.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4 text-sm text-muted-foreground">
						<p>
							Every template in the registry has a name, description, and version.
							The template name is what you pass to{" "}
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
								oxide template install
							</code>{" "}
							and{" "}
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
								oxide new
							</code>
							.
						</p>
						<p>
							Template names can only contain letters, numbers, hyphens, and
							underscores. Spaces and special characters are rejected by the CLI
							before it even contacts the backend.
						</p>
						<Button variant="outline" asChild>
							<Link href="/templates">
								Open template registry
								<ArrowRightIcon className="size-4" />
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* oxide new */}
			<Card>
				<CardHeader className="gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<WandSparklesIcon className="size-5" />
					</div>
					<div>
						<CardTitle>Creating a new project with `oxide new`</CardTitle>
						<CardDescription>
							This is the primary command for using templates. It combines template
							auto-install (if needed) with project generation in a single step.
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					<CodeBlock code={newExample} />
					<div className="grid gap-4 sm:grid-cols-2">
						{newSteps.map((item) => (
							<div key={item.step} className="flex gap-3 rounded-2xl border bg-muted/20 p-4">
								<span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
									{item.step}
								</span>
								<div className="space-y-1">
									<p className="text-sm font-medium">{item.title}</p>
									<p className="text-sm text-muted-foreground">{item.body}</p>
								</div>
							</div>
						))}
					</div>
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
							<CardTitle>Listing installed templates</CardTitle>
							<CardDescription>
								See which templates are already cached on this machine. This command
								reads only local files — no network call, no login required.
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent>
						<CodeBlock code={listExample} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="gap-3">
						<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<Trash2Icon className="size-5" />
						</div>
						<div>
							<CardTitle>Removing a template</CardTitle>
							<CardDescription>
								Remove a template from the local cache. The template can be
								re-installed later; the registry entry is not affected. No login
								required.
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent>
						<CodeBlock code={removeExample} />
					</CardContent>
				</Card>
			</div>

			{/* Update */}
			<Card>
				<CardHeader className="gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<RefreshCwIcon className="size-5" />
					</div>
					<div>
						<CardTitle>Updating a template</CardTitle>
						<CardDescription>
							Re-fetch a template from its source URL and update its registry entry.
							Use this when the template author has pushed new changes.
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<CodeBlock code={updateExample} />
					<p className="text-sm text-muted-foreground">
						The update command requires a GitHub URL pointing to the template
						directory — the same URL used when the template was originally published.
						A valid login is required.
					</p>
				</CardContent>
			</Card>

			{/* Cache behavior */}
			<Card>
				<CardHeader className="gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<PackageCheckIcon className="size-5" />
					</div>
					<div>
						<CardTitle>How the cache works</CardTitle>
						<CardDescription>
							Oxide caches templates locally and avoids unnecessary re-downloads using
							commit SHAs.
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent>
					<ul className="space-y-3 text-sm text-muted-foreground">
						{cacheFacts.map((item) => (
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
						<CardTitle className="text-base">Creating your own template</CardTitle>
						<CardDescription>
							Learn how to author an `oxide.template.json` manifest, structure your
							template folder, and use Tera variables for project name rendering.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button variant="outline" asChild>
							<Link href="/docs/templates/creating">
								Creating Templates
								<ArrowRightIcon className="size-4" />
							</Link>
						</Button>
					</CardContent>
				</Card>

				<Card className="border-dashed">
					<CardHeader>
						<CardTitle className="text-base">Publishing to the registry</CardTitle>
						<CardDescription>
							Learn how to publish and update a template in the Oxide registry using a
							GitHub URL.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button variant="outline" asChild>
							<Link href="/docs/templates/publishing">
								Publishing Templates
								<ArrowRightIcon className="size-4" />
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>

			<DocsPagination currentHref="/docs/templates" />
		</div>
	);
}
