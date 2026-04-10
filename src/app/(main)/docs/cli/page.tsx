import { DocsPagination } from "@/components/docs/DocsPagination";
import { CodeBlock } from "@/components/docs/CodeBlock";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const quickStart = `oxide login
oxide new my-app react-vite-ts
cd my-app`;

const addonExecution = `cd my-app
oxide addon install drizzle
oxide drizzle init`;

const topLevelCommands = `oxide new <NAME> <TEMPLATE_NAME>
oxide template <COMMAND>
oxide login
oxide logout
oxide account
oxide addon <COMMAND>
oxide <ADDON_ID> <COMMAND>`;

const templateCommands = `oxide template install <TEMPLATE_NAME>
oxide template list
oxide template remove <TEMPLATE_NAME>
oxide template publish <GITHUB_URL>`;

const addonCommands = `oxide addon install <ADDON_ID>
oxide addon list
oxide addon remove <ADDON_ID>`;

const aliases = `oxide n ...      # new
oxide t ...      # template
oxide in         # login
oxide out        # logout
oxide a          # account`;

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
					Template and addon downloads stay cached locally, but archive lookup goes
					through authenticated backend endpoints, so log in before registry-backed
					install, scaffold, and addon flows.
				</p>
			</section>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Quick start</CardTitle>
						<CardDescription>
							The shortest authenticated flow from install to your first generated
							project.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<CodeBlock code={quickStart} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Run an addon inside a project</CardTitle>
						<CardDescription>
							Cache the addon explicitly, then execute one of its manifest commands
							from the project root.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<CodeBlock code={addonExecution} />
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Top-level commands</CardTitle>
						<CardDescription>
							The current public CLI surface exposed by the <code>oxide</code>
							 binary.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<CodeBlock code={topLevelCommands} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Template management</CardTitle>
						<CardDescription>
							Use the <code>template</code> subcommand to cache, inspect, remove,
							 and publish templates.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<CodeBlock code={templateCommands} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Addon management</CardTitle>
						<CardDescription>
							Use the <code>addon</code> subcommand to manage the global addon cache.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<CodeBlock code={addonCommands} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Aliases</CardTitle>
						<CardDescription>
							Short aliases are available for the most common new, template, and
							 account commands.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<CodeBlock code={aliases} />
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>What happens during <code>oxide new</code></CardTitle>
						<CardDescription>
							Project generation is explicit and cache-aware.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3 text-sm text-muted-foreground">
						<p>1. Validate the project name and requested template slug.</p>
						<p>
							2. Resolve the latest template archive, reusing the local cache when
							the commit SHA is unchanged. The same download pipeline backs
							<code className="ml-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">
								oxide template install
							</code>
							.
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
						<CardTitle>Auth, registry downloads, and addon execution</CardTitle>
						<CardDescription>
							Remote template and addon downloads go through authenticated backend
							endpoints in the current CLI and backend.
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
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
								oxide new
							</code>
							,
							<code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">
								oxide template install
							</code>
							,
							<code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">
								oxide addon install
							</code>
							, and the first run of
							<code className="ml-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">
								oxide &lt;addon_id&gt; &lt;command&gt;
							</code>{" "}
							all resolve registry archives through authenticated backend
							endpoints.
						</p>
						<p>
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
								oxide &lt;addon_id&gt; &lt;command&gt;
							</code>{" "}
							runs a named command from the addon manifest inside the current
							project and records completed steps in <code>oxide.lock</code>.
						</p>
						<p>
							Publishing templates also requires the same saved session.
						</p>
					</CardContent>
				</Card>
			</div>

			<DocsPagination currentHref="/docs/cli" />
		</div>
	);
}
