"use client";

import Link from "next/link";
import { use } from "react";
import {
	AlertCircleIcon,
	ArrowLeftIcon,
	ArrowUpRightIcon,
	BadgeInfoIcon,
	BookOpenTextIcon,
	CalendarDaysIcon,
	ExternalLinkIcon,
	GitBranchIcon,
	GlobeIcon,
	LinkIcon,
	PackageIcon,
	ShieldCheckIcon,
	TagIcon,
	UserIcon,
} from "lucide-react";
import { useTemplate } from "@/hooks/useTemplate";
import { useTemplateReadme } from "@/hooks/useTemplateReadme";
import { getTemplateRef } from "@/lib/template-ref";
import { TemplateReadme } from "@/components/templates/TemplateReadme";
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

function MetaItem({
	label,
	value,
	icon: Icon,
}: {
	label: string;
	value: React.ReactNode;
	icon: React.ElementType;
}) {
	return (
		<div className="rounded-2xl border bg-background/70 p-4">
			<div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
				<Icon className="size-3.5" />
				<span>{label}</span>
			</div>
			<div className="mt-3 text-sm text-foreground">{value}</div>
		</div>
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
	const {
		readme,
		fileName,
		isLoading: isReadmeLoading,
		isError: isReadmeError,
	} = useTemplateReadme(template?.url);

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
	const publishedAt = new Date(template.created_at).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
	const updatedAt = new Date(template.updated_at).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-5 lg:px-8 lg:py-10">
			<div>
				<Link
					href="/templates"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeftIcon className="size-4" />
					Back to templates
				</Link>
			</div>

			<section className="relative overflow-hidden rounded-[2rem] border bg-card">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.08),transparent_34%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_28%),linear-gradient(180deg,rgba(248,250,252,0.92),rgba(255,255,255,1))]" />
				<div className="relative flex flex-col gap-8 p-6 sm:p-8 lg:p-10">
					<div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
						<div className="max-w-4xl space-y-5">
							<div className="flex flex-wrap items-center gap-2">
								{template.official ? (
									<Pill>
										<ShieldCheckIcon className="mr-1 size-3.5" />
										Official
									</Pill>
								) : (
									<Pill>Community</Pill>
								)}
								<Pill>{template.config.specialization || "general"}</Pill>
								<Pill>{template.config.scope || "unspecified scope"}</Pill>
								<Pill>{template.config.type}</Pill>
							</div>

							<div>
								<p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
									Template Profile
								</p>
								<h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
									{template.config.metadata.displayName}
								</h1>
								<p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
									{template.config.metadata.description}
								</p>
							</div>

							<div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
								<Link
									href={`/user/${template.config.author.github}`}
									className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 font-mono transition-colors hover:text-foreground"
								>
									<UserIcon className="size-3.5" />
									@{template.config.author.github}
								</Link>
								<span className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 font-mono">
									<BadgeInfoIcon className="size-3.5" />
									{canonicalRef}
								</span>
							</div>
						</div>

						<div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto xl:flex-col">
							<Button asChild size="lg" className="sm:flex-1 xl:flex-none">
								<Link
									href={template.config.repository.url}
									target="_blank"
									rel="noopener noreferrer"
								>
									<ExternalLinkIcon className="size-4" />
									Open repository
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline" className="sm:flex-1 xl:flex-none">
								<Link href={`https://github.com/${template.config.author.github}`}>
									<ArrowUpRightIcon className="size-4" />
									Author profile
								</Link>
							</Button>
							<TemplateApiUrlButton
								templateRef={canonicalRef}
								size="lg"
								variant="outline"
								className="sm:flex-1 xl:flex-none"
							/>
						</div>
					</div>

					<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
						<MetaItem
							label="Version"
							icon={PackageIcon}
							value={<span className="font-mono text-base">{template.version}</span>}
						/>
						<MetaItem
							label="Published"
							icon={CalendarDaysIcon}
							value={publishedAt}
						/>
						<MetaItem
							label="Updated"
							icon={CalendarDaysIcon}
							value={updatedAt}
						/>
						<MetaItem
							label="README"
							icon={BookOpenTextIcon}
							value={fileName ?? "README.md not found"}
						/>
					</div>
				</div>
			</section>

			<div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
				<TemplateReadme
					content={readme}
					fileName={fileName}
					isLoading={isReadmeLoading}
					isError={isReadmeError}
				/>

				<div className="flex flex-col gap-6">
					<Card className="rounded-3xl">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<UserIcon className="size-4 text-muted-foreground" />
								Author and Source
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-5 text-sm text-muted-foreground">
							<div>
								<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
									Author
								</p>
								<Link
									href={`/user/${template.config.author.github}`}
									className="mt-2 inline-flex items-center gap-2 font-mono text-foreground transition-colors hover:text-primary"
								>
									@{template.config.author.github}
								</Link>
							</div>
							<div>
								<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
									Source URL
								</p>
								<p className="mt-2 break-all rounded-2xl border bg-muted/25 p-3 font-mono text-xs text-foreground">
									{template.url}
								</p>
							</div>
							<div>
								<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
									Commit SHA
								</p>
								<p className="mt-2 break-all rounded-2xl border bg-muted/25 p-3 font-mono text-xs text-foreground">
									{template.commit_sha}
								</p>
							</div>
						</CardContent>
					</Card>

					<Card className="rounded-3xl">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<PackageIcon className="size-4 text-muted-foreground" />
								Classification
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-5 text-sm text-muted-foreground">
							<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
								<div>
									<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
										Type
									</p>
									<p className="mt-2 text-foreground">{template.config.type}</p>
								</div>
								<div>
									<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
										Repository type
									</p>
									<p className="mt-2 text-foreground">
										{template.config.repository.type}
									</p>
								</div>
								<div>
									<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
										Release
									</p>
									<p className="mt-2 text-foreground">
										{template.config.repository.release}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="rounded-3xl">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<GitBranchIcon className="size-4 text-muted-foreground" />
								Stack
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-5">
							<div>
								<p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
									Technologies
								</p>
								<div className="flex flex-wrap gap-2">
									{template.config.technologies.length > 0 ? (
										template.config.technologies.map((tech) => (
											<Pill key={tech}>{tech}</Pill>
										))
									) : (
										<p className="text-sm text-muted-foreground">
											No technologies listed.
										</p>
									)}
								</div>
							</div>

							<div>
								<p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
									Languages
								</p>
								<div className="flex flex-wrap gap-2">
									{template.config.languages.length > 0 ? (
										template.config.languages.map((language) => (
											<Pill key={language}>{language}</Pill>
										))
									) : (
										<p className="text-sm text-muted-foreground">
											No languages listed.
										</p>
									)}
								</div>
							</div>

							<div>
								<p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
									Tags
								</p>
								<div className="flex flex-wrap gap-2">
									{template.config.metadata.tags.length > 0 ? (
										template.config.metadata.tags.map((tag) => (
											<Pill key={tag}>{tag}</Pill>
										))
									) : (
										<p className="text-sm text-muted-foreground">
											No tags listed.
										</p>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="rounded-3xl">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<LinkIcon className="size-4 text-muted-foreground" />
								Quick links
							</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col gap-3">
							<Button asChild variant="outline" className="justify-between">
								<Link
									href={template.config.repository.url}
									target="_blank"
									rel="noopener noreferrer"
								>
									<span className="inline-flex items-center gap-2">
										<ExternalLinkIcon className="size-4" />
										Open GitHub folder
									</span>
									<ArrowUpRightIcon className="size-4" />
								</Link>
							</Button>
							<Button asChild variant="outline" className="justify-between">
								<Link href={`/user/${template.config.author.github}`}>
									<span className="inline-flex items-center gap-2">
										<GlobeIcon className="size-4" />
										Author page
									</span>
									<ArrowUpRightIcon className="size-4" />
								</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
