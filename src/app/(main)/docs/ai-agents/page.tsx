import { BotIcon } from "lucide-react";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { DocsHero } from "@/components/docs/DocsHero";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsSection, DocsSubheading, DocsList } from "@/components/docs/prose";

const tokenFlow = `# 1. Create a token at /account/tokens, then:
export ANESIS_TOKEN=anesis_pat_...

# 2. Every authenticated command now uses it — no browser login.
anesis template install react-vite-ts
anesis new my-app react-vite-ts --yes`;

const nonInteractive = [
	"`--yes` accepts all defaults and skips every confirmation prompt.",
	"`--input NAME=VALUE` supplies an input non-interactively (repeatable).",
	"`--json` prints machine-readable output on `list`, `info`, `search`, `status`, `account`, and `info` commands.",
	"`ANESIS_TOKEN` authenticates the CLI in place of the browser login flow.",
];

const mcpTools = [
	"`search_registry` — search templates, addons and stacks.",
	"`get_manifest` — full manifest for a template, addon or stack.",
	"`scaffold_project` — create a project from a template.",
	"`apply_addon` — run an addon command in a project.",
	"`apply_stack` — scaffold a project from a stack (template + ordered addons).",
	"`project_status` — the current project's template and applied addons.",
];

const mcpConfig = `{
  "mcpServers": {
    "anesis": {
      "command": "anesis",
      "args": ["mcp"],
      "env": { "ANESIS_TOKEN": "anesis_pat_..." }
    }
  }
}`;

export default function DocsAiAgentsPage() {
	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-5 py-10 lg:px-8">
			<DocsHero
				eyebrow="AI agents"
				eyebrowIcon={BotIcon}
				title="Using Anesis with AI agents and CI"
				description={
					<>
						Anesis is scriptable end to end: non-interactive flags, JSON output,
						token auth, and an <code>anesis mcp</code> server that exposes the CLI
						to any MCP-capable agent.
					</>
				}
				chips={["ANESIS_TOKEN", "--yes", "--json", "anesis mcp"]}
			/>

			<div className="flex flex-col gap-10">
				<DocsSection
					id="tokens"
					title="Authenticate with a token"
					lead="Personal access tokens replace the browser login for CI and agents."
				>
					<p>
						Create a token on the{" "}
						<a href="/account/tokens" className="underline">
							API tokens
						</a>{" "}
						page. Set it as <code>ANESIS_TOKEN</code> and every authenticated
						command uses it — the plaintext token is shown only once, so store it
						securely.
					</p>
					<CodeBlock code={tokenFlow} />
				</DocsSection>

				<DocsSection
					id="non-interactive"
					title="Non-interactive flags"
					lead="These make every command safe to run unattended."
				>
					<DocsList items={nonInteractive} />
				</DocsSection>

				<DocsSection
					id="mcp"
					title="The MCP server"
					lead="anesis mcp runs a Model Context Protocol stdio server over the CLI."
				>
					<p>
						Run <code>anesis mcp</code> to start a stdio JSON-RPC server. Point
						any MCP-capable client (e.g. Claude Code) at it with this
						configuration:
					</p>
					<CodeBlock code={mcpConfig} lang="json" />

					<DocsSubheading id="mcp-tools">Exposed tools</DocsSubheading>
					<DocsList items={mcpTools} />
				</DocsSection>
			</div>

			<DocsPagination currentHref="/docs/ai-agents" />
		</div>
	);
}
