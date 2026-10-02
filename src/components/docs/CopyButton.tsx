"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);

	async function handleCopy() {
		if (!navigator.clipboard?.writeText) {
			return;
		}

		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1600);
		} catch {}
	}

	return (
		<Button type="button" size="sm" variant="ghost" onClick={handleCopy}>
			{copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
			{copied ? "Copied" : "Copy"}
		</Button>
	);
}
