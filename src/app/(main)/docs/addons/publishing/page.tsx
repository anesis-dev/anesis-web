import Link from "next/link";
import {
	ArrowRightIcon,
	BoxesIcon,
	GitBranchIcon,
	KeyRoundIcon,
	RefreshCwIcon,
	UploadIcon,
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

const publishExample = `# Publish an addon whose manifest is at the repo root
anesis addon publish https://github.com/owner/repo

# Publish an addon in a subdirectory
anesis addon publish https://github.com/owner/repo/tree/main/addons/nest-drizzle`;

const updateExample = `# Update an existing registry entry with the latest commit
anesis addon update https://github.com/owner/repo/tree/main/addons/nest-drizzle`;

const urlRules = [
	"The host must be `github.com` — other Git hosts are not supported.",
	"The path must contain at least `owner/repo`.",
	"Use the GitHub `/tree/<branch>/<path>` URL format to point at a subdirectory.",
	"Both the repository root and subdirectory URLs are valid.",
];

const publishSteps = [
	{
		step: "1",
		title: "Validate the URL locally",
		body: "The CLI checks that the URL is a valid github.com URL with at least an owner/repo path before contacting the server.",
	},
	{
		step: "2",
		title: "Send to the backend",
		body: "The CLI sends the URL to the backend as JSON. Your auth token is included with the request.",
	},
	{
		step: "3",
		title: "Backend fetches the tree",
		body: "The backend fetches the GitHub directory tree, reads `anesis.addon.json` from the published path, and validates the manifest.",
	},
	{
		step: "4",
		title: "Registry entry is created",
		body: "The addon is stored in the registry with its current commit SHA. The CLI uses the commit SHA to avoid redundant re-downloads.",
	},
];

export default function DocsAddonsPublishingPage() {
	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 lg:px-8">
			<section className="relative overflow-hidden rounded-[2rem] border bg-card px-6 py-8 shadow-sm sm:px-8">
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(181,111,43,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(112,73,35,0.12),transparent_30%)]" />
				<div className="relative space-y-5">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<BoxesIcon className="size-4" />
						Addons / Publishing Addons
					</div>
					<div className="max-w-4xl space-y-3">
						<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Publish your addon to the registry
						</h1>
						<p className="text-sm leading-6 text-muted-foreground sm:text-base">
							Publishing makes your addon available to anyone with access to the
							Anesis registry. Point the CLI at a GitHub URL, and the backend fetches
							the directory, reads your manifest, and creates the registry entry.
						</p>
					</div>
					<div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
						<span className="rounded-full border bg-background/80 px-3 py-1">
							Requires anesis login
						</span>
						<span className="rounded-full border bg-background/80 px-3 py-1">
							GitHub URL
						</span>
						<span className="rounded-full border bg-background/80 px-3 py-1">
							Commit SHA tracking
						</span>
					</div>
				</div>
			</section>

			<Card>
				<CardHeader className="gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<KeyRoundIcon className="size-5" />
					</div>
					<div>
						<CardTitle>Authentication required</CardTitle>
						<CardDescription>
							Both `anesis addon publish` and `anesis addon update` require a saved
							login session.
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="space-y-3 text-sm text-muted-foreground">
					<p>
						Run{" "}
						<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
							anesis login
						</code>{" "}
						before publishing. The CLI sends your auth token with the request so the
						backend can associate the addon with your account.
					</p>
					<p>
						See the{" "}
						<Link href="/docs/authentication" className="underline underline-offset-4">
							Authentication
						</Link>{" "}
						page for the full login flow.
					</p>
				</CardContent>
			</Card>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader className="gap-3">
						<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<UploadIcon className="size-5" />
						</div>
						<div>
							<CardTitle>Publishing an addon</CardTitle>
							<CardDescription>
								Pass the GitHub URL of your addon directory. Both repo root and
								subdirectory URLs are accepted.
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent>
						<CodeBlock code={publishExample} />
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
								When you push changes to your GitHub repo, run `update` to sync the
								registry with the latest commit.
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<CodeBlock code={updateExample} />
						<p className="text-sm text-muted-foreground">
							Use the same URL that was passed to{" "}
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
								anesis addon publish
							</code>
							. The backend re-fetches the tree, re-reads the manifest, and updates
							the stored commit SHA. Users will get the new version on their next
							install or update.
						</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader className="gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<GitBranchIcon className="size-5" />
					</div>
					<div>
						<CardTitle>What happens when you publish</CardTitle>
						<CardDescription>
							The CLI and backend work together to register your addon.
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 sm:grid-cols-2">
						{publishSteps.map((item) => (
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

			<Card>
				<CardHeader>
					<CardTitle>GitHub URL rules</CardTitle>
					<CardDescription>
						The CLI validates the URL locally before sending it to the backend.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ul className="space-y-3 text-sm text-muted-foreground">
						{urlRules.map((item) => (
							<li key={item} className="flex gap-2">
								<span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
								<span>{item}</span>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>

			<div className="flex flex-wrap gap-3">
				<Button variant="outline" asChild>
					<Link href="/docs/addons/creating">← Creating Addons</Link>
				</Button>
				<Button asChild>
					<Link href="/docs/reference">
						Reference
						<ArrowRightIcon className="size-4" />
					</Link>
				</Button>
			</div>

			<DocsPagination currentHref="/docs/addons/publishing" />
		</div>
	);
}
