"use client";

import Link from "next/link";
import { use } from "react";
import {
	AlertCircleIcon,
	ArrowLeftIcon,
	Clock3Icon,
	ExternalLinkIcon,
	GitBranchIcon,
	PackageIcon,
	TagIcon,
	UserIcon,
} from "lucide-react";
import { useTemplate } from "@/hooks/useTemplate";
import { getTemplateRef } from "@/lib/template-ref";
import { TemplateApiUrlButton } from "@/components/templates/TemplateApiUrlButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Pill({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground">
			{children}
		</span>
	);
}

export default function TemplateDetailsPage({
	params,
}: {
	params: Promise<{ templateRef: string[] }>;
}) {
	const { templateRef } = use(params);
	const joinedRef = templateRef.map((segment) => decodeURIComponent(segment)).join("/");
	const { template, isLoading, isError } = useTemplate(joinedRef);

	if (isLoading) {
		return (
			<div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-5 lg:px-8">
				<div className="h-4 w-32 animate-pulse rounded bg-muted" />
				<div className="h-40 animate-pulse rounded-3xl border bg-card" />
				<div className="grid gap-4 lg:grid-cols-2">
					<div className="h-48 animate-pulse rounded-2xl border bg-card" />
					<div className="h-48 animate-pulse rounded-2xl border bg-card" />
				</div>
			</div>
		);
	}

	if (isError || !template) {
		return (
			<div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-5">
				<AlertCircleIcon className="size-10 text-muted-foreground" />
				<div>
					<p className="text-lg font-semibold">Template not found</p>
					<p className="mt-1 text-sm text-muted-foreground">
						The template reference{" "}
						<span className="font-mono text-foreground">{joinedRef}</span> could
						not be loaded.
					</p>
				</div>
				<Button asChild variant="outline">
					<Link href="/templates">
						<ArrowLeftIcon className="size-4" />
						Back to templates
					</Link>
				</Button>
			</div>
		);
	}

	const canonicalRef = getTemplateRef(template);

	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-5 lg:px-8">
			<div>
				<Link
					href="/templates"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeftIcon className="size-4" />
					Back to templates
				</Link>
			</div>

			<Card className="rounded-3xl">
				<CardHeader className="gap-4">
					<div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
						<div className="space-y-3">
							<div className="flex flex-wrap items-center gap-2">
								{template.official ? <Pill>Official</Pill> : <Pill>Community</Pill>}
								<Pill>{template.config.specialization || "general"}</Pill>
								<Pill>{template.config.scope || "unspecified scope"}</Pill>
							</div>
							<div>
								<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
									{template.config.metadata.displayName}
								</h1>
								<p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
									{template.config.metadata.description}
								</p>
							</div>
						</div>

						<div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
							<Button asChild variant="outline">
								<Link
									href={template.config.repository.url}
									target="_blank"
									rel="noopener noreferrer"
								>
									<ExternalLinkIcon className="size-4" />
									Open repository
								</Link>
							</Button>
							<TemplateApiUrlButton templateRef={canonicalRef} />
						</div>
					</div>
				</CardHeader>
				<CardContent className="grid gap-3 border-t pt-6 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
					<div>
						<p className="text-xs uppercase tracking-wide">Reference</p>
						<p className="mt-1 font-mono text-foreground">{canonicalRef}</p>
					</div>
					<div>
						<p className="text-xs uppercase tracking-wide">Version</p>
						<p className="mt-1 text-foreground">{template.version}</p>
					</div>
					<div>
						<p className="text-xs uppercase tracking-wide">Published</p>
						<p className="mt-1 text-foreground">
							{new Date(template.created_at).toLocaleDateString("en-US", {
								year: "numeric",
								month: "short",
								day: "numeric",
							})}
						</p>
					</div>
					<div>
						<p className="text-xs uppercase tracking-wide">Updated</p>
						<p className="mt-1 text-foreground">
							{new Date(template.updated_at).toLocaleDateString("en-US", {
								year: "numeric",
								month: "short",
								day: "numeric",
							})}
						</p>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-4 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base">
							<UserIcon className="size-4 text-muted-foreground" />
							Author and Source
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4 text-sm text-muted-foreground">
						<div>
							<p className="text-xs uppercase tracking-wide">Author</p>
							<Link
								href={`/user/${template.config.author.github}`}
								className="mt-1 inline-flex items-center gap-2 font-mono text-foreground transition-colors hover:text-primary"
							>
								@{template.config.author.github}
							</Link>
						</div>
						<div>
							<p className="text-xs uppercase tracking-wide">Source URL</p>
							<p className="mt-1 break-all font-mono text-xs text-foreground">
								{template.url}
							</p>
						</div>
						<div>
							<p className="text-xs uppercase tracking-wide">Commit SHA</p>
							<p className="mt-1 break-all font-mono text-xs text-foreground">
								{template.commit_sha}
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base">
							<PackageIcon className="size-4 text-muted-foreground" />
							Classification
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4 text-sm text-muted-foreground">
						<div>
							<p className="text-xs uppercase tracking-wide">Type</p>
							<p className="mt-1 text-foreground">{template.config.type}</p>
						</div>
						<div>
							<p className="text-xs uppercase tracking-wide">Repository type</p>
							<p className="mt-1 text-foreground">{template.config.repository.type}</p>
						</div>
						<div>
							<p className="text-xs uppercase tracking-wide">Release</p>
							<p className="mt-1 text-foreground">{template.config.repository.release}</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				<Card className="lg:col-span-1">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base">
							<GitBranchIcon className="size-4 text-muted-foreground" />
							Technologies
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-2">
						{template.config.technologies.length > 0 ? (
							template.config.technologies.map((tech) => <Pill key={tech}>{tech}</Pill>)
						) : (
							<p className="text-sm text-muted-foreground">No technologies listed.</p>
						)}
					</CardContent>
				</Card>

				<Card className="lg:col-span-1">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base">
							<Clock3Icon className="size-4 text-muted-foreground" />
							Languages
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-2">
						{template.config.languages.length > 0 ? (
							template.config.languages.map((language) => (
								<Pill key={language}>{language}</Pill>
							))
						) : (
							<p className="text-sm text-muted-foreground">No languages listed.</p>
						)}
					</CardContent>
				</Card>

				<Card className="lg:col-span-1">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base">
							<TagIcon className="size-4 text-muted-foreground" />
							Tags
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-2">
						{template.config.metadata.tags.length > 0 ? (
							template.config.metadata.tags.map((tag) => <Pill key={tag}>{tag}</Pill>)
						) : (
							<p className="text-sm text-muted-foreground">No tags listed.</p>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
