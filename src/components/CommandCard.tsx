"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CommandCard({
	label,
	command,
	helper,
	copyLabel,
	className,
}: {
	label: string;
	command: string;
	helper?: string;
	copyLabel?: string;
	className?: string;
}) {
	const [copied, setCopied] = useState(false);

	async function handleCopy() {
		if (!navigator.clipboard?.writeText) {
			return;
		}

		try {
			await navigator.clipboard.writeText(command);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1600);
		} catch {}
	}

	return (
		<div
			className={cn(
				"rounded-2xl border bg-background/80 p-4 backdrop-blur-sm dark:bg-background/30",
				className,
			)}
		>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div className="min-w-0">
					<p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
						{label}
					</p>
					{helper ? (
						<p className="mt-2 text-sm text-muted-foreground">{helper}</p>
					) : null}
				</div>
				<Button
					type="button"
					size="sm"
					variant="ghost"
					onClick={handleCopy}
					aria-label={copied ? `Copied ${copyLabel ?? command}` : `Copy ${copyLabel ?? command}`}
					className="w-full shrink-0 sm:w-auto"
				>
					{copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
					{copied ? "Copied" : "Copy"}
				</Button>
			</div>
			<pre className="mt-4 overflow-x-auto rounded-2xl border bg-muted/35 p-4 text-sm leading-6">
				<code>{command}</code>
			</pre>
		</div>
	);
}
