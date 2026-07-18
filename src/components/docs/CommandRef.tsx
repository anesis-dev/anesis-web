import { CodeBlock } from "@/components/docs/CodeBlock";

export interface CommandArg {
	name: string;
	description: string;
}

export interface CommandRefData {
	
	command: string;
	
	aliases?: string[];
	
	summary: string;
	
	usage: string;
	
	args?: CommandArg[];
	
	flags?: CommandArg[];
	
	example?: string;
	
	id: string;
}

function ArgList({ title, items }: { title: string; items: CommandArg[] }) {
	return (
		<div className="space-y-2">
			<p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
				{title}
			</p>
			<ul className="space-y-1.5">
				{items.map((item) => (
					<li key={item.name} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
						<code className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground sm:min-w-44">
							{item.name}
						</code>
						<span className="text-sm text-muted-foreground">
							{item.description}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}


export function CommandRef({ data }: { data: CommandRefData }) {
	return (
		<div id={data.id} className="scroll-mt-24 space-y-4 rounded-2xl border bg-card p-5 sm:p-6">
			<div className="space-y-2">
				<div className="flex flex-wrap items-center gap-2">
					<h3 className="font-mono text-base font-semibold text-foreground">
						{data.command}
					</h3>
					{data.aliases?.map((alias) => (
						<span
							key={alias}
							className="rounded-md border bg-muted/50 px-2 py-0.5 font-mono text-xs text-muted-foreground"
						>
							{alias}
						</span>
					))}
				</div>
				<p className="text-sm leading-6 text-muted-foreground">{data.summary}</p>
			</div>

			<div className="space-y-2">
				<p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
					Usage
				</p>
				<code className="block overflow-x-auto rounded-lg border bg-muted/40 px-3 py-2 font-mono text-xs text-foreground">
					{data.usage}
				</code>
			</div>

			{data.args && data.args.length > 0 ? (
				<ArgList title="Arguments" items={data.args} />
			) : null}

			{data.flags && data.flags.length > 0 ? (
				<ArgList title="Flags" items={data.flags} />
			) : null}

			{data.example ? (
				<div className="space-y-2">
					<p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
						Example
					</p>
					<CodeBlock code={data.example} />
				</div>
			) : null}
		</div>
	);
}
