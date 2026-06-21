"use client";

import Image from "next/image";
import Link from "next/link";
import { AddonCard } from "@/components/addons/AddonCard";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { Button } from "@/components/ui/button";
import { IAddon } from "@/types/addon";
import { ITemplate } from "@/types/template";
import {
	BookOpenIcon,
	BoxesIcon,
	LogOutIcon,
	PackageIcon,
	ShieldIcon,
	StarIcon,
} from "lucide-react";
import { useState } from "react";

export const PROFILE_PREVIEW_LIMIT = 3;

export type ProfileUser = {
	login: string;
	avatarUrl: string;
	githubUrl: string;
	name?: string | null;
	bio?: string | null;
	followers?: number;
	following?: number;
};

type UserProfilePageContentProps = {
	profile?: ProfileUser;
	profileLoading: boolean;
	templates: ITemplate[];
	addons: IAddon[];
	templatesLoading: boolean;
	addonsLoading: boolean;
	templateTotal?: number;
	addonTotal?: number;
	templateTitle: string;
	addonTitle: string;
	emptyTemplatesDescription: string;
	emptyAddonsDescription: string;
	viewAllTemplatesHref?: string;
	viewAllAddonsHref?: string;
	starredHref?: string;
	showAdminPanel?: boolean;
	onLogout?: () => void;
};

function Stat({ label, value }: { label: string; value: number }) {
	return (
		<div className="inline-flex items-baseline justify-center gap-1.5 whitespace-nowrap sm:justify-start">
			<span className="text-lg font-bold leading-none tabular-nums">
				{value.toLocaleString()}
			</span>
			<span className="text-sm font-semibold leading-none text-muted-foreground">
				{label}
			</span>
		</div>
	);
}

export function ProfileSkeleton() {
	return (
		<div className="flex animate-pulse flex-col items-center gap-5 sm:flex-row sm:items-start">
			<div className="size-24 shrink-0 rounded-full bg-muted" />
			<div className="flex w-full flex-col items-center gap-3 sm:items-start">
				<div className="h-6 w-40 rounded bg-muted" />
				<div className="h-4 w-24 rounded bg-muted" />
				<div className="h-4 w-64 rounded bg-muted" />
				<div className="h-8 w-32 rounded-md bg-muted" />
			</div>
		</div>
	);
}

export function PackageSkeleton() {
	return (
		<div className="flex animate-pulse flex-col gap-4 rounded-xl border bg-card px-6 py-5">
			<div className="h-4 w-2/3 rounded bg-muted" />
			<div className="space-y-2">
				<div className="h-3 w-full rounded bg-muted" />
				<div className="h-3 w-4/5 rounded bg-muted" />
			</div>
			<div className="flex gap-1.5">
				{[80, 60, 72].map((width) => (
					<div
						key={width}
						className="h-5 rounded-md bg-muted"
						style={{ width }}
					/>
				))}
			</div>
			<div className="flex items-center justify-between border-t pt-4">
				<div className="h-3 w-24 rounded bg-muted" />
				<div className="h-3 w-10 rounded bg-muted" />
			</div>
		</div>
	);
}

function SectionHeader({
	icon: Icon,
	title,
	total,
	isLoading,
	children,
}: {
	icon: React.ElementType;
	title: string;
	total: number;
	isLoading: boolean;
	children?: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-2">
				<Icon className="size-4 text-muted-foreground" />
				<h2 className="font-semibold">
					{title}
					{!isLoading && (
						<span className="ml-2 font-mono text-sm font-normal text-muted-foreground">
							{total}
						</span>
					)}
				</h2>
			</div>
			{children}
		</div>
	);
}

function ViewAllControl({
	href,
	isExpanded,
	onToggle,
	total,
	expandedLabel,
	collapsedLabel,
}: {
	href?: string;
	isExpanded: boolean;
	onToggle: () => void;
	total: number;
	expandedLabel: string;
	collapsedLabel: string;
}) {
	if (total <= PROFILE_PREVIEW_LIMIT) {
		return null;
	}

	if (href) {
		return (
			<Link href={href} className="w-full sm:w-auto">
				<Button variant="outline" size="sm" className="w-full sm:w-auto">
					{collapsedLabel}
				</Button>
			</Link>
		);
	}

	return (
		<Button
			type="button"
			variant="outline"
			size="sm"
			onClick={onToggle}
			className="w-full sm:w-auto"
		>
			{isExpanded ? expandedLabel : collapsedLabel}
		</Button>
	);
}

export function UserProfilePageContent({
	profile,
	profileLoading,
	templates,
	addons,
	templatesLoading,
	addonsLoading,
	templateTotal = templates.length,
	addonTotal = addons.length,
	templateTitle,
	addonTitle,
	emptyTemplatesDescription,
	emptyAddonsDescription,
	viewAllTemplatesHref,
	viewAllAddonsHref,
	starredHref,
	showAdminPanel = false,
	onLogout,
}: UserProfilePageContentProps) {
	const [showAllTemplates, setShowAllTemplates] = useState(false);
	const [showAllAddons, setShowAllAddons] = useState(false);
	const visibleTemplates =
		showAllTemplates && !viewAllTemplatesHref
			? templates
			: templates.slice(0, PROFILE_PREVIEW_LIMIT);
	const visibleAddons =
		showAllAddons && !viewAllAddonsHref
			? addons
			: addons.slice(0, PROFILE_PREVIEW_LIMIT);

	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 sm:px-5">
			{profileLoading ? (
				<ProfileSkeleton />
			) : profile ? (
				<div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
					<div className="relative size-24 shrink-0 overflow-hidden rounded-full border">
						<Image
							src={profile.avatarUrl}
							alt={profile.login}
							fill
							sizes="96px"
							className="object-cover"
						/>
					</div>

					<div className="flex flex-1 flex-col items-center gap-3 sm:items-start">
						<div className="flex flex-col items-center gap-0.5 sm:items-start">
							{profile.name && (
								<h1 className="text-2xl font-bold tracking-tight">
									{profile.name}
								</h1>
							)}
							<p className="font-mono text-sm text-muted-foreground">
								@{profile.login}
							</p>
						</div>

						{profile.bio && (
							<p className="max-w-md text-center text-sm text-muted-foreground sm:text-left">
								{profile.bio}
							</p>
						)}

						<div className="flex w-full flex-col items-stretch gap-2 sm:-ml-0.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-start">
							{showAdminPanel && (
								<Link href="/admin" className="w-full sm:w-auto">
									<Button
										variant="default"
										size="sm"
										className="w-full gap-1.5 sm:w-auto"
									>
										<ShieldIcon className="size-3.5" />
										Admin Panel
									</Button>
								</Link>
							)}

							{starredHref && (
								<Link href={starredHref} className="w-full sm:w-auto">
									<Button
										variant="outline"
										size="sm"
										className="w-full gap-1.5 sm:w-auto"
									>
										<StarIcon className="size-3.5" />
										Starred
									</Button>
								</Link>
							)}

							<Link
								href={profile.githubUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="w-full sm:w-auto"
							>
								<Button
									variant="outline"
									size="sm"
									className="w-full gap-1.5 sm:w-auto"
								>
									<GitHubIcon className="size-3.5" />
									View on GitHub
								</Button>
							</Link>

							{onLogout && (
								<Button
									variant="ghost"
									size="sm"
									onClick={onLogout}
									className="w-full gap-1.5 text-muted-foreground hover:text-destructive sm:w-auto"
								>
									<LogOutIcon className="size-3.5" />
									Log out
								</Button>
							)}
						</div>
					</div>
				</div>
			) : null}

			<div className="h-px w-full bg-border" />

			<div className="flex flex-col gap-5">
				<SectionHeader
					icon={PackageIcon}
					title={templateTitle}
					total={templateTotal}
					isLoading={templatesLoading}
				>
					{!templatesLoading && (
						<ViewAllControl
							href={viewAllTemplatesHref}
							isExpanded={showAllTemplates}
							onToggle={() => setShowAllTemplates((value) => !value)}
							total={templateTotal}
							collapsedLabel="View all templates"
							expandedLabel="Show fewer templates"
						/>
					)}
				</SectionHeader>

				{templatesLoading && (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: PROFILE_PREVIEW_LIMIT }).map((_, index) => (
							<PackageSkeleton key={index} />
						))}
					</div>
				)}

				{!templatesLoading && templateTotal === 0 && (
					<div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-14 text-center">
						<BookOpenIcon className="size-7 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">No templates yet</p>
							<p className="mt-1 text-xs text-muted-foreground">
								{emptyTemplatesDescription}
							</p>
						</div>
					</div>
				)}

				{!templatesLoading && visibleTemplates.length > 0 && (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{visibleTemplates.map((template) => (
							<TemplateCard key={template.id} template={template} />
						))}
					</div>
				)}
			</div>

			<div className="h-px w-full bg-border" />

			<div className="flex flex-col gap-5">
				<SectionHeader
					icon={BoxesIcon}
					title={addonTitle}
					total={addonTotal}
					isLoading={addonsLoading}
				>
					{!addonsLoading && (
						<ViewAllControl
							href={viewAllAddonsHref}
							isExpanded={showAllAddons}
							onToggle={() => setShowAllAddons((value) => !value)}
							total={addonTotal}
							collapsedLabel="View all addons"
							expandedLabel="Show fewer addons"
						/>
					)}
				</SectionHeader>

				{addonsLoading && (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: PROFILE_PREVIEW_LIMIT }).map((_, index) => (
							<PackageSkeleton key={index} />
						))}
					</div>
				)}

				{!addonsLoading && addonTotal === 0 && (
					<div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-14 text-center">
						<BoxesIcon className="size-7 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">No addons yet</p>
							<p className="mt-1 text-xs text-muted-foreground">
								{emptyAddonsDescription}
							</p>
						</div>
					</div>
				)}

				{!addonsLoading && visibleAddons.length > 0 && (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{visibleAddons.map((addon) => (
							<AddonCard key={addon.id} addon={addon} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
