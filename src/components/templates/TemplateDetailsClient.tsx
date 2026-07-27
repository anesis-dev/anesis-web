"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
	AlertCircleIcon,
	ArrowLeftIcon,
	BadgeInfoIcon,
	BookOpenTextIcon,
	BarChart3Icon,
	CalendarDaysIcon,
	CheckIcon,
	ChevronDownIcon,
	DownloadIcon,
	ExternalLinkIcon,
	GitBranchIcon,
	InfoIcon,
	PackageIcon,
	SettingsIcon,
	StarIcon,
	TerminalSquareIcon,
	UserIcon,
	UsersIcon,
} from "lucide-react";
import { authorLogin } from "@/lib/author";
import { formatDate } from "@/lib/date";
import { parseGitHubTreeUrl } from "@/lib/github-tree-url";
import { useAuth } from "@/hooks/useAuth";
import { useTemplate } from "@/hooks/useTemplate";
import { useTemplateVersions } from "@/hooks/useTemplateVersions";
import { useTemplateReadme } from "@/hooks/useTemplateReadme";
import { getTemplateHref, getTemplateRef } from "@/lib/template-ref";
import { starTemplate } from "@/services/template";
import { TemplateReadme } from "@/components/templates/TemplateReadme";
import { TemplateApiUrlButton } from "@/components/templates/TemplateApiUrlButton";
import { TemplateSettings } from "@/components/templates/TemplateSettings";
import { RepoTabs, RepoTab } from "@/components/RepoTabs";
import { StatCard } from "@/components/StatCard";
import { StarButton } from "@/components/StarButton";
import { CommandCard } from "@/components/CommandCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RegistryDetailHeader } from "@/components/registry/RegistryDetailHeader";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Pill({ children }: { children: React.ReactNode }) {
	return <Badge variant="pill">{children}</Badge>;
}

function InfoCard({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section className="space-y-3 rounded-2xl border bg-card p-5 shadow-sm">
			<p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
				{title}
			</p>
			{children}
		</section>
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
		return { repositoryUrl: url, branch: null, path: null };
	}
}

export function TemplateDetailsClient({
	templateRef,
}: {
	templateRef: string[];
}) {
	const { user } = useAuth();
	const queryClient = useQueryClient();
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

	const [activeTab, setActiveTab] = useState("readme");
	const [isStarred, setIsStarred] = useState(false);
	const [starCount, setStarCount] = useState(0);
	const [starring, setStarring] = useState(false);

	useEffect(() => {
		setIsStarred(template?.is_starred ?? false);
		setStarCount(template?.star_count ?? 0);
	}, [template?.is_starred, template?.star_count]);

	if (isLoading) {
		return (
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-5 lg:px-8">
				<div className="h-4 w-32 animate-pulse rounded bg-muted" />
				<div className="h-40 animate-pulse rounded-3xl border bg-card" />
				<div className="h-10 w-full animate-pulse rounded bg-muted" />
				<div className="h-72 animate-pulse rounded-3xl border bg-card" />
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
						<span className="font-mono text-foreground">{joinedRef}</span> could not be loaded.
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
	const publishedAt = formatDate(template.created_at);
	const source = getSourceInfo(template.config.repository.url);
	const availableVersions = versions.length > 0 ? versions : [template];
	const templateName = template.name;
	const createCommand = `anesis new my-app ${templateName}`;
	const installCommand = `anesis template install ${templateName}`;
	const isAdmin = user?.role === "admin";
	const isOwner = !!user && user.id === template.owner_id;
	const canManage = isOwner || isAdmin;

	const tabs: RepoTab[] = [
		{ id: "readme", label: "Readme", icon: BookOpenTextIcon },
		{ id: "about", label: "About", icon: InfoIcon },
		{ id: "statistics", label: "Statistics", icon: BarChart3Icon },
		...(canManage ? [{ id: "settings", label: "Settings", icon: SettingsIcon }] : []),
	];

	async function handleStar() {
		if (starring || !user) return;
		setStarring(true);
		try {
			const result = await starTemplate(templateName);
			setIsStarred(result.is_starred);
			setStarCount(result.star_count);
			await queryClient.invalidateQueries({ queryKey: ["template", joinedRef] });
			await queryClient.invalidateQueries({ queryKey: ["templates"] });
		} finally {
			setStarring(false);
		}
	}

	return (
		<div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-6 px-4 py-8 sm:px-5 lg:px-8">
			<RegistryDetailHeader
				backHref="/templates"
				backLabel="Back to templates"
				icon={<PackageIcon className="size-5 text-muted-foreground" />}
				owner={{
					label: authorLogin(template.config?.author) ?? "unknown",
					href: `/user/${authorLogin(template.config?.author) ?? ""}`,
				}}
				identifier={templateName.split("/").pop() ?? templateName}
				official={template.official}
				title={template.config.metadata.displayName}
				description={template.config.metadata.description}
				meta={[
					{
						icon: <BadgeInfoIcon className="size-3.5" />,
						label: canonicalRef,
						className: "font-mono",
					},
					{ icon: <CalendarDaysIcon className="size-3.5" />, label: `Published ${publishedAt}` },
					...(template.visibility && template.visibility !== "public"
						? [{ icon: <UsersIcon className="size-3.5" />, label: template.visibility }]
						: []),
				]}
				actions={
					<>
						<Button asChild>
							<Link href={template.config.repository.url} target="_blank" rel="noopener noreferrer">
								<ExternalLinkIcon className="size-4" />
								Open source
							</Link>
						</Button>
						<StarButton
							isStarred={isStarred}
							starCount={starCount}
							onToggle={handleStar}
							loading={starring}
							disabled={!user}
							variant="button"
						/>
						{availableVersions.length > 1 ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button type="button" variant="outline">
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
						) : null}
					</>
				}
				tabs={<RepoTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />}
			/>

			{activeTab === "readme" ? (
				<div className="min-w-0">
					<TemplateReadme
						content={readme}
						fileName={fileName}
						sourceUrl={template.config.repository.url}
						sourcePath={path}
						isLoading={isReadmeLoading}
						isError={isReadmeError}
					/>
				</div>
			) : null}

			{activeTab === "about" ? (
				<div className="grid min-w-0 items-start gap-6 lg:grid-cols-2">
					<div className="flex flex-col gap-6">
						<InfoCard title="About">
							<p className="text-sm leading-6 text-muted-foreground">
								{template.config.metadata.description}
							</p>
						</InfoCard>

						<InfoCard title="Quick start">
							<div className="space-y-3">
								<CommandCard
									label="Create a project"
									command={createCommand}
									copyLabel={createCommand}
								/>
								<CommandCard
									label="Install locally"
									command={installCommand}
									copyLabel={installCommand}
								/>
								<TemplateApiUrlButton
									templateRef={canonicalRef}
									variant="outline"
									className="w-full"
								/>
							</div>
						</InfoCard>
					</div>

					<div className="flex flex-col gap-6">
						{template.config.technologies.length > 0 ||
						template.config.languages.length > 0 ? (
							<InfoCard title="Stack">
								<div className="space-y-4">
									{template.config.technologies.length > 0 ? (
										<div>
											<p className="mb-2 text-xs text-muted-foreground">Technologies</p>
											<div className="flex flex-wrap gap-2">
												{template.config.technologies.map((tech) => (
													<Pill key={tech}>{tech}</Pill>
												))}
											</div>
										</div>
									) : null}
									{template.config.languages.length > 0 ? (
										<div>
											<p className="mb-2 text-xs text-muted-foreground">Languages</p>
											<div className="flex flex-wrap gap-2">
												{template.config.languages.map((language) => (
													<Pill key={language}>{language}</Pill>
												))}
											</div>
										</div>
									) : null}
								</div>
							</InfoCard>
						) : null}

						<InfoCard title="Details">
							<dl className="space-y-2 text-sm">
								<div className="flex items-center justify-between gap-3">
									<dt className="text-muted-foreground">Type</dt>
									<dd className="font-medium text-foreground">{template.config.type}</dd>
								</div>
								<div className="flex items-center justify-between gap-3">
									<dt className="text-muted-foreground">Scope</dt>
									<dd className="font-medium text-foreground">{template.config.scope}</dd>
								</div>
								<div className="flex items-center justify-between gap-3">
									<dt className="text-muted-foreground">Specialization</dt>
									<dd className="break-all text-right font-medium text-foreground">
										{template.config.specialization}
									</dd>
								</div>
								<div className="flex items-center justify-between gap-3">
									<dt className="text-muted-foreground">Published</dt>
									<dd className="font-medium text-foreground">{publishedAt}</dd>
								</div>
							</dl>
						</InfoCard>

						<InfoCard title="Source">
							<div className="space-y-2 text-sm">
								<Link
									href={source.repositoryUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 break-all font-mono text-xs text-primary hover:underline"
								>
									<GitBranchIcon className="size-3.5 shrink-0" />
									{source.repositoryUrl.replace("https://github.com/", "")}
								</Link>
								<p className="break-all font-mono text-xs text-muted-foreground">
									{source.path ? `/${source.path}` : "/"}
									{source.branch ? ` · ${source.branch}` : ""}
								</p>
								<Link
									href={`/user/${authorLogin(template.config?.author) ?? ""}`}
									className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
								>
									<UserIcon className="size-3.5" />@{authorLogin(template.config?.author) ?? "unknown"}
								</Link>
							</div>
						</InfoCard>
					</div>
				</div>
			) : null}

			{activeTab === "statistics" ? (
				<div className="flex flex-col gap-6">
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<StatCard
							label="Downloads"
							value={(template.download_count ?? 0).toLocaleString()}
							helper="Total archive downloads across all versions."
							icon={DownloadIcon}
						/>
						<StatCard
							label="Unique downloaders"
							value={(template.unique_downloaders ?? 0).toLocaleString()}
							helper="Distinct users who downloaded this template."
							icon={UsersIcon}
						/>
						<StatCard
							label="Projects created"
							value={(template.use_count ?? 0).toLocaleString()}
							helper="Projects scaffolded from this template via the CLI."
							icon={TerminalSquareIcon}
						/>
						<StatCard
							label="Stars"
							value={starCount.toLocaleString()}
							helper="Users who starred this template."
							icon={StarIcon}
						/>
						<StatCard
							label="Versions"
							value={availableVersions.length.toLocaleString()}
							helper="Published versions under this template name."
							icon={BadgeInfoIcon}
						/>
						<StatCard
							label="Tags"
							value={(template.config.metadata.tags?.length ?? 0).toLocaleString()}
							helper="Discovery tags attached to this template."
							icon={PackageIcon}
						/>
					</div>

					{template.config.metadata.tags && template.config.metadata.tags.length > 0 ? (
						<div className="rounded-2xl border bg-card p-5 shadow-sm">
							<p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
								Tags
							</p>
							<div className="flex flex-wrap gap-2">
								{template.config.metadata.tags.map((tag) => (
									<Pill key={tag}>{tag}</Pill>
								))}
							</div>
						</div>
					) : null}
				</div>
			) : null}

			{activeTab === "settings" && canManage ? (
				<TemplateSettings template={template} isAdmin={isAdmin} />
			) : null}
		</div>
	);
}
