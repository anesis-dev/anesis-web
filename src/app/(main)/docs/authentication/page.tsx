import { ShieldCheckIcon, KeyRoundIcon, UserRoundIcon } from "lucide-react";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { CodeBlock } from "@/components/docs/CodeBlock";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const authFlow = `oxide login
oxide account
oxide logout`;

const authRequired = [
	"`oxide template install` always talks to the backend registry.",
	"`oxide template publish` and `oxide template update` send authenticated mutations.",
	"`oxide addon install`, `oxide addon publish`, and `oxide addon update` require the saved token.",
	"`oxide account` fetches the current user from the backend.",
	"`oxide new` and `oxide use <addon-id> <command>` require auth only when they must download an uncached template or addon first.",
];

const localOnly = [
	"`oxide template list` and `oxide template remove` operate on local cache files.",
	"`oxide addon list` and `oxide addon remove` operate on local addon cache files.",
	"`oxide new` can run without logging in when the template is already cached locally.",
	"`oxide use <addon-id> <command>` can run without logging in when the addon is already cached locally.",
];

export default function DocsAuthenticationPage() {
	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 lg:px-8">
			<section className="relative overflow-hidden rounded-[2rem] border bg-card px-6 py-8 shadow-sm sm:px-8">
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(181,111,43,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(112,73,35,0.12),transparent_30%)]" />
				<div className="relative space-y-5">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<ShieldCheckIcon className="size-4" />
						Authentication
					</div>
					<div className="max-w-3xl space-y-3">
						<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Browser login, local session storage, and when auth is actually needed
						</h1>
						<p className="text-sm leading-6 text-muted-foreground sm:text-base">
							Oxide stores a local auth session in <code>~/.oxide/auth.json</code>,
							uses the backend for login initiation and account fetches, and only
							needs that session for flows that touch the remote registry or other
							protected endpoints.
						</p>
					</div>
					<div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
						<span className="rounded-full border bg-background/80 px-3 py-1">
							`oxide login`
						</span>
						<span className="rounded-full border bg-background/80 px-3 py-1">
							`oxide account`
						</span>
						<span className="rounded-full border bg-background/80 px-3 py-1">
							`oxide logout`
						</span>
						<span className="rounded-full border bg-background/80 px-3 py-1">
							Unix auth file mode `0600`
						</span>
					</div>
				</div>
			</section>

			<div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
				<Card>
					<CardHeader>
						<CardTitle>Minimal auth flow</CardTitle>
						<CardDescription>
							These are the only dedicated auth commands exposed by the current CLI.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<CodeBlock code={authFlow} />
					</CardContent>
				</Card>

				<div className="grid gap-4">
					<Card>
						<CardHeader className="gap-3">
							<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
								<KeyRoundIcon className="size-5" />
							</div>
							<div>
								<CardTitle className="text-base">Switching accounts</CardTitle>
								<CardDescription>
									If you are already logged in, Oxide asks for confirmation before
									starting a new login flow.
								</CardDescription>
							</div>
						</CardHeader>
					</Card>

					<Card>
						<CardHeader className="gap-3">
							<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
								<UserRoundIcon className="size-5" />
							</div>
							<div>
								<CardTitle className="text-base">Account lookup</CardTitle>
								<CardDescription>
									`oxide account` uses the saved bearer token and prints the GitHub
									login returned by `/user/info`.
								</CardDescription>
							</div>
						</CardHeader>
					</Card>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>What `oxide login` does</CardTitle>
						<CardDescription>
							The login command is a browser-based flow with CSRF protection and a
							local callback server.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3 text-sm text-muted-foreground">
						<p>1. Generate a random state token for CSRF protection.</p>
						<p>
							2. Open the browser to
							<code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">
								&lt;backend&gt;/auth/cli-login?state=...
							</code>
							.
						</p>
						<p>
							3. Start a local auth server and wait for the frontend callback.
						</p>
						<p>
							4. Serialize the returned user payload into
							<code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">
								~/.oxide/auth.json
							</code>
							.
						</p>
						<p>
							5. On Unix, the file is written with owner-only permissions
							<code className="ml-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">
								0600
							</code>
							.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>What `oxide logout` does</CardTitle>
						<CardDescription>
							Logout is intentionally small: it removes the local auth file.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3 text-sm text-muted-foreground">
						<p>
							If <code>~/.oxide/auth.json</code> exists, Oxide deletes it and prints
							`Logout successful`.
						</p>
						<p>
							If the file is missing, the command exits with an error instead of
							silently succeeding.
						</p>
						<p>
							No remote revocation call is sent from the current CLI
							implementation.
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Commands that require auth</CardTitle>
						<CardDescription>
							These commands always or conditionally hit authenticated backend
							endpoints.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-3 text-sm text-muted-foreground">
							{authRequired.map((item) => (
								<li key={item} className="flex gap-2">
									<span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Commands that can run fully locally</CardTitle>
						<CardDescription>
							Once the required template or addon is already cached, these flows
							do not need a fresh login.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-3 text-sm text-muted-foreground">
							{localOnly.map((item) => (
								<li key={item} className="flex gap-2">
									<span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>

			<DocsPagination currentHref="/docs/authentication" />
		</div>
	);
}
