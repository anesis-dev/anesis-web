import { DocsPagination } from "@/components/docs/DocsPagination";
import { CodeBlock } from "@/components/docs/CodeBlock";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const quickStart = `oxide new my-app react-vite-ts
cd my-app`;

const directTemplate = `oxide new my-app react-swc-vite-ts`;

const commands = [
	{
		command: "oxide new <name> <template_name>",
		description:
			"Create a new project from a specific published template name.",
	},
	{
		command: "oxide install-template <template_name>",
		description: "Download and cache a template locally.",
	},
	{
		command: "oxide installed",
		description: "List templates currently installed in the local cache.",
	},
	{
		command: "oxide delete <template_name>",
		description: "Remove a template from the local cache.",
	},
	{
		command: "oxide login",
		description: "Open browser-based login and save the auth session locally.",
	},
	{
		command: "oxide account",
		description: "Print the currently logged-in account.",
	},
	{
		command: "oxide logout",
		description: "Delete the local auth session.",
	},
	{
		command: "oxide publish-template <github_tree_url>",
		description: "Publish a template from a GitHub folder URL.",
	},
];

export default function DocsCliPage() {
	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-10 lg:px-8">
			<section className="space-y-3">
				<p className="text-sm font-medium text-primary">CLI</p>
				<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
					Use the Oxide CLI effectively
				</h1>
				<p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
					The current public CLI takes an explicit template name for generation.
					Template downloads stay cached locally, but the archive lookup goes
					through authenticated backend endpoints, so log in before install/new
					flows.
				</p>
			</section>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Quick start</CardTitle>
						<CardDescription>
							The shortest flow from install to your first generated project.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<CodeBlock code={quickStart} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Generate from a known template</CardTitle>
						<CardDescription>
							Use the published template slug directly from the terminal.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<CodeBlock code={directTemplate} />
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Command reference</CardTitle>
					<CardDescription>
						The current CLI surface exposed by the `oxide` binary.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					{commands.map((item) => (
						<div
							key={item.command}
							className="rounded-2xl border bg-muted/20 p-4"
						>
							<code className="font-mono text-sm">{item.command}</code>
							<p className="mt-2 text-sm text-muted-foreground">
								{item.description}
							</p>
						</div>
					))}
				</CardContent>
			</Card>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>What happens during `oxide new`</CardTitle>
						<CardDescription>
							Project generation is explicit and cache-aware.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3 text-sm text-muted-foreground">
						<p>1. Validate the project name and the requested template slug.</p>
						<p>
							2. Resolve the latest template archive, reusing the local cache
							when the commit SHA is unchanged.
						</p>
						<p>
							3. Extract the template into a new directory and render templated
							files.
						</p>
						<p>4. Print the next steps so you can enter the new project.</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Auth and cache commands</CardTitle>
						<CardDescription>
							Right now authentication is required for registry-backed template
							download and publishing flows.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3 text-sm text-muted-foreground">
						<p>
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
								oxide login
							</code>{" "}
							opens browser auth and saves the returned session locally.
						</p>
						<p>
							`oxide new` and `oxide install-template` both resolve template
							archives through authenticated backend endpoints in the current
							implementation.
						</p>
						<p>
							Publishing your own template also requires the same saved session.
						</p>
					</CardContent>
				</Card>
			</div>

			<DocsPagination currentHref="/docs/cli" />
		</div>
	);
}
