"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, TerminalSquareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const installCommand = `npm install -g anesis-cli`;

export function InstallCommand() {
	const [installCopied, setInstallCopied] = useState(false);

	async function handleCopyInstallCommand() {
		if (!navigator.clipboard?.writeText) {
			return;
		}

		try {
			await navigator.clipboard.writeText(installCommand);
			setInstallCopied(true);
			window.setTimeout(() => setInstallCopied(false), 1600);
		} catch {}
	}

	return (
		<div className="mx-auto mt-6 w-full max-w-md">
			<div className="flex items-center overflow-hidden rounded-lg border border-primary/25 bg-black/42 text-left shadow-[0_0_34px_rgba(20,75,52,0.26)] ring-1 ring-white/5 backdrop-blur-xl">
				<button
					type="button"
					onClick={handleCopyInstallCommand}
					aria-label={`Copy npm install command: ${installCommand}`}
					className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45"
				>
					<span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
						<TerminalSquareIcon className="size-3.5" />
					</span>
					<code className="block min-w-0 max-w-full overflow-x-auto whitespace-nowrap font-mono text-xs font-semibold text-foreground sm:text-sm">
						{installCommand}
					</code>
				</button>
				<div className="border-l border-primary/15 p-1.5">
					<Button
						type="button"
						variant={installCopied ? "secondary" : "ghost"}
						size="icon"
						className="size-8 hover:bg-primary/10"
						onClick={handleCopyInstallCommand}
						aria-label={
							installCopied
								? "Install command copied"
								: "Copy install command"
						}
					>
						{installCopied ? (
							<CheckIcon className="size-4" />
						) : (
							<CopyIcon className="size-4" />
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
