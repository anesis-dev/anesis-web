import Link from "next/link";
import { GitBranchIcon, BoxIcon } from "lucide-react";
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

const supportedStacks = [
	{
		title: "Frontend",
		items: "React, Preact, Vue, Svelte, Solid, Lit, Qwik, Angular.",
	},
	{
		title: "Meta",
		items: "Next.js and Nuxt.",
	},
	{
		title: "Backend",
		items: "Nest with Express or Fastify.",
	},
	{
		title: "Desktop",
		items: "Tauri and Electron.",
	},
	{
		title: "Mobile",
		items: "React Native.",
	},
];

export default async function DocsReferencePage() {
	let schemaPreview: string | null = null;

	try {
		schemaPreview = await fetchTemplateSchema();
	} catch {
		schemaPreview = null;
	}

	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-10 lg:px-8">
			<section className="space-y-3">
				<p className="text-sm font-medium text-primary">Reference</p>
				<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
					Supported stacks and local paths
				</h1>
				<p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
					Use this page as a compact reference for what Oxide currently supports
					and where it stores state locally. Templates are not limited to the
					JavaScript ecosystem; the important part is the metadata contract and
					the actual files in the published folder.
				</p>
			</section>

			<div className="grid gap-4 md:grid-cols-2">
				{supportedStacks.map((stack) => (
					<Card key={stack.title}>
						<CardHeader>
							<CardTitle>{stack.title}</CardTitle>
							<CardDescription>{stack.items}</CardDescription>
						</CardHeader>
					</Card>
				))}
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Local Oxide paths</CardTitle>
						<CardDescription>
							Oxide keeps auth and cache state under its home directory.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3 text-sm text-muted-foreground">
						<p>
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
								~/.oxide
							</code>{" "}
							is the main home directory for Oxide.
						</p>
						<p>
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
								~/.oxide/auth.json
							</code>{" "}
							stores the local auth session when the user logs in.
						</p>
						<p>
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
								~/.oxide/cache/templates
							</code>{" "}
							contains installed templates and local registry cache files.
						</p>
						<p>
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
								~/.oxide/cache/addons
							</code>{" "}
							stores downloaded addon archives and extracted addon folders.
						</p>
						<p>
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
								~/.oxide/cache/addons/oxide-addons.json
							</code>{" "}
							tracks cached addon ids, versions, and commit SHAs.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Related surfaces</CardTitle>
						<CardDescription>
							These pages pair naturally with the docs while using Oxide.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-3">
						<Button variant="outline" asChild>
							<Link href="/templates">
								<BoxIcon className="size-4" />
								Browse Templates
							</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/addons">
								<BoxIcon className="size-4" />
								Browse Addons
							</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link
								href="https://github.com/oxide-cli/templates"
								target="_blank"
								rel="noopener noreferrer"
							>
								<GitBranchIcon className="size-4" />
								Template Repository
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Template schema</CardTitle>
					<CardDescription>
						The backend exposes the current JSON Schema used to validate
						`oxide.template.json`.
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
