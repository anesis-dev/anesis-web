
"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useTokens } from "@/hooks/useTokens";
import { ICreatedToken } from "@/types/token";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { KeyRoundIcon, CopyIcon, CheckIcon, Trash2Icon } from "lucide-react";

export default function AccountTokensPage() {
	const { user, login } = useAuth();
	const { tokens, isLoading, createToken, deleteToken, isCreating, isDeleting } =
		useTokens();
	const [name, setName] = useState("");
	const [created, setCreated] = useState<ICreatedToken | null>(null);
	const [copied, setCopied] = useState(false);
	const [error, setError] = useState<string | null>(null);

	if (!user) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
				<KeyRoundIcon className="size-12 text-primary" />
				<div>
					<p className="font-semibold text-lg">Sign in to manage API tokens</p>
					<p className="mt-1 text-sm text-muted-foreground">
						Tokens let CI pipelines and AI agents use the Anesis CLI on your
						behalf.
					</p>
				</div>
				<div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row">
					<Button onClick={login} className="w-full sm:w-auto">
						<GitHubIcon className="size-4" />
						Login with GitHub
					</Button>
					<Link href="/" className="w-full sm:w-auto">
						<Button variant="outline" className="w-full sm:w-auto">
							Go back to home
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	async function handleCreate(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		const trimmed = name.trim();
		if (!trimmed) return;
		try {
			const token = await createToken(trimmed);
			setCreated(token);
			setCopied(false);
			setName("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create token");
		}
	}

	async function copyToken() {
		if (!created) return;
		await navigator.clipboard.writeText(created.token);
		setCopied(true);
	}

	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-5">
			<div className="flex items-center gap-2">
				<KeyRoundIcon className="size-5 text-primary" />
				<h1 className="text-2xl font-bold tracking-tight">API tokens</h1>
			</div>

			<p className="text-sm text-muted-foreground">
				Personal access tokens authenticate the CLI without a browser login.
				Set{" "}
				<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
					ANESIS_TOKEN
				</code>{" "}
				in your CI or agent environment. A token carries your full account
				access — treat it like a password.
			</p>

			{created && (
				<Alert>
					<KeyRoundIcon className="size-4" />
					<AlertTitle>Token &ldquo;{created.name}&rdquo; created</AlertTitle>
					<AlertDescription className="flex flex-col gap-3">
						<span>
							Copy it now — it will not be shown again.
						</span>
						<div className="flex w-full items-center gap-2">
							<code className="min-w-0 flex-1 overflow-x-auto rounded bg-muted px-3 py-2 font-mono text-xs">
								{created.token}
							</code>
							<Button
								type="button"
								size="sm"
								variant="outline"
								onClick={copyToken}
							>
								{copied ? (
									<CheckIcon className="size-4" />
								) : (
									<CopyIcon className="size-4" />
								)}
								{copied ? "Copied" : "Copy"}
							</Button>
						</div>
					</AlertDescription>
				</Alert>
			)}

			<form onSubmit={handleCreate} className="flex flex-col gap-3 sm:flex-row">
				<Input
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Token name (e.g. ci, claude-agent)"
					maxLength={100}
					className="flex-1"
				/>
				<Button type="submit" disabled={isCreating || !name.trim()}>
					{isCreating ? "Creating…" : "Create token"}
				</Button>
			</form>
			{error && <p className="text-sm text-destructive">{error}</p>}

			<div className="flex flex-col divide-y rounded-xl border">
				{isLoading ? (
					<div className="px-4 py-8 text-center text-sm text-muted-foreground">
						Loading…
					</div>
				) : tokens.length === 0 ? (
					<div className="px-4 py-8 text-center text-sm text-muted-foreground">
						No tokens yet.
					</div>
				) : (
					tokens.map((token) => (
						<div
							key={token.id}
							className="flex items-center justify-between gap-4 px-4 py-3"
						>
							<div className="min-w-0">
								<p className="truncate font-medium text-sm">{token.name}</p>
								<p className="text-xs text-muted-foreground">
									Created {new Date(token.created_at).toLocaleDateString()}
									{" · "}
									{token.last_used_at
										? `last used ${new Date(token.last_used_at).toLocaleDateString()}`
										: "never used"}
								</p>
							</div>
							<Button
								type="button"
								size="sm"
								variant="ghost"
								className="text-destructive hover:text-destructive"
								disabled={isDeleting}
								onClick={() => deleteToken(token.id)}
							>
								<Trash2Icon className="size-4" />
								Revoke
							</Button>
						</div>
					))
				)}
			</div>
		</div>
	);
}
