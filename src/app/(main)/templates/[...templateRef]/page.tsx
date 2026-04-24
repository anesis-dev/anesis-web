"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
	ActivityIcon,
	AlertCircleIcon,
	ArrowLeftIcon,
	BadgeInfoIcon,
	BookOpenTextIcon,
	CalendarDaysIcon,
	CheckIcon,
	ChevronDownIcon,
	CopyIcon,
	ExternalLinkIcon,
	GitBranchIcon,
	LinkIcon,
	LoaderIcon,
	PackageIcon,
	ScaleIcon,
	ShieldCheckIcon,
	ShieldOffIcon,
	TerminalSquareIcon,
	UserIcon,
} from "lucide-react";
import { formatDate } from "@/lib/date";
import { parseGitHubTreeUrl } from "@/lib/github-tree-url";
import { useAuth } from "@/hooks/useAuth";
import { useTemplate } from "@/hooks/useTemplate";
import { useTemplateVersions } from "@/hooks/useTemplateVersions";
import { useTemplateReadme } from "@/hooks/useTemplateReadme";
import { getTemplateHref, getTemplateRef } from "@/lib/template-ref";
import { TemplateReadme } from "@/components/templates/TemplateReadme";
import { TemplateApiUrlButton } from "@/components/templates/TemplateApiUrlButton";
import { updateTemplateOfficialStatus } from "@/services/template";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Pill({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<span className="inline-flex max-w-full items-center justify-center rounded-full border bg-background/75 px-2.5 py-1 text-center text-xs font-medium text-muted-foreground backdrop-blur-sm break-words dark:bg-background/20">
			{children}
		</span>
	);
}

type Notice =
	| { type: "success"; message: string }
	| { type: "error"; message: string }
	| null;

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
		<div className="min-w-0 rounded-2xl border bg-background/80 p-4 backdrop-blur-sm dark:bg-background/30">
			<div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
				<Icon className="size-3.5" />
				<span>{label}</span>
			</div>
			<div className="mt-3 min-w-0 break-words text-sm text-foreground">{value}</div>
		</div>
	);
}

function CommandCard({
	label,
	command,
	helper,
}: {
	label: string;
	command: string;
	helper: string;
}) {
	const [copied, setCopied] = useState(false);

	async function handleCopy() {
		if (!navigator.clipboard?.writeText) {
			return;
		}

		try {
			await navigator.clipboard.writeText(command);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1600);
		} catch {}
	}

	return (
		<div className="rounded-2xl border bg-background/80 p-4 backdrop-blur-sm dark:bg-background/30">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
						{label}
					</p>
					<p className="mt-2 text-sm text-muted-foreground">{helper}</p>
				</div>
				<Button
					type="button"
					size="sm"
					variant="ghost"
					onClick={handleCopy}
					className="w-full shrink-0 sm:w-auto"
				>
					{copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
					{copied ? "Copied" : "Copy"}
				</Button>
			</div>
			<pre className="mt-4 overflow-x-auto rounded-2xl border bg-muted/35 p-4 text-sm leading-6">
				<code>{command}</code>
			</pre>
		</div>
	);
}

function SnapshotCard({
	label,
	value,
	helper,
}: {
	label: string;
	value: string;
	helper: string;
}) {
	return (
		<div className="rounded-2xl border bg-background/80 p-4 backdrop-blur-sm dark:bg-background/30">
			<p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
				{label}
			</p>
			<p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
				{value}
			</p>
			<p className="mt-2 text-sm leading-6 text-muted-foreground">{helper}</p>
		</div>
	);
}

function getSourceInfo(url: string) {
	try {
		const repo = parseGitHubTreeUrl(url);

		return {
			repositoryUrl: `https://github.com/${repo.owner}/${repo.repo}`,
			branch: repo.branch ?? null,
			path: repo.path ?? null,
		};
	} catch {
		return {
			repositoryUrl: url,
			branch: null,
			path: null,
		};
	}
}

export default function TemplateDetailsPage({
	params,
}: {
	params: Promise<{ templateRef: string[] }>;
}) {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { templateRef } = use(params);
	const joinedRef = templateRef.map((segment) => decodeURIComponent(segment)).join("/");
	const { template, isLoading, isError } = useTemplate(joinedRef);
	const { versions } = useTemplateVersions(template?.name ?? "");
	const {
		readme,
		fileName,
		path,
		isLoading: isReadmeLoading,
		isError: isReadmeError,
	} = useTemplateReadme(template?.config.repository.url);
	const [notice, setNotice] = useState<Notice>(null);
	const [isOfficialPending, setIsOfficialPending] = useState(false);

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

	const currentTemplate = template;
	const canonicalRef = getTemplateRef(currentTemplate);
	const publishedAt = formatDate(currentTemplate.created_at);
	const source = getSourceInfo(currentTemplate.config.repository.url);
	const availableVersions = versions.length > 0 ? versions : [currentTemplate];
	const templateName = currentTemplate.name;
	const createCommand = `oxide new my-app ${templateName}`;
	const installCommand = `oxide template install ${templateName}`;
	const keywordCount = String(currentTemplate.config.metadata.tags.length);
	const technologyCount = String(currentTemplate.config.technologies.length);
	const languageCount = String(currentTemplate.config.languages.length);
	const versionCount = String(availableVersions.length);
	const isAdmin = user?.role === "admin";

	async function refreshTemplateQueries() {
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: ["templates"] }),
			queryClient.invalidateQueries({ queryKey: ["my-templates"] }),
			queryClient.invalidateQueries({ queryKey: ["template"] }),
			queryClient.invalidateQueries({ queryKey: ["template-versions", currentTemplate.name] }),
		]);
	}

	async function handleToggleOfficialStatus() {
		setIsOfficialPending(true);
		setNotice(null);

		try {
			const nextOfficial = !currentTemplate.official;
			await updateTemplateOfficialStatus(currentTemplate.id, nextOfficial);
			await refreshTemplateQueries();
			setNotice({
				type: "success",
				message: nextOfficial
					? `Version ${currentTemplate.version} is now marked as official.`
					: `Version ${currentTemplate.version} was moved back to community.`,
			});
		} catch (error) {
			setNotice({
				type: "error",
				message:
					error instanceof Error
						? error.message
						: "Failed to update the official status for this version.",
			});
		} finally {
			setIsOfficialPending(false);
		}
	}

	return (
		<div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-8 px-4 py-8 sm:px-5 lg:px-8 lg:py-10">
			<div>
				<Link
					href="/templates"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeftIcon className="size-4" />
					Back to templates
				</Link>
			</div>

			<section className="relative overflow-hidden rounded-[2rem] border bg-card shadow-sm">
				<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,250,252,0.8))] dark:bg-[linear-gradient(180deg,rgba(23,23,23,0.48),rgba(23,23,23,0.18))]" />
				<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
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
									Template Package
								</p>
								<h1 className="mt-3 break-words text-4xl font-black tracking-tight sm:text-5xl">
									{template.config.metadata.displayName}
								</h1>
								<p className="mt-4 max-w-3xl break-words text-base leading-7 text-muted-foreground">
									{template.config.metadata.description}
								</p>
							</div>

							<div className="flex flex-wrap items-start gap-3 text-sm text-muted-foreground">
								<Link
									href={`/user/${template.config.author.github}`}
									className="inline-flex max-w-full items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 font-mono transition-colors hover:text-foreground"
								>
									<UserIcon className="size-3.5" />
									<span className="break-all">@{template.config.author.github}</span>
								</Link>
								<span className="inline-flex max-w-full items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 font-mono">
									<BadgeInfoIcon className="size-3.5" />
									<span className="break-all">{canonicalRef}</span>
								</span>
								<span className="inline-flex max-w-full items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 font-mono">
									<PackageIcon className="size-3.5" />
									<span className="break-all">{templateName}</span>
								</span>
							</div>
						</div>

						<div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto xl:flex-col">
							<Button
								asChild
								size="lg"
								className="h-auto min-h-11 whitespace-normal px-4 py-3 text-center sm:flex-1 xl:flex-none"
							>
								<Link
									href={template.config.repository.url}
									target="_blank"
									rel="noopener noreferrer"
								>
									<ExternalLinkIcon className="size-4" />
									Open template source
								</Link>
							</Button>
							<Button
								asChild
								size="lg"
								variant="outline"
								className="h-auto min-h-11 whitespace-normal px-4 py-3 text-center sm:flex-1 xl:flex-none"
							>
								<Link
									href={source.repositoryUrl}
									target="_blank"
									rel="noopener noreferrer"
								>
									<GitBranchIcon className="size-4" />
									Open repository root
								</Link>
							</Button>
							<TemplateApiUrlButton
								templateRef={canonicalRef}
								size="lg"
								variant="outline"
								className="h-auto min-h-11 whitespace-normal px-4 py-3 text-center sm:flex-1 xl:flex-none"
							/>
							{isAdmin ? (
								<Button
									type="button"
									size="lg"
									variant={template.official ? "secondary" : "default"}
									onClick={handleToggleOfficialStatus}
									disabled={isOfficialPending}
									className="h-auto min-h-11 whitespace-normal px-4 py-3 text-center sm:flex-1 xl:flex-none"
									aria-label={
										template.official
											? `Mark version ${template.version} as community`
											: `Mark version ${template.version} as official`
									}
								>
									{isOfficialPending ? (
										<>
											<LoaderIcon className="size-4 animate-spin" />
											Updating status...
										</>
									) : template.official ? (
										<>
											<ShieldOffIcon className="size-4" />
											Mark as community
										</>
									) : (
										<>
											<ShieldCheckIcon className="size-4" />
											Mark as official
										</>
									)}
								</Button>
							) : null}
							{availableVersions.length > 1 && (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											type="button"
											size="lg"
											variant="outline"
											className="h-auto min-h-11 whitespace-normal px-4 py-3 text-center sm:flex-1 xl:flex-none"
										>
											<BadgeInfoIcon className="size-4" />
											v{template.version}
											<ChevronDownIcon className="size-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-56">
										<DropdownMenuLabel>Template versions</DropdownMenuLabel>
										{availableVersions.map((version, index) => {
											const active = version.version === template.version;

											return (
												<DropdownMenuItem key={version.id} asChild>
													<Link
														href={getTemplateHref(version)}
														className="flex w-full items-center justify-between gap-3"
													>
														<span className="font-mono">v{version.version}</span>
														<span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
															{index === 0 ? "latest" : null}
															{active ? <CheckIcon className="size-3.5" /> : null}
														</span>
													</Link>
												</DropdownMenuItem>
											);
										})}
									</DropdownMenuContent>
								</DropdownMenu>
							)}
						</div>
					</div>

					<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
						<MetaItem
							label="Package Name"
							icon={PackageIcon}
							value={<span className="break-all font-mono text-base">{templateName}</span>}
						/>
						<MetaItem
							label="Version"
							icon={BadgeInfoIcon}
							value={<span className="break-all font-mono text-base">{template.version}</span>}
						/>
						<MetaItem
							label="Published"
							icon={CalendarDaysIcon}
							value={publishedAt}
						/>
						<MetaItem
							label="README"
							icon={BookOpenTextIcon}
							value={fileName ?? "README.md not found"}
						/>
					</div>
				</div>
			</section>

			{notice ? (
				<Alert variant={notice.type === "error" ? "destructive" : "default"}>
					<AlertCircleIcon />
					<AlertTitle>
						{notice.type === "error" ? "Action failed" : "Action completed"}
					</AlertTitle>
					<AlertDescription>{notice.message}</AlertDescription>
				</Alert>
			) : null}

			<div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
				<div className="min-w-0 flex flex-col gap-6">
					<Card className="rounded-3xl">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<ActivityIcon className="size-4 text-muted-foreground" />
								Package Snapshot
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-4 sm:grid-cols-2">
							<SnapshotCard
								label="Keywords"
								value={keywordCount}
								helper="Discovery tags attached to this package page."
							/>
							<SnapshotCard
								label="Technologies"
								value={technologyCount}
								helper="Framework and tooling markers parsed from template metadata."
							/>
							<SnapshotCard
								label="Languages"
								value={languageCount}
								helper="Language signals exposed to registry filters."
							/>
							<SnapshotCard
								label="Versions"
								value={versionCount}
								helper="Published versions available under this template name."
							/>
						</CardContent>
					</Card>

					<Card className="rounded-3xl">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<TerminalSquareIcon className="size-4 text-muted-foreground" />
								Quick Start
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<CommandCard
								label="Generate a new project"
								command={createCommand}
								helper="If you already know the template name, this is the shortest path to a new project."
							/>
							<CommandCard
								label="Install template locally"
								command={installCommand}
								helper="Cache the template first if you want it available in local CLI flows."
							/>
						</CardContent>
					</Card>

					<TemplateReadme
						content={readme}
						fileName={fileName}
						sourceUrl={template.config.repository.url}
						sourcePath={path}
						isLoading={isReadmeLoading}
						isError={isReadmeError}
					/>
				</div>

				<div className="min-w-0 flex flex-col gap-6 xl:sticky xl:top-24 xl:self-start">
					<Card className="rounded-3xl">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<ScaleIcon className="size-4 text-muted-foreground" />
								Package Metadata
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-5 text-sm text-muted-foreground">
							<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
								<div>
									<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
										Registry Ref
									</p>
									<p className="mt-2 break-all font-mono text-foreground">
										{canonicalRef}
									</p>
								</div>
								<div>
									<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
										Template Name
									</p>
									<p className="mt-2 break-all font-mono text-foreground">
										{templateName}
									</p>
								</div>
								<div>
									<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
										Published
									</p>
									<p className="mt-2 text-foreground">
										{publishedAt}
									</p>
								</div>
								<div>
									<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
										Template Type
									</p>
									<p className="mt-2 text-foreground">{template.config.type}</p>
								</div>
								<div>
									<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
										Scope
									</p>
									<p className="mt-2 text-foreground">{template.config.scope}</p>
								</div>
								<div>
									<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
										Specialization
									</p>
									<p className="mt-2 break-all text-foreground">
										{template.config.specialization}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

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
								<div className="mt-2 space-y-1">
									<p className="text-foreground">
										{template.config.author.name}
									</p>
									<Link
										href={`/user/${template.config.author.github}`}
										className="inline-flex max-w-full items-center gap-2 font-mono text-foreground transition-colors hover:text-primary"
									>
										<span className="break-all">@{template.config.author.github}</span>
									</Link>
								</div>
							</div>
							<div>
								<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
									Repository Root
								</p>
								<p className="mt-2 break-all rounded-2xl border bg-muted/25 p-3 font-mono text-xs text-foreground">
									{source.repositoryUrl}
								</p>
							</div>
							<div>
								<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
									Template Folder
								</p>
								<p className="mt-2 break-all rounded-2xl border bg-muted/25 p-3 font-mono text-xs text-foreground">
									{source.path ?? "/"}
								</p>
							</div>
							{source.branch ? (
								<div>
									<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
										Branch
									</p>
									<p className="mt-2 rounded-2xl border bg-muted/25 p-3 font-mono text-xs text-foreground">
										{source.branch}
									</p>
								</div>
							) : null}
						</CardContent>
					</Card>

					<Card className="rounded-3xl">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<LinkIcon className="size-4 text-muted-foreground" />
								Stack and Tags
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

				</div>
			</div>
		</div>
	);
}
