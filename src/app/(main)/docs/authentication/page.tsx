import Link from "next/link";
import { ShieldCheckIcon } from "lucide-react";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { DocsHero } from "@/components/docs/DocsHero";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsSection, DocsSubheading, DocsList } from "@/components/docs/prose";

const authFlow = `anesis login
anesis account
anesis logout`;

const loginSteps = [
	"Generate a random state token for CSRF protection.",
	"Open the browser to `<backend>/auth/cli-login?state=...`.",
	"Start a local auth server and wait for the frontend callback.",
	"Serialize the returned user payload into `~/.anesis/auth.json`.",
	"On Unix, the file is written with owner-only permissions `0600`.",
];

const authRequired = [
	"`anesis template install`, `anesis addon install`, and `anesis stack install` always talk to the backend registry.",
	"`anesis template publish/update`, `anesis addon publish/update`, and `anesis stack publish/update` send authenticated mutations.",
	"`anesis account` fetches the current user from the backend.",
	"`anesis new`, `anesis use <addon-id> <command>`, and `anesis new --stack <id>` require auth only when they must download an uncached template, addon, or stack first.",
	"`anesis search` and `anesis outdated` reach the backend but degrade gracefully (empty or partial results) without a session.",
];

const localOnly = [
	"`anesis template list/remove`, `anesis addon list/remove`, and `anesis stack list/remove` operate on local cache files only.",
	"`anesis template link` and `anesis addon link` validate and cache a local directory — no network call.",
	"`anesis new`, `anesis use <addon-id> <command>`, and `anesis new --stack <id>` can all run without logging in once the template/addon/stack is already cached locally.",
	"`anesis undo`, `anesis update <addon-id>` (project-level upgrade), and `anesis status` operate on the current project's `anesis.lock`/`anesis.json`.",
	"`anesis mcp` itself starts locally; individual tool calls follow the same rules as their underlying commands.",
];

const tokenAuth = [
	"Set `ANESIS_TOKEN` to a personal access token (create one on `/account/tokens`) to skip the browser flow entirely — every authenticated command uses it instead.",
	"`get_auth_user` checks `ANESIS_TOKEN` first, before falling back to `~/.anesis/auth.json`, so a token in the environment always takes priority.",
	"This is the auth path used by CI and the `anesis mcp` server — see the AI Agents & MCP page for the full setup.",
];

export default function DocsAuthenticationPage() {
	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-5 py-10 lg:px-8">
			<DocsHero
				eyebrow="Authentication"
				eyebrowIcon={ShieldCheckIcon}
				title="Browser login, local session storage, and when auth is actually needed"
				description={
					<>
						Anesis stores a local auth session in{" "}
						<code>~/.anesis/auth.json</code>, uses the backend for login
						initiation and account fetches, and only needs that session for flows
						that touch the remote registry or other protected endpoints.
					</>
				}
				chips={[
					"anesis login",
					"anesis account",
					"anesis logout",
					"Unix auth file mode 0600",
				]}
			/>

			<div className="flex flex-col gap-10">
				<DocsSection
					id="auth-commands"
					title="The auth commands"
					lead="These are the only dedicated auth commands exposed by the current CLI."
				>
					<CodeBlock code={authFlow} />
					<p>
						If you are already logged in, Anesis asks for confirmation before
						starting a new login flow, so re-running <code>anesis login</code> is
						a safe way to switch accounts.
					</p>
				</DocsSection>

				<DocsSection
					id="login"
					title="What anesis login does"
					lead="The login command is a browser-based flow with CSRF protection and a local callback server."
				>
					<DocsList items={loginSteps} ordered />
				</DocsSection>

				<DocsSection
					id="account"
					title="What anesis account does"
					lead="Account lookup confirms who you are signed in as."
				>
					<p>
						<code>anesis account</code> uses the saved bearer token and prints the
						GitHub login returned by <code>/user/info</code>. If no session is
						saved, it asks you to log in first.
					</p>
				</DocsSection>

				<DocsSection
					id="logout"
					title="What anesis logout does"
					lead="Logout is intentionally small: it removes the local auth file."
				>
					<p>
						If <code>~/.anesis/auth.json</code> exists, Anesis deletes it and
						prints <code>Logout successful</code>. If the file is missing, the
						command exits with an error instead of silently succeeding.
					</p>
					<p>
						No remote revocation call is sent from the current CLI
						implementation — logging out only clears local state.
					</p>
				</DocsSection>

				<DocsSection
					id="when-auth-is-needed"
					title="When authentication is required"
					lead="Some commands always reach the backend; others work entirely from the local cache."
				>
					<DocsSubheading id="requires-auth">
						Commands that require auth
					</DocsSubheading>
					<DocsList items={authRequired} />

					<DocsSubheading id="local-only">
						Commands that can run fully locally
					</DocsSubheading>
					<DocsList items={localOnly} />
				</DocsSection>

				<DocsSection
					id="token-auth"
					title="Token-based auth for CI and agents"
					lead="A personal access token bypasses the browser flow entirely — the same session file is never touched."
				>
					<DocsList items={tokenAuth} />
					<p>
						See{" "}
						<Link
							href="/docs/ai-agents"
							className="font-medium text-primary hover:underline"
						>
							AI Agents &amp; MCP
						</Link>{" "}
						for the full token setup and the <code>anesis mcp</code> server.
					</p>
				</DocsSection>
			</div>

			<DocsPagination currentHref="/docs/authentication" />
		</div>
	);
}
