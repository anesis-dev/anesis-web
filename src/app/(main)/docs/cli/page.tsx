import { DocsPagination } from "@/components/docs/DocsPagination";
import { CodeBlock } from "@/components/docs/CodeBlock";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const quickStart = `oxide new my-app
cd my-app`;

const directTemplate = `oxide new my-app react-swc-vite-ts`;

const commands = [
	{
		command: "oxide new [name] [template_name]",
		description:
			"Create a new project. Without a template name, Oxide runs the interactive setup flow.",
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
					Oxide can run fully interactively or straight from a known template
					name. For normal project generation users should not have to think
					about auth first.
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
							If you already know the template name, skip the interactive flow.
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
							Interactive creation is a guided decision tree.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3 text-sm text-muted-foreground">
						<p>
							1. Choose a project layer like Frontend, Backend, Meta, Desktop,
							or Mobile.
						</p>
						<p>2. Select the framework or runtime.</p>
						<p>
							3. If relevant, choose the build tool, language, and platform
							variant.
						</p>
						<p>4. Choose the package manager.</p>
						<p>
							5. Oxide resolves the matching template and installs dependencies
							for you.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Auth and cache commands</CardTitle>
						<CardDescription>
							Authentication exists, but it should stay out of the way for
							normal CLI usage.
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
							For ordinary scaffolding, users should be able to work without
							logging in first.
						</p>
						<p>
							Publishing your own template from the terminal is the flow that
							should require authentication.
						</p>
					</CardContent>
				</Card>
			</div>

			<DocsPagination currentHref="/docs/cli" />
		</div>
	);
}
