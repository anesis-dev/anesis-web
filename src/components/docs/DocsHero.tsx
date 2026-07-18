import type { LucideIcon } from "lucide-react";

interface DocsHeroProps {
	eyebrow: string;
	eyebrowIcon: LucideIcon;
	title: string;
	description: React.ReactNode;
	chips?: string[];
	actions?: React.ReactNode;
}


export function DocsHero({
	eyebrow,
	eyebrowIcon: EyebrowIcon,
	title,
	description,
	chips,
	actions,
}: DocsHeroProps) {
	return (
		<header className="flex flex-col gap-5 border-b pb-8">
			<div className="inline-flex w-fit items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
				<EyebrowIcon className="size-3.5 text-primary" />
				{eyebrow}
			</div>

			<div className="max-w-4xl space-y-3">
				<h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
					{title}
				</h1>
				<p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
					{description}
				</p>
			</div>

			{chips && chips.length > 0 ? (
				<div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
					{chips.map((chip) => (
						<span
							key={chip}
							className="rounded-full border bg-card px-3 py-1"
						>
							{chip}
						</span>
					))}
				</div>
			) : null}

			{actions ? (
				<div className="flex flex-wrap gap-3 pt-1">{actions}</div>
			) : null}
		</header>
	);
}
