import Link from "next/link";
import { getTemplateHref } from "@/lib/template-ref";
import { ITemplate } from "@/types/template";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import {
	ShieldCheckIcon,
	TagIcon,
	CodeIcon,
	GlobeIcon,
	ExternalLinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
	template: ITemplate;
}

function Badge({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
				className,
			)}
		>
			{children}
		</span>
	);
}

export function TemplateCard({ template }: TemplateCardProps) {
	const { config } = template;
	const { metadata, author, technologies, languages, official } = config;
	const detailsHref = getTemplateHref(template);

	return (
		<Card className="gap-4 py-5 h-full transition-colors hover:border-foreground/30">
			<CardHeader className="gap-1.5 pb-0">
				<div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between">
					<CardTitle className="text-base leading-snug">
						<Link href={detailsHref} className="transition-colors hover:text-primary">
							{metadata.displayName}
						</Link>
					</CardTitle>
					{official && (
						<span className="flex items-center gap-1 shrink-0 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
							<ShieldCheckIcon className="size-3" />
							Official
						</span>
					)}
				</div>
				<CardDescription className="line-clamp-2 text-xs leading-relaxed">
					{metadata.description}
				</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-col gap-3">
				{/* Technologies */}
				{technologies.length > 0 && (
					<div className="flex flex-wrap items-center gap-1.5">
						<CodeIcon className="size-3.5 shrink-0 text-muted-foreground" />
						{technologies.map((tech) => (
							<Badge
								key={tech}
								className="border-blue-500/30 bg-blue-500/10 text-blue-400"
							>
								{tech}
							</Badge>
						))}
					</div>
				)}

				{/* Languages */}
				{languages.length > 0 && (
					<div className="flex flex-wrap items-center gap-1.5">
						<GlobeIcon className="size-3.5 shrink-0 text-muted-foreground" />
						{languages.map((lang) => (
							<Badge
								key={lang}
								className="border-violet-500/30 bg-violet-500/10 text-violet-400"
							>
								{lang}
							</Badge>
						))}
					</div>
				)}

				{/* Tags */}
				{metadata.tags.length > 0 && (
					<div className="flex flex-wrap items-center gap-1.5">
						<TagIcon className="size-3.5 shrink-0 text-muted-foreground" />
						{metadata.tags.map((tag) => (
							<Badge
								key={tag}
								className="border-border bg-muted/40 text-muted-foreground"
							>
								{tag}
							</Badge>
						))}
					</div>
				)}
			</CardContent>

			<CardFooter className="mt-auto flex flex-col items-start gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
				{/* Author */}
				<Link
					href={`/user/${author.github}`}
					className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
				>
					<GitHubIcon className="size-3.5" />
					{author.github}
				</Link>

				<div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
					{/* Version */}
					<span className="font-mono text-[11px] text-muted-foreground">
						v{config.version}
					</span>

					<div className="flex items-center gap-1.5">
						<Button asChild size="icon-xs" variant="ghost" className="shrink-0">
							<Link
								href={config.repository.url}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={`Open repository for ${metadata.displayName}`}
							>
								<ExternalLinkIcon />
							</Link>
						</Button>

						<Button asChild size="xs" variant="outline" className="shrink-0">
							<Link href={detailsHref}>Details</Link>
						</Button>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}
