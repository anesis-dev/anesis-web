"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
	AlertCircleIcon,
	ArrowLeftIcon,
	BarChart3Icon,
	BookOpenTextIcon,
	CalendarDaysIcon,
	DownloadIcon,
	ExternalLinkIcon,
	GitBranchIcon,
	GitCommitHorizontalIcon,
	InfoIcon,
	LayersIcon,
	Layers3Icon,
	PackageIcon,
	SettingsIcon,
	StarIcon,
	UsersIcon,
} from "lucide-react";
import { CommandCard } from "@/components/CommandCard";
import { StarButton } from "@/components/StarButton";
import { StatCard } from "@/components/StatCard";
import { BadgeSnippet } from "@/components/BadgeSnippet";
import { Button } from "@/components/ui/button";
import { RegistryDetailHeader } from "@/components/registry/RegistryDetailHeader";
import { RepoTabs, RepoTab } from "@/components/RepoTabs";
import { TemplateReadme } from "@/components/templates/TemplateReadme";
import { StackSettings } from "@/components/stacks/StackSettings";
import { useAuth } from "@/hooks/useAuth";
import { useStack } from "@/hooks/useStack";
import { useTemplateReadme } from "@/hooks/useTemplateReadme";
import { formatDate } from "@/lib/date";
import { parseGitHubTreeUrl } from "@/lib/github-tree-url";
import { getTemplateLatestHref } from "@/lib/template-ref";
import { starStack } from "@/services/stack";

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
			repositoryLabel: `${repo.owner}/${repo.repo}`,
			branch: repo.branch ?? null,
			path: repo.path ?? null,
		};
	} catch {
		return { repositoryUrl: url, repositoryLabel: url, branch: null, path: null };
	}
}

export function StackDetail({ stackRef }: { stackRef: string }) {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { stack, isLoading, isError } = useStack(stackRef);
	const {
		readme,
		fileName,
		path,
		isLoading: isReadmeLoading,
		isError: isReadmeError,
	} = useTemplateReadme(stack?.url);

	const [activeTab, setActiveTab] = useState("readme");
	const [isStarred, setIsStarred] = useState(false);
	const [starCount, setStarCount] = useState(0);
	const [starring, setStarring] = useState(false);

	useEffect(() => {
		setIsStarred(stack?.is_starred ?? false);
		setStarCount(stack?.star_count ?? 0);
	}, [stack?.is_starred, stack?.star_count]);

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

	if (isError || !stack) {
		return (
			<div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-5">
				<AlertCircleIcon className="size-10 text-muted-foreground" />
				<div>
					<p className="text-lg font-semibold">Stack not found</p>
					<p className="mt-1 text-sm text-muted-foreground">
						The stack reference <span className="font-mono text-foreground">{stackRef}</span>{" "}
						could not be loaded.
					</p>
				</div>
				<Button asChild variant="outline">
					<Link href="/stacks">
						<ArrowLeftIcon className="size-4" />
						Back to stacks
					</Link>
				</Button>
			</div>
		);
	}

	const { config } = stack;
	const stackId = stack.stack_id;
	const publishedAt = formatDate(stack.created_at);
	const source = getSourceInfo(stack.url);
	const scaffoldCommand = `anesis new my-app --stack ${stackId}`;
	const isAdmin = user?.role === "admin";
	const isOwner = !!user && user.id === stack.owner_id;
	const canManage = isOwner || isAdmin;

	const tabs: RepoTab[] = [
		{ id: "readme", label: "Readme", icon: BookOpenTextIcon },
		{ id: "about", label: "About", icon: InfoIcon },
		{ id: "statistics", label: "Statistics", icon: BarChart3Icon },
		{ id: "composition", label: "Composition", icon: Layers3Icon, count: config.addons.length },
		...(canManage ? [{ id: "settings", label: "Settings", icon: SettingsIcon }] : []),
	];

	async function handleStar() {
		if (starring || !user || !stack) return;
		setStarring(true);
		try {
			const result = await starStack(stackId);
			setIsStarred(result.is_starred);
			setStarCount(result.star_count);
			await queryClient.invalidateQueries({ queryKey: ["stack", stackRef] });
			await queryClient.invalidateQueries({ queryKey: ["stacks"] });
		} finally {
			setStarring(false);
		}
	}

	return (
		<div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-6 px-4 py-8 sm:px-5 lg:px-8">
			<RegistryDetailHeader
				backHref="/stacks"
				backLabel="Back to stacks"
				icon={<LayersIcon className="size-5 text-muted-foreground" />}
				identifier={stackId}
				official={stack.official}
				title={stack.name}
				description={stack.description}
				meta={[
					{ icon: <CalendarDaysIcon className="size-3.5" />, label: `Published ${publishedAt}` },
					...(stack.visibility && stack.visibility !== "public"
						? [{ icon: <UsersIcon className="size-3.5" />, label: stack.visibility }]
						: []),
				]}
				actions={
					<>
						{stack.url ? (
							<Button asChild>
								<Link href={stack.url} target="_blank" rel="noopener noreferrer">
									<ExternalLinkIcon className="size-4" />
									Open source
								</Link>
							</Button>
						) : null}
						<StarButton
							isStarred={isStarred}
							starCount={starCount}
							onToggle={handleStar}
							loading={starring}
							disabled={!user}
							variant="button"
						/>
					</>
				}
				tabs={<RepoTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />}
			/>

			{activeTab === "readme" ? (
				<div className="min-w-0">
					<TemplateReadme
						content={readme}
						fileName={fileName}
						sourceUrl={stack.url}
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
							<p className="text-sm leading-6 text-muted-foreground">{stack.description}</p>
						</InfoCard>

						<InfoCard title="Quick start">
							<div className="space-y-3">
								<CommandCard
									label="Scaffold this stack"
									command={scaffoldCommand}
									helper="Generates the template, then applies every addon in order."
									copyLabel={scaffoldCommand}
								/>
							</div>
						</InfoCard>

						<InfoCard title="README badge">
							<BadgeSnippet resourceType="stack" id={stackId} />
						</InfoCard>
					</div>

					<div className="flex flex-col gap-6">
						<InfoCard title="Details">
							<dl className="space-y-2 text-sm">
								<div className="flex items-center justify-between gap-3">
									<dt className="text-muted-foreground">Stack ID</dt>
									<dd className="break-all text-right font-mono font-medium text-foreground">
										{stackId}
									</dd>
								</div>
								<div className="flex items-center justify-between gap-3">
									<dt className="text-muted-foreground">Template</dt>
									<dd className="font-medium text-foreground">{config.template}</dd>
								</div>
								<div className="flex items-center justify-between gap-3">
									<dt className="text-muted-foreground">Addons</dt>
									<dd className="font-medium text-foreground">{config.addons.length}</dd>
								</div>
								<div className="flex items-center justify-between gap-3">
									<dt className="text-muted-foreground">Published</dt>
									<dd className="font-medium text-foreground">{publishedAt}</dd>
								</div>
							</dl>
						</InfoCard>

						{stack.url ? (
							<InfoCard title="Source">
								<div className="space-y-2 text-sm">
									<Link
										href={source.repositoryUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1.5 break-all font-mono text-xs text-primary hover:underline"
									>
										<GitBranchIcon className="size-3.5 shrink-0" />
										{source.repositoryLabel}
									</Link>
									<p className="break-all font-mono text-xs text-muted-foreground">
										{source.path ? `/${source.path}` : "/"}
										{source.branch ? ` · ${source.branch}` : ""}
									</p>
									{stack.commit_sha ? (
										<p className="inline-flex items-center gap-1.5 break-all font-mono text-xs text-muted-foreground">
											<GitCommitHorizontalIcon className="size-3.5 shrink-0" />
											{stack.commit_sha}
										</p>
									) : null}
								</div>
							</InfoCard>
						) : null}
					</div>
				</div>
			) : null}

			{activeTab === "statistics" ? (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<StatCard
						label="Downloads"
						value={(stack.download_count ?? 0).toLocaleString()}
						helper="Total archive downloads of this stack."
						icon={DownloadIcon}
					/>
					<StatCard
						label="Unique downloaders"
						value={(stack.unique_downloaders ?? 0).toLocaleString()}
						helper="Distinct users who downloaded this stack."
						icon={UsersIcon}
					/>
					<StatCard
						label="Stars"
						value={starCount.toLocaleString()}
						helper="Users who starred this stack."
						icon={StarIcon}
					/>
					<StatCard
						label="Addons"
						value={config.addons.length.toLocaleString()}
						helper="Addons applied by this stack, in order."
						icon={Layers3Icon}
					/>
				</div>
			) : null}

			{activeTab === "composition" ? (
				<section className="space-y-3">
					<p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
						Composition
					</p>

					<div className="rounded-2xl border bg-card shadow-sm">
						<Link
							href={getTemplateLatestHref(config.template)}
							className="flex items-center justify-between border-b px-5 py-3 transition-colors hover:bg-muted/40"
						>
							<span className="flex items-center gap-2">
								<PackageIcon className="size-4 text-primary" />
								<span className="font-medium">{config.template}</span>
							</span>
							<span className="text-xs text-muted-foreground">template</span>
						</Link>

						<ol className="divide-y">
							{config.addons.map((addon, index) => (
								<li
									key={`${addon.id}-${index}`}
									className="flex items-center justify-between px-5 py-3"
								>
									<span className="flex items-center gap-3">
										<span className="text-xs text-muted-foreground">{index + 1}</span>
										<Link href="/addons" className="font-medium hover:underline">
											{addon.id}
										</Link>
										<span className="text-xs text-muted-foreground">{addon.command}</span>
									</span>
									{addon.inputs && Object.keys(addon.inputs).length > 0 ? (
										<span className="text-xs text-muted-foreground">
											{Object.entries(addon.inputs)
												.map(([key, value]) => `${key}=${value}`)
												.join(", ")}
										</span>
									) : null}
								</li>
							))}
						</ol>
					</div>
				</section>
			) : null}

			{activeTab === "settings" && canManage ? (
				<StackSettings stack={stack} isAdmin={isAdmin} />
			) : null}
		</div>
	);
}
