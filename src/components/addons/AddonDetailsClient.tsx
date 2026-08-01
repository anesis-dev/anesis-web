"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
	AlertCircleIcon,
	ArrowLeftIcon,
	BadgeInfoIcon,
	BarChart3Icon,
	BookOpenTextIcon,
	BoxesIcon,
	CalendarDaysIcon,
	DownloadIcon,
	ExternalLinkIcon,
	GitBranchIcon,
	GitCommitHorizontalIcon,
	InfoIcon,
	Layers3Icon,
	SettingsIcon,
	StarIcon,
	UserIcon,
	UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { authorLogin } from "@/lib/author";
import { useAddon } from "@/hooks/useAddon";
import { useAddonManifest } from "@/hooks/useAddonManifest";
import { useAuth } from "@/hooks/useAuth";
import { useTemplateReadme } from "@/hooks/useTemplateReadme";
import { formatDate } from "@/lib/date";
import { parseGitHubTreeUrl } from "@/lib/github-tree-url";
import { getAddonRef } from "@/lib/addon-ref";
import { safeDecodeURIComponent } from "@/lib/safe-decode-uri";
import { starAddon } from "@/services/addon";
import { TemplateReadme } from "@/components/templates/TemplateReadme";
import { AddonCommands } from "@/components/addons/AddonCommands";
import { AddonSettings } from "@/components/addons/AddonSettings";
import { RepoTabs, RepoTab } from "@/components/RepoTabs";
import { StatCard } from "@/components/StatCard";
import { StarButton } from "@/components/StarButton";
import { BadgeSnippet } from "@/components/BadgeSnippet";
import { CommandCard } from "@/components/CommandCard";
import { RegistryDetailHeader } from "@/components/registry/RegistryDetailHeader";

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

export function AddonDetailsClient({ addonRef }: { addonRef: string }) {
	const decodedRef = safeDecodeURIComponent(addonRef);
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { addon, isLoading, isError } = useAddon(decodedRef);
	const ownerLogin = authorLogin(addon?.config?.author);
	const {
		manifest,
		isLoading: isManifestLoading,
		isError: isManifestError,
	} = useAddonManifest(addon?.url ?? "");
	const {
		readme,
		fileName,
		path,
		isLoading: isReadmeLoading,
		isError: isReadmeError,
	} = useTemplateReadme(addon?.url);

	const [activeTab, setActiveTab] = useState("readme");
	const [isStarred, setIsStarred] = useState(false);
	const [starCount, setStarCount] = useState(0);
	const [starring, setStarring] = useState(false);

	useEffect(() => {
		setIsStarred(addon?.is_starred ?? false);
		setStarCount(addon?.star_count ?? 0);
	}, [addon?.is_starred, addon?.star_count]);

	if (isLoading) {
		return (
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-5 lg:px-8">
				<div className="h-4 w-40 animate-pulse rounded bg-muted" />
				<div className="h-40 animate-pulse rounded-3xl border bg-card" />
				<div className="h-10 w-full animate-pulse rounded bg-muted" />
				<div className="h-72 animate-pulse rounded-3xl border bg-card" />
			</div>
		);
	}

	if (isError || !addon) {
		return (
			<div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-5">
				<AlertCircleIcon className="size-10 text-muted-foreground" />
				<div>
					<p className="text-lg font-semibold">Addon not found</p>
					<p className="mt-1 text-sm text-muted-foreground">
						The addon reference{" "}
						<span className="font-mono text-foreground">{decodedRef}</span> could not be loaded.
					</p>
				</div>
				<Button asChild variant="outline">
					<Link href="/addons">
						<ArrowLeftIcon className="size-4" />
						Back to addon registry
					</Link>
				</Button>
			</div>
		);
	}

	const addonRefValue = getAddonRef(addon);
	const source = getSourceInfo(addon.url);
	const installCommand = `anesis addon install ${addon.addon_id}`;
	const removeCommand = `anesis addon remove ${addon.addon_id}`;
	const isAdmin = user?.role === "admin";
	const isOwner = !!user && user.id === addon.owner_id;
	const canManage = isOwner || isAdmin;
	const commandCount =
		manifest?.variants.reduce((sum, variant) => sum + variant.commands.length, 0) ?? 0;

	const tabs: RepoTab[] = [
		{ id: "readme", label: "Readme", icon: BookOpenTextIcon },
		{ id: "about", label: "About", icon: InfoIcon },
		{ id: "statistics", label: "Statistics", icon: BarChart3Icon },
		{
			id: "commands",
			label: "Commands",
			icon: Layers3Icon,
			count: commandCount > 0 ? commandCount : undefined,
		},
		...(canManage ? [{ id: "settings", label: "Settings", icon: SettingsIcon }] : []),
	];

	async function handleStar() {
		if (starring || !user || !addon) return;
		setStarring(true);
		try {
			const result = await starAddon(addon.addon_id);
			setIsStarred(result.is_starred);
			setStarCount(result.star_count);
			await queryClient.invalidateQueries({ queryKey: ["addon", decodedRef] });
			await queryClient.invalidateQueries({ queryKey: ["addons"] });
		} finally {
			setStarring(false);
		}
	}

	return (
		<div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-6 px-4 py-8 sm:px-5 lg:px-8">
			<RegistryDetailHeader
				backHref="/addons"
				backLabel="Back to addon registry"
				icon={<BoxesIcon className="size-5 text-muted-foreground" />}
				owner={
					ownerLogin ? { label: ownerLogin, href: `/user/${ownerLogin}` } : null
				}
				identifier={addon.addon_id}
				official={addon.official}
				title={addon.config.name}
				description={addon.config.description}
				meta={[
					{
						icon: <BadgeInfoIcon className="size-3.5" />,
						label: addonRefValue,
						className: "font-mono",
					},
					{
						icon: <CalendarDaysIcon className="size-3.5" />,
						label: `Published ${formatDate(addon.created_at)}`,
					},
					...(addon.visibility && addon.visibility !== "public"
						? [{ icon: <UsersIcon className="size-3.5" />, label: addon.visibility }]
						: []),
				]}
				actions={
					<>
						<Button asChild>
							<Link href={addon.url} target="_blank" rel="noopener noreferrer">
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
					</>
				}
				tabs={<RepoTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />}
			/>

			{activeTab === "readme" ? (
				<div className="min-w-0">
					<TemplateReadme
						content={readme}
						fileName={fileName}
						sourceUrl={addon.url}
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
								{addon.config.description}
							</p>
						</InfoCard>

						<InfoCard title="Quick start">
							<div className="space-y-3">
								<CommandCard label="Install" command={installCommand} copyLabel={installCommand} />
								<CommandCard label="Remove" command={removeCommand} copyLabel={removeCommand} />
							</div>
						</InfoCard>

						<InfoCard title="README badge">
							<BadgeSnippet resourceType="addon" id={addon.addon_id} />
						</InfoCard>
					</div>

					<div className="flex flex-col gap-6">
						<InfoCard title="Details">
							<dl className="space-y-2 text-sm">
								<div className="flex items-center justify-between gap-3">
									<dt className="text-muted-foreground">Addon ID</dt>
									<dd className="break-all text-right font-mono font-medium text-foreground">
										{addon.addon_id}
									</dd>
								</div>
								<div className="flex items-center justify-between gap-3">
									<dt className="text-muted-foreground">Version</dt>
									<dd className="font-mono font-medium text-foreground">v{addon.version}</dd>
								</div>
								<div className="flex items-center justify-between gap-3">
									<dt className="text-muted-foreground">Schema</dt>
									<dd className="font-medium text-foreground">v{addon.config.schema_version}</dd>
								</div>
								<div className="flex items-center justify-between gap-3">
									<dt className="text-muted-foreground">Published</dt>
									<dd className="font-medium text-foreground">{formatDate(addon.created_at)}</dd>
								</div>
								<div className="flex items-center justify-between gap-3">
									<dt className="text-muted-foreground">Last sync</dt>
									<dd className="font-medium text-foreground">{formatDate(addon.updated_at)}</dd>
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
									{source.repositoryLabel}
								</Link>
								<p className="break-all font-mono text-xs text-muted-foreground">
									{source.path ? `/${source.path}` : "/"}
									{source.branch ? ` · ${source.branch}` : ""}
								</p>
								<p className="inline-flex items-center gap-1.5 break-all font-mono text-xs text-muted-foreground">
									<GitCommitHorizontalIcon className="size-3.5 shrink-0" />
									{addon.commit_sha}
								</p>
								<p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
									<UserIcon className="size-3.5" />
									{ownerLogin ?? "unknown"}
								</p>
							</div>
						</InfoCard>
					</div>
				</div>
			) : null}

			{activeTab === "statistics" ? (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<StatCard
						label="Downloads"
						value={(addon.download_count ?? 0).toLocaleString()}
						helper="Total archive downloads of this addon."
						icon={DownloadIcon}
					/>
					<StatCard
						label="Unique downloaders"
						value={(addon.unique_downloaders ?? 0).toLocaleString()}
						helper="Distinct users who downloaded this addon."
						icon={UsersIcon}
					/>
					<StatCard
						label="Stars"
						value={starCount.toLocaleString()}
						helper="Users who starred this addon."
						icon={StarIcon}
					/>
					<StatCard
						label="Commands"
						value={commandCount.toLocaleString()}
						helper="Commands declared in the addon manifest."
						icon={Layers3Icon}
					/>
				</div>
			) : null}

			{activeTab === "commands" ? (
				<AddonCommands
					addonId={addon.addon_id}
					manifest={manifest}
					isLoading={isManifestLoading}
					isError={isManifestError}
				/>
			) : null}

			{activeTab === "settings" && canManage ? (
				<AddonSettings addon={addon} isAdmin={isAdmin} />
			) : null}
		</div>
	);
}
