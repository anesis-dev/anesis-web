import { cn } from "@/lib/utils";


export function Markup({ children }: { children: string }) {
	const parts = children.split(/(`[^`]+`)/g);
	return (
		<>
			{parts.map((part, index) =>
				part.startsWith("`") && part.endsWith("`") ? (
					<code
						key={index}
						className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
					>
						{part.slice(1, -1)}
					</code>
				) : (
					part
				),
			)}
		</>
	);
}

/**
 * A flowing documentation section: an h2 heading (anchored for the on-this-page
 * nav), an optional lead paragraph, and stacked prose content. Sections are
 * separated by a top divider so the page reads top-to-bottom without cards.
 */
export function DocsSection({
	id,
	title,
	lead,
	children,
}: {
	id: string;
	title: string;
	lead?: React.ReactNode;
	children?: React.ReactNode;
}) {
	return (
		<section
			id={id}
			className="scroll-mt-24 border-t pt-10 first:border-t-0 first:pt-0"
		>
			<h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
				{title}
			</h2>
			{lead ? (
				<p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
					{lead}
				</p>
			) : null}
			{children ? (
				<div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground sm:text-[0.9375rem]">
					{children}
				</div>
			) : null}
		</section>
	);
}

/** An anchored h3 subheading used inside a {@link DocsSection}. */
export function DocsSubheading({
	id,
	children,
}: {
	id: string;
	children: React.ReactNode;
}) {
	return (
		<h3
			id={id}
			className="scroll-mt-24 pt-2 text-base font-semibold text-foreground"
		>
			{children}
		</h3>
	);
}

/** A prose bullet or numbered list. Items may contain `backtick` code. */
export function DocsList({
	items,
	ordered = false,
}: {
	items: string[];
	ordered?: boolean;
}) {
	const Tag = ordered ? "ol" : "ul";
	return (
		<Tag
			className={cn(
				"space-y-2 pl-5 marker:text-muted-foreground/60",
				ordered ? "list-decimal" : "list-disc",
			)}
		>
			{items.map((item) => (
				<li key={item} className="pl-1">
					<Markup>{item}</Markup>
				</li>
			))}
		</Tag>
	);
}
