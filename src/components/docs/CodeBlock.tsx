"use client";

import { useMemo, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import ini from "highlight.js/lib/languages/ini";
import typescript from "highlight.js/lib/languages/typescript";
import yaml from "highlight.js/lib/languages/yaml";
import plaintext from "highlight.js/lib/languages/plaintext";
import { Button } from "@/components/ui/button";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("json", json);
hljs.registerLanguage("toml", ini);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("plaintext", plaintext);

export function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
	const [copied, setCopied] = useState(false);

	const highlighted = useMemo(() => {
		const language = hljs.getLanguage(lang) ? lang : "plaintext";
		return hljs.highlight(code, { language }).value;
	}, [code, lang]);

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
				<code
					className="hljs block min-w-0 bg-transparent font-mono"
					dangerouslySetInnerHTML={{ __html: highlighted }}
				/>
			</pre>
		</div>
	);
}
