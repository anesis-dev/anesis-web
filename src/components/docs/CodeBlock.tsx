export function CodeBlock({ code }: { code: string }) {
	return (
		<pre className="overflow-x-auto rounded-2xl border bg-muted/40 p-4 text-sm leading-6">
			<code>{code}</code>
		</pre>
	);
}
