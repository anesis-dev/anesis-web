"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { AlertCircleIcon, BookOpenTextIcon, LoaderIcon } from "lucide-react";
import { createGitHubReadmeResolver } from "@/lib/github-readme-links";
import { cn } from "@/lib/utils";

const readmeSanitizeSchema = {
	...defaultSchema,
	attributes: {
		...defaultSchema.attributes,
		a: [...(defaultSchema.attributes?.a ?? []), "target", "rel"],
		img: [...(defaultSchema.attributes?.img ?? []), "width", "height"],
		p: [...(defaultSchema.attributes?.p ?? []), "align"],
	},
};

function getParagraphAlignmentClass(align?: string) {
	switch (align) {
		case "center":
			return "text-center";
		case "right":
			return "text-right";
		case "left":
			return "text-left";
		default:
			return "";
	}
}

function isCompactReadmeImage({
	src,
	alt,
	width,
}: {
	src?: string;
	alt?: string;
	width?: number | string;
}) {
	const normalizedSrc = src?.toLowerCase() ?? "";
	const normalizedAlt = alt?.toLowerCase() ?? "";
	const numericWidth =
		typeof width === "number"
			? width
			: typeof width === "string"
				? Number.parseInt(width, 10)
				: Number.NaN;

	return (
		Number.isFinite(numericWidth) && numericWidth <= 180 ||
		/img\.shields\.io|badge\.svg|logo-small\.svg/.test(normalizedSrc) ||
		/logo|badge|version|license|downloads|discord|circleci|backers|sponsors|donate|support|follow/i.test(
			normalizedAlt,
		)
	);
}

export function TemplateReadme({
	content,
	fileName,
	sourceUrl,
	sourcePath,
	isLoading,
	isError,
	className,
}: {
	content: string | null;
	fileName?: string;
	sourceUrl?: string;
	sourcePath?: string;
	isLoading?: boolean;
	isError?: boolean;
	className?: string;
}) {
	const resolver = createGitHubReadmeResolver(sourceUrl, sourcePath);

	if (isLoading) {
		return (
			<div className={cn("rounded-3xl border bg-card p-6", className)}>
				<div className="mb-5 flex items-center gap-2">
					<LoaderIcon className="size-4 animate-spin text-muted-foreground" />
					<p className="text-sm text-muted-foreground">Loading README...</p>
				</div>
				<div className="space-y-3 animate-pulse">
					<div className="h-7 w-2/5 rounded bg-muted" />
					<div className="h-4 w-full rounded bg-muted" />
					<div className="h-4 w-11/12 rounded bg-muted" />
					<div className="h-4 w-10/12 rounded bg-muted" />
					<div className="h-32 w-full rounded-2xl bg-muted" />
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className={cn("rounded-3xl border bg-card p-6", className)}>
				<div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-destructive">
					<AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
					<div>
						<p className="font-medium">README could not be loaded</p>
						<p className="mt-1 text-sm text-destructive/80">
							GitHub responded, but the README content was unavailable.
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (!content) {
		return (
			<div className={cn("rounded-3xl border bg-card p-6", className)}>
				<div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-14 text-center">
					<BookOpenTextIcon className="size-8 text-muted-foreground" />
					<div>
						<p className="font-medium">README not found</p>
						<p className="mt-1 text-sm text-muted-foreground">
							This template directory does not expose a `README.md` file.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={cn("min-w-0 max-w-full overflow-hidden rounded-3xl border bg-card p-6 sm:p-8", className)}>
			<div className="mb-6 flex flex-wrap items-center gap-3 border-b pb-5">
				<div>
					<p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
						README
					</p>
					<h2 className="mt-1 text-2xl font-semibold tracking-tight">
						{fileName ?? "README.md"}
					</h2>
				</div>
			</div>

			<div className="template-readme min-w-0 max-w-full">
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					rehypePlugins={[rehypeRaw, [rehypeSanitize, readmeSanitizeSchema]]}
					components={{
						a: ({ className: markdownClassName, href = "", ...props }) => {
							const resolvedHref =
								typeof href === "string" ? (resolver?.resolveLink(href) ?? href) : undefined;

							return (
							<a
								{...props}
								href={resolvedHref}
								className={cn(
									"break-words font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-foreground",
									markdownClassName,
								)}
								target="_blank"
								rel="noopener noreferrer"
							/>
							);
						},
						img: ({
							className: markdownClassName,
							src = "",
							alt = "",
							width,
							...props
						}) => {
							const resolvedSrc =
								typeof src === "string" ? (resolver?.resolveImage(src) ?? src) : undefined;
							const compactImage = isCompactReadmeImage({ src: resolvedSrc, alt, width });

							return (
							<img
								{...props}
								src={resolvedSrc}
								alt={alt}
								width={width}
								loading="lazy"
								className={cn(
									compactImage
										? "my-1 inline-block h-auto max-w-full rounded-none border-0 bg-transparent align-middle shadow-none"
										: "my-6 block h-auto max-w-full rounded-2xl border bg-card object-contain shadow-sm",
									markdownClassName,
								)}
							/>
							);
						},
						code: ({ className: markdownClassName, ...props }) => (
							<code
								{...props}
								className={cn(
									"break-all rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]",
									markdownClassName,
								)}
							/>
						),
						pre: ({ className: markdownClassName, ...props }) => (
							<pre
								{...props}
								className={cn(
									"max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-2xl border bg-muted/35 p-4 text-sm leading-6 sm:whitespace-pre [&_code]:block [&_code]:min-w-0 [&_code]:bg-transparent [&_code]:p-0",
									markdownClassName,
								)}
							/>
						),
						h1: ({ className: markdownClassName, ...props }) => (
							<h1
								{...props}
								className={cn(
									"scroll-m-20 break-words text-3xl font-bold tracking-tight sm:text-4xl",
									markdownClassName,
								)}
							/>
						),
						h2: ({ className: markdownClassName, ...props }) => (
							<h2
								{...props}
								className={cn(
									"mt-10 scroll-m-20 break-words border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0",
									markdownClassName,
								)}
							/>
						),
						h3: ({ className: markdownClassName, ...props }) => (
							<h3
								{...props}
								className={cn(
									"mt-8 scroll-m-20 break-words text-xl font-semibold tracking-tight",
									markdownClassName,
								)}
							/>
						),
						p: ({ className: markdownClassName, ...props }) => {
							const align = Reflect.get(props, "align");

							return (
								<p
									{...props}
									className={cn(
										"break-words leading-7 text-foreground/90 [&:not(:first-child)]:mt-5",
										getParagraphAlignmentClass(
											typeof align === "string" ? align : undefined,
										),
										markdownClassName,
									)}
								/>
							);
						},
						ul: ({ className: markdownClassName, ...props }) => (
							<ul
								{...props}
								className={cn(
									"my-5 ml-6 break-words list-disc space-y-2 text-foreground/90",
									markdownClassName,
								)}
							/>
						),
						ol: ({ className: markdownClassName, ...props }) => (
							<ol
								{...props}
								className={cn(
									"my-5 ml-6 break-words list-decimal space-y-2 text-foreground/90",
									markdownClassName,
								)}
							/>
						),
						blockquote: ({ className: markdownClassName, ...props }) => (
							<blockquote
								{...props}
								className={cn(
									"my-6 break-words border-l-2 border-primary/35 pl-5 italic text-muted-foreground",
									markdownClassName,
								)}
							/>
						),
						table: ({ className: markdownClassName, ...props }) => (
							<div className="my-6 max-w-full overflow-x-auto rounded-2xl border">
								<table
									{...props}
									className={cn("min-w-full text-sm", markdownClassName)}
								/>
							</div>
						),
						th: ({ className: markdownClassName, ...props }) => (
							<th
								{...props}
								className={cn(
									"break-words border-b bg-muted/40 px-3 py-2 text-left font-medium",
									markdownClassName,
								)}
							/>
						),
						td: ({ className: markdownClassName, ...props }) => (
							<td
								{...props}
								className={cn("break-words border-b px-3 py-2 align-top", markdownClassName)}
							/>
						),
					}}
				>
					{content}
				</ReactMarkdown>
			</div>
		</div>
	);
}
