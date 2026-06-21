import Link from "next/link";
import {
	ArrowRightIcon,
	GitBranchIcon,
	KeyRoundIcon,
	LayoutTemplateIcon,
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

const publishExamples = `# Publish a template whose manifest is at the repo root
anesis template publish https://github.com/owner/repo

# Publish a template in a subdirectory
anesis template publish https://github.com/owner/repo/tree/main/templates/react-vite-ts`;

const updateExample = `# Update an existing registry entry
anesis template update https://github.com/owner/repo/tree/main/templates/react-vite-ts`;

const urlRules = [
	"The host must be `github.com` — other Git hosts are not supported.",
	"The path must contain at least `owner/repo`.",
	"To point at a subdirectory, use the GitHub `/tree/<branch>/<path>` URL format — the same URL shown in your browser when you navigate into a folder.",
	"Both the repository root URL and subdirectory URLs are valid.",
];

const publishSteps = [
	{
		step: "1",
		title: "Validate the URL locally",
		body: "The CLI checks that the URL is a valid github.com URL with at least an owner/repo path before sending anything to the server.",
	},
	{
		step: "2",
		title: "Send to the backend",
		body: "The CLI sends the URL to the backend as JSON. Your auth token is included in the request.",
	},
	{
		step: "3",
		title: "Backend fetches the tree",
		body: "The backend fetches the GitHub directory tree, reads `anesis.template.json` from the published path, and validates the manifest.",
	},
	{
		step: "4",
		title: "Registry entry is created",
		body: "The template is stored in the registry with its current commit SHA. The commit SHA is used by the CLI to skip re-downloads when nothing has changed.",
	},
];

const updateNotes = [
	"Use the same URL that was passed to `anesis template publish`.",
	"The backend re-fetches the tree, re-reads the manifest, and updates the stored commit SHA.",
	"Users who already have the old version cached will get the new version on their next `anesis template install` or `anesis template update`.",
];

export default function DocsTemplatesPublishingPage() {
	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 lg:px-8">
			<section className="relative overflow-hidden rounded-[2rem] border bg-card px-6 py-8 shadow-sm sm:px-8">
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(181,111,43,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(112,73,35,0.12),transparent_30%)]" />
				<div className="relative space-y-5">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<LayoutTemplateIcon className="size-4" />
						Templates / Publishing Templates
					</div>
					<div className="max-w-4xl space-y-3">
						<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Publish your template to the registry
						</h1>
						<p className="text-sm leading-6 text-muted-foreground sm:text-base">
							Publishing makes your template available to anyone with access to the
							Anesis registry. You point the CLI at a GitHub URL, and the backend does
							the rest — it fetches the directory tree, reads your manifest, and
							creates the registry entry.
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
							Both `anesis template publish` and `anesis template update` require a
							saved login session.
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
						backend can associate the template with your account.
					</p>
					<p>
						See the{" "}
						<Link href="/docs/authentication" className="underline underline-offset-4">
							Authentication
						</Link>{" "}
						page for details on the login flow.
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
							<CardTitle>Publishing a template</CardTitle>
							<CardDescription>
								Pass the GitHub URL of your template directory. Both repo root and
								subdirectory URLs are accepted.
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent>
						<CodeBlock code={publishExamples} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="gap-3">
						<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<RefreshCwIcon className="size-5" />
						</div>
						<div>
							<CardTitle>Updating a template</CardTitle>
							<CardDescription>
								When you push new changes to your GitHub repo, run `update` to sync
								the registry entry with the latest commit.
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<CodeBlock code={updateExample} />
						<ul className="space-y-2 text-sm text-muted-foreground">
							{updateNotes.map((item) => (
								<li key={item} className="flex gap-2">
									<span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
									<span>{item}</span>
								</li>
							))}
						</ul>
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
							The CLI and backend work together to register your template.
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
					<Link href="/docs/templates/creating">← Creating Templates</Link>
				</Button>
				<Button asChild>
					<Link href="/docs/addons">
						Next: Using Addons
						<ArrowRightIcon className="size-4" />
					</Link>
				</Button>
			</div>

			<DocsPagination currentHref="/docs/templates/publishing" />
		</div>
	);
}
