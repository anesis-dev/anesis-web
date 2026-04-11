import Link from "next/link";
import { DatabaseIcon, GitBranchIcon } from "lucide-react";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { env } from "@/config/env";
import { fetchTemplateSchema } from "@/services/schema";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const nameRules = `Project name:
- "." is allowed
- other names may use letters, numbers, -, _, .
- must not start with "."
- must not end with "." or space
- must not already exist on disk

Template name:
- may use letters, numbers, -, _
- spaces, dots, slashes, and other punctuation are rejected

GitHub URL:
- host must be github.com
- path must contain at least owner/repo`;

const localState = [
	{
		path: "~/.oxide",
		description: "Root home directory created by the CLI at startup.",
	},
	{
		path: "~/.oxide/cache/templates",
		description: "Extracted template cache directories.",
	},
	{
		path: "~/.oxide/cache/templates/oxide-templates.json",
		description: "Template cache index with metadata and commit SHAs.",
	},
	{
		path: "~/.oxide/cache/addons",
		description: "Extracted addon cache directories.",
	},
	{
		path: "~/.oxide/cache/addons/oxide-addons.json",
		description: "Addon cache index with id, name, version, path, and commit SHA.",
	},
	{
		path: "~/.oxide/auth.json",
		description: "Local auth session returned by the browser login flow.",
	},
	{
		path: "oxide.lock",
		description: "Per-project addon execution state written in the project root.",
	},
];

const cacheFields = [
	"`oxide-templates.json` tracks template `name`, `version`, `source`, `path`, `official`, and `commit_sha`.",
	"`oxide-addons.json` tracks addon `id`, `name`, `version`, `path`, `commit_sha`, and `repo_url`.",
	"`oxide.lock` stores `id`, `version`, `variant`, and `commands_executed` for each addon used in a project.",
];

export default async function DocsReferencePage() {
	let schemaPreview: string | null = null;

	try {
		schemaPreview = await fetchTemplateSchema();
	} catch {
		schemaPreview = null;
	}

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 lg:px-8">
			<section className="relative overflow-hidden rounded-[2rem] border bg-card px-6 py-8 shadow-sm sm:px-8">
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(181,111,43,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(112,73,35,0.12),transparent_30%)]" />
				<div className="relative space-y-5">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<DatabaseIcon className="size-4" />
						Reference
					</div>
					<div className="max-w-4xl space-y-3">
						<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Local state, validation rules, and schema links
						</h1>
						<p className="text-sm leading-6 text-muted-foreground sm:text-base">
							Use this page as a compact operational reference for where Oxide
							stores files, how it validates user input, and where the backend
							exposes the current template schema.
						</p>
					</div>
					<div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
						<span className="rounded-full border bg-background/80 px-3 py-1">
							`~/.oxide` home
						</span>
						<span className="rounded-full border bg-background/80 px-3 py-1">
							Schema endpoint preview
						</span>
					</div>
				</div>
			</section>

			<div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
				<Card>
					<CardHeader>
						<CardTitle>Local Oxide state</CardTitle>
						<CardDescription>
							These directories and files are created or updated by the current
							CLI implementation.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{localState.map((item) => (
							<div key={item.path} className="rounded-2xl border bg-muted/20 p-4">
								<p className="font-mono text-sm font-medium">{item.path}</p>
								<p className="mt-2 text-sm text-muted-foreground">
									{item.description}
								</p>
							</div>
						))}
					</CardContent>
				</Card>

				<div className="grid gap-6">
					<Card>
						<CardHeader>
							<CardTitle>Cache and lock file fields</CardTitle>
							<CardDescription>
								The CLI stores more than raw extracted files; it also writes index
								metadata for cache and execution state.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="space-y-3 text-sm text-muted-foreground">
								{cacheFields.map((item) => (
									<li key={item} className="flex gap-2">
										<span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
										<span>{item}</span>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
				<Card>
					<CardHeader>
						<CardTitle>Validation rules at a glance</CardTitle>
						<CardDescription>
							These are the local checks performed before project creation,
							template installation, and publish/update requests.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<CodeBlock code={nameRules} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Related surfaces</CardTitle>
						<CardDescription>
							These pages pair naturally with the docs while working with Oxide.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-3">
						<Button variant="outline" asChild>
							<Link href="/templates">Browse templates</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/addons">Browse addons</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link
								href="https://github.com/oxide-cli/oxide"
								target="_blank"
								rel="noopener noreferrer"
							>
								<GitBranchIcon className="size-4" />
								CLI repository
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Template schema endpoint</CardTitle>
					<CardDescription>
						The backend still exposes the current JSON Schema used by the web app
						and registry validation layer.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-wrap gap-3">
						<Button variant="outline" asChild>
							<Link
								href={`${env.apiUrl}/schema/oxide.template.schema.json`}
								target="_blank"
								rel="noopener noreferrer"
							>
								View raw schema
							</Link>
						</Button>
					</div>

					{schemaPreview ? (
						<CodeBlock code={schemaPreview} />
					) : (
						<p className="text-sm text-muted-foreground">
							Schema preview is unavailable right now. The raw endpoint is still
							linked above.
						</p>
					)}
				</CardContent>
			</Card>

			<DocsPagination currentHref="/docs/reference" />
		</div>
	);
}
