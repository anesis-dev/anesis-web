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
		<div className="rounded-2xl border bg-muted/40">
			<div className="flex items-center justify-end border-b px-2 py-2">
				<Button type="button" size="sm" variant="ghost" onClick={handleCopy}>
					{copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
					{copied ? "Copied" : "Copy"}
				</Button>
			</div>
			<pre className="overflow-x-auto p-4 text-sm leading-6">
				<code>{code}</code>
			</pre>
		</div>
	);
}
