
"use client";

import Link from "next/link";
import { useState } from "react";
import { PaginationControls } from "@/components/PaginationControls";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { AddonCard } from "@/components/addons/AddonCard";
import { StackCard } from "@/components/stacks/StackCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useStarredTemplates } from "@/hooks/useStarredTemplates";
import { useStarredAddons } from "@/hooks/useStarredAddons";
import { useStarredStacks } from "@/hooks/useStarredStacks";
import { BoxesIcon, LayersIcon, PackageIcon, StarIcon } from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";

const PAGE_SIZE = 6;

function EmptyState({ icon: Icon, title, description }: {
	icon: React.ElementType;
	title: string;
	description: string;
}) {
	return (
		<div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/30 px-6 py-12 text-center">
			<Icon className="size-8 text-muted-foreground/50" />
			<div>
				<p className="font-medium text-sm">{title}</p>
				<p className="mt-1 text-xs text-muted-foreground">{description}</p>
			</div>
		</div>
	);
}

function SectionSkeleton() {
	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: 3 }).map((_, i) => (
				<div
					key={i}
					className="h-40 animate-pulse rounded-xl border bg-muted/30"
				/>
			))}
		</div>
	);
}

export default function AccountStarredPage() {
	const { user, login } = useAuth();
	const [templatesPage, setTemplatesPage] = useState(1);
	const [addonsPage, setAddonsPage] = useState(1);
	const [stacksPage, setStacksPage] = useState(1);

	const {
		templates,
		isLoading: templatesLoading,
		pagination: templatePagination,
	} = useStarredTemplates({ enabled: !!user, page: templatesPage, pageSize: PAGE_SIZE });

	const {
		addons,
		isLoading: addonsLoading,
		pagination: addonPagination,
	} = useStarredAddons({ enabled: !!user, page: addonsPage, pageSize: PAGE_SIZE });

	const {
		stacks,
		isLoading: stacksLoading,
		pagination: stackPagination,
	} = useStarredStacks({ enabled: !!user, page: stacksPage, pageSize: PAGE_SIZE });

	if (!user) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
				<StarIcon className="size-12 text-primary drop-shadow-[0_0_18px_rgba(45,106,79,0.40)]" />
				<div>
					<p className="font-semibold text-lg">Sign in to see your starred items</p>
					<p className="mt-1 text-sm text-muted-foreground">
						Star templates and addons to keep track of the ones you care about.
					</p>
				</div>
				<div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
					<Button onClick={login} className="w-full sm:w-auto">
						<GitHubIcon className="size-4" />
						Login with GitHub
					</Button>
					<Link href="/" className="w-full sm:w-auto">
						<Button variant="outline" className="w-full sm:w-auto">
							Go back to home
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 sm:px-5">
			<div className="flex items-center gap-2">
				<StarIcon className="size-5 text-amber-500" />
				<h1 className="text-2xl font-bold tracking-tight">Starred</h1>
			</div>

			<div className="flex flex-col gap-5">
				<div className="flex items-center gap-2">
					<PackageIcon className="size-4 text-muted-foreground" />
					<h2 className="font-semibold">
						Starred templates
						{!templatesLoading && (
							<span className="ml-2 font-mono text-sm font-normal text-muted-foreground">
								{templatePagination.total}
							</span>
						)}
					</h2>
				</div>

				{templatesLoading ? (
					<SectionSkeleton />
				) : templates.length === 0 ? (
					<EmptyState
						icon={PackageIcon}
						title="No starred templates yet"
						description="Templates you star will show up here."
					/>
				) : (
					<>
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{templates.map((template) => (
								<TemplateCard
									key={template.id}
									template={template}
									versionCount={template.versionCount}
									linkToLatest
								/>
							))}
						</div>
						<PaginationControls
							page={templatesPage}
							totalPages={templatePagination.totalPages}
							onPageChange={setTemplatesPage}
						/>
					</>
				)}
			</div>

			<div className="h-px w-full bg-border" />

			<div className="flex flex-col gap-5">
				<div className="flex items-center gap-2">
					<BoxesIcon className="size-4 text-muted-foreground" />
					<h2 className="font-semibold">
						Starred addons
						{!addonsLoading && (
							<span className="ml-2 font-mono text-sm font-normal text-muted-foreground">
								{addonPagination.total}
							</span>
						)}
					</h2>
				</div>

				{addonsLoading ? (
					<SectionSkeleton />
				) : addons.length === 0 ? (
					<EmptyState
						icon={BoxesIcon}
						title="No starred addons yet"
						description="Addons you star will show up here."
					/>
				) : (
					<>
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{addons.map((addon) => (
								<AddonCard key={addon.id} addon={addon} />
							))}
						</div>
						<PaginationControls
							page={addonsPage}
							totalPages={addonPagination.totalPages}
							onPageChange={setAddonsPage}
						/>
					</>
				)}
			</div>

			<div className="h-px w-full bg-border" />

			<div className="flex flex-col gap-5">
				<div className="flex items-center gap-2">
					<LayersIcon className="size-4 text-muted-foreground" />
					<h2 className="font-semibold">
						Starred stacks
						{!stacksLoading && (
							<span className="ml-2 font-mono text-sm font-normal text-muted-foreground">
								{stackPagination.total}
							</span>
						)}
					</h2>
				</div>

				{stacksLoading ? (
					<SectionSkeleton />
				) : stacks.length === 0 ? (
					<EmptyState
						icon={LayersIcon}
						title="No starred stacks yet"
						description="Stacks you star will show up here."
					/>
				) : (
					<>
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{stacks.map((stack) => (
								<StackCard key={stack.id} stack={stack} />
							))}
						</div>
						<PaginationControls
							page={stacksPage}
							totalPages={stackPagination.totalPages}
							onPageChange={setStacksPage}
						/>
					</>
				)}
			</div>
		</div>
	);
}
