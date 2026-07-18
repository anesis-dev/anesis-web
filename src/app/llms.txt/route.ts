

export const dynamic = "force-static";

export function GET(request: Request): Response {
	const origin = new URL(request.url).origin;

	const body = `# Anesis

> Anesis is a project scaffolding platform: a registry of templates (full starter projects) and addons (incremental code-mods), consumed by the \`anesis\` CLI. The CLI is fully scriptable — non-interactive flags, JSON output, token auth, and an MCP server — so AI agents can scaffold and extend projects unattended.

## For AI agents
- [Using Anesis with AI agents & MCP](${origin}/docs/ai-agents): token auth (\`ANESIS_TOKEN\`), non-interactive flags (\`--yes\`, \`--input\`, \`--json\`), and the \`anesis mcp\` server.
- Authenticate: create a personal access token at ${origin}/account/tokens, then set \`ANESIS_TOKEN\`.
- MCP: run \`anesis mcp\` for a stdio JSON-RPC server exposing search_registry, get_manifest, scaffold_project, apply_addon, apply_stack, project_status.

## Docs
- [Installation](${origin}/docs/installation)
- [Authentication](${origin}/docs/authentication)
- [Using Templates](${origin}/docs/templates)
- [Using Addons](${origin}/docs/addons)
- [CLI Commands](${origin}/docs/reference/commands)
`;

	return new Response(body, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
}
