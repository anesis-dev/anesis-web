"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CodeBlock({ code }: { code: string }) {
	const [copied, setCopied] = useState(false);

	async function handleCopy() {
		if (!navigator.clipboard?.writeText) {
			return;
		}

		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1600);
		} catch {}
	}

	return (
		<div className="min-w-0 max-w-full overflow-hidden rounded-2xl border bg-muted/40">
			<div className="flex items-center justify-end border-b px-2 py-2">
				<Button type="button" size="sm" variant="ghost" onClick={handleCopy}>
					{copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
					{copied ? "Copied" : "Copy"}
				</Button>
			</div>
			<pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words p-4 text-sm leading-6 sm:whitespace-pre">
				<code className="block min-w-0 font-mono">{code}</code>
			</pre>
		</div>
	);
}
