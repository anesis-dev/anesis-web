import type { ReactNode } from "react";

export function LegalPage({
	title,
	lastUpdated,
	intro,
	children,
}: {
	title: string;
	lastUpdated: string;
	intro: string;
	children: ReactNode;
}) {
	return (
		<article className="mx-auto w-full max-w-3xl px-5 py-14 lg:px-8">
			<h1 className="text-3xl font-bold tracking-tight">{title}</h1>
			<p className="mt-2 text-sm text-muted-foreground">
				Last updated: {lastUpdated}
			</p>
			<p className="mt-6 text-sm leading-7 text-muted-foreground">{intro}</p>
			<div className="mt-10 flex flex-col gap-8">{children}</div>
		</article>
	);
}

export function LegalSection({
	heading,
	children,
}: {
	heading: string;
	children: ReactNode;
}) {
	return (
		<section className="space-y-3">
			<h2 className="text-xl font-semibold tracking-tight">{heading}</h2>
			<div className="space-y-3 text-sm leading-7 text-muted-foreground">
				{children}
			</div>
		</section>
	);
}

export function LegalList({ items }: { items: ReactNode[] }) {
	return (
		<ul className="list-disc space-y-2 pl-5">
			{items.map((item, i) => (
				<li key={i}>{item}</li>
			))}
		</ul>
	);
}
