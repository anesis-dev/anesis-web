import Link from "next/link";
import { DatabaseIcon, GitBranchIcon } from "lucide-react";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { DocsHero } from "@/components/docs/DocsHero";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsSection, DocsList } from "@/components/docs/prose";
import { env } from "@/config/env";
import { fetchTemplateSchema } from "@/services/schema";
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
		path: "~/.anesis",
		description: "Root home directory created by the CLI at startup.",
	},
	{
		path: "~/.anesis/cache/templates",
		description: "Extracted template cache directories.",
	},
	{
		path: "~/.anesis/cache/templates/anesis-templates.json",
		description: "Template cache index with metadata and commit SHAs.",
	},
	{
		path: "~/.anesis/cache/addons",
		description: "Extracted addon cache directories.",
	},
	{
		path: "~/.anesis/cache/addons/anesis-addons.json",
		description: "Addon cache index with id, name, version, path, and commit SHA.",
	},
	{
		path: "~/.anesis/auth.json",
		description: "Local auth session returned by the browser login flow.",
	},
	{
		path: "anesis.lock",
		description: "Per-project addon execution state written in the project root.",
	},
];

const cacheFields = [
	"`anesis-templates.json` tracks template `name`, `version`, `source`, `path`, `official`, and `commit_sha`.",
	"`anesis-addons.json` tracks addon `id`, `name`, `version`, `path`, `commit_sha`, and `repo_url`.",
	"`anesis.lock` stores `id`, `version`, `variant`, and `commands_executed` for each addon used in a project.",
];

export default async function DocsReferencePage() {
	let schemaPreview: string | null = null;

	try {
		schemaPreview = await fetchTemplateSchema();
	} catch {
		schemaPreview = null;
	}

	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-5 py-10 lg:px-8">
			<DocsHero
				eyebrow="Reference"
				eyebrowIcon={DatabaseIcon}
				title="Local state, validation rules, and schema links"
				description="Use this page as a compact operational reference for where Anesis stores files, how it validates user input, and where the backend exposes the current template schema."
				chips={["~/.anesis home", "Schema endpoint preview"]}
			/>

			<div className="flex flex-col gap-10">
				<DocsSection
					id="local-state"
					title="Local Anesis state"
					lead="These directories and files are created or updated by the current CLI implementation."
				>
					<dl className="space-y-3">
						{localState.map((item) => (
							<div key={item.path} className="space-y-1">
								<dt>
									<code className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-foreground">
										{item.path}
									</code>
								</dt>
								<dd className="text-muted-foreground">{item.description}</dd>
							</div>
						))}
					</dl>
				</DocsSection>

				<DocsSection
					id="cache-fields"
					title="Cache and lock file fields"
					lead="The CLI stores more than raw extracted files; it also writes index metadata for cache and execution state."
				>
					<DocsList items={cacheFields} />
				</DocsSection>

				<DocsSection
					id="validation"
					title="Validation rules at a glance"
					lead="These are the local checks performed before project creation, template installation, and publish/update requests."
				>
					<CodeBlock code={nameRules} />
				</DocsSection>

				<DocsSection
					id="schema"
					title="Template schema endpoint"
					lead="The backend exposes the current JSON Schema used by the web app and registry validation layer."
				>
					<div className="flex flex-wrap gap-3">
						<Button variant="outline" asChild>
							<Link
								href={`${env.apiUrl}/schema/anesis.template.schema.json`}
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
						<p>
							Schema preview is unavailable right now. The raw endpoint is still
							linked above.
						</p>
					)}
				</DocsSection>

				<DocsSection
					id="related"
					title="Related surfaces"
					lead="These pages pair naturally with the docs while working with Anesis."
				>
					<div className="flex flex-wrap gap-3">
						<Button variant="outline" asChild>
							<Link href="/docs/reference/commands">CLI commands</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/templates">Browse templates</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/addons">Browse addons</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link
								href="https://github.com/anesis-dev/anesis-cli"
								target="_blank"
								rel="noopener noreferrer"
							>
								<GitBranchIcon className="size-4" />
								CLI repository
							</Link>
						</Button>
					</div>
				</DocsSection>
			</div>

			<DocsPagination currentHref="/docs/reference" />
		</div>
	);
}
