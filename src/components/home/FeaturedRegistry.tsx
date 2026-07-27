"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRightIcon, LoaderIcon } from "lucide-react";
import { AddonCard } from "@/components/addons/AddonCard";
import { StackCard } from "@/components/stacks/StackCard";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { Button } from "@/components/ui/button";
import { useAddons } from "@/hooks/useAddons";
import { useStacks } from "@/hooks/useStacks";
import { useTemplates } from "@/hooks/useTemplates";
import { getDateTimestamp } from "@/lib/date";

function TemplateSkeleton() {
	return (
		<div className="flex h-full flex-col gap-4 rounded-xl border border-primary/15 bg-card/80 px-6 py-5 animate-pulse">
			<div className="flex items-start justify-between gap-3">
				<div className="h-4 w-2/3 rounded bg-muted" />
				<div className="h-5 w-16 rounded-full bg-muted" />
			</div>
			<div className="space-y-2">
				<div className="h-3 w-full rounded bg-muted" />
				<div className="h-3 w-4/5 rounded bg-muted" />
			</div>
			<div className="flex flex-wrap gap-1.5">
				<div className="h-5 w-16 rounded bg-muted" />
				<div className="h-5 w-14 rounded bg-muted" />
				<div className="h-5 w-20 rounded bg-muted" />
			</div>
			<div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
				<div className="h-3 w-24 rounded bg-muted" />
				<div className="h-7 w-16 rounded bg-muted" />
			</div>
		</div>
	);
}

function AddonSkeleton() {
	return (
		<div className="flex h-full animate-pulse flex-col gap-4 rounded-xl border border-primary/15 bg-card/80 px-6 py-5">
			<div className="flex items-start justify-between gap-3">
				<div className="space-y-2">
					<div className="h-4 w-32 rounded bg-muted" />
					<div className="h-3 w-52 rounded bg-muted" />
				</div>
				<div className="h-5 w-20 rounded-full bg-muted" />
			</div>
			<div className="flex gap-2">
				<div className="h-5 w-24 rounded bg-muted" />
				<div className="h-5 w-14 rounded bg-muted" />
			</div>
			<div className="h-3 w-28 rounded bg-muted" />
			<div className="h-3 w-36 rounded bg-muted" />
			<div className="mt-auto flex items-center gap-2 border-t border-white/10 pt-4">
				<div className="h-8 w-8 rounded bg-muted" />
				<div className="h-8 flex-1 rounded bg-muted" />
			</div>
		</div>
	);
}

function StackSkeleton() {
	return (
		<div className="flex h-full flex-col gap-4 rounded-xl border border-primary/15 bg-card/80 px-6 py-5 animate-pulse">
			<div className="flex items-start justify-between gap-3">
				<div className="h-4 w-2/3 rounded bg-muted" />
				<div className="h-5 w-16 rounded-full bg-muted" />
			</div>
			<div className="space-y-2">
				<div className="h-3 w-full rounded bg-muted" />
				<div className="h-3 w-4/5 rounded bg-muted" />
			</div>
			<div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
				<div className="h-3 w-24 rounded bg-muted" />
				<div className="h-5 w-10 rounded bg-muted" />
			</div>
		</div>
	);
}

function byOfficialThenRecent(
	a: { official: boolean; created_at: string },
	b: { official: boolean; created_at: string },
) {
	if (a.official !== b.official) {
		return Number(b.official) - Number(a.official);
	}
	return getDateTimestamp(b.created_at) - getDateTimestamp(a.created_at);
}

export function FeaturedRegistry() {
	const { templates, isLoading: templatesLoading } = useTemplates({
		pageSize: 100,
	});
	const { addons, isLoading: addonsLoading } = useAddons({ pageSize: 100 });
	const { stacks, isLoading: stacksLoading } = useStacks({ pageSize: 100 });

	const featuredTemplates = useMemo(
		() => [...templates].sort(byOfficialThenRecent).slice(0, 4),
		[templates],
	);

	const featuredAddons = useMemo(
		() => [...addons].sort(byOfficialThenRecent).slice(0, 4),
		[addons],
	);

	const featuredStacks = useMemo(
		() =>
			[...stacks]
				.sort((a, b) => {
					if (a.official !== b.official) {
						return Number(b.official) - Number(a.official);
					}
					return (
						getDateTimestamp(b.created_at) - getDateTimestamp(a.created_at)
					);
				})
				.slice(0, 4),
		[stacks],
	);

	return (
		<>
			<section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-18 sm:px-6 lg:gap-12 lg:px-8 lg:py-24">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className="space-y-2">
						<p className="text-sm font-medium text-primary">Recent addons</p>
						<h2 className="text-3xl font-bold tracking-normal">
							Latest automations from the registry
						</h2>
						<p className="max-w-2xl text-sm leading-6 text-muted-foreground">
							These packages extend Anesis with reusable commands, so the
							homepage shows live registry activity instead of only starter
							templates.
						</p>
					</div>
					<Button
						variant="outline"
						className="w-full border-primary/25 bg-black/20 hover:bg-primary/10 sm:w-auto"
						asChild
					>
						<Link href="/addons">
							View all addons
							<ArrowRightIcon className="size-4" />
						</Link>
					</Button>
				</div>

				{addonsLoading ? (
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						{Array.from({ length: 4 }).map((_, index) => (
							<AddonSkeleton key={index} />
						))}
					</div>
				) : featuredAddons.length > 0 ? (
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						{featuredAddons.map((addon) => (
							<AddonCard key={addon.id} addon={addon} />
						))}
					</div>
				) : (
					<div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-primary/25 bg-card/40 text-center">
						<LoaderIcon className="size-6 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">No addons yet</p>
							<p className="mt-1 text-xs text-muted-foreground">
								Once addons are published, they will show up here.
							</p>
						</div>
					</div>
				)}
			</section>

			<section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 pb-18 sm:px-6 lg:gap-12 lg:px-8 lg:pb-24">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className="space-y-2">
						<p className="text-sm font-medium text-primary">
							Featured templates
						</p>
						<h2 className="text-3xl font-bold tracking-normal">
							Recent starters from the registry
						</h2>
					</div>
					<Button
						variant="outline"
						className="w-full border-primary/25 bg-black/20 hover:bg-primary/10 sm:w-auto"
						asChild
					>
						<Link href="/templates">
							View all
							<ArrowRightIcon className="size-4" />
						</Link>
					</Button>
				</div>

				{templatesLoading ? (
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						{Array.from({ length: 4 }).map((_, index) => (
							<TemplateSkeleton key={index} />
						))}
					</div>
				) : featuredTemplates.length > 0 ? (
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						{featuredTemplates.map((template) => (
							<TemplateCard key={template.id} template={template} />
						))}
					</div>
				) : (
					<div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-primary/25 bg-card/40 text-center">
						<LoaderIcon className="size-6 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">No templates yet</p>
							<p className="mt-1 text-xs text-muted-foreground">
								Once templates are published, they will show up here.
							</p>
						</div>
					</div>
				)}
			</section>

			<section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 pb-18 sm:px-6 lg:gap-12 lg:px-8 lg:pb-24">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className="space-y-2">
						<p className="text-sm font-medium text-primary">Featured stacks</p>
						<h2 className="text-3xl font-bold tracking-normal">
							Ready-to-scaffold template + addon bundles
						</h2>
						<p className="max-w-2xl text-sm leading-6 text-muted-foreground">
							A stack pins a template together with an ordered list of addons,
							so a whole batteries-included setup ships in one command.
						</p>
					</div>
					<Button
						variant="outline"
						className="w-full border-primary/25 bg-black/20 hover:bg-primary/10 sm:w-auto"
						asChild
					>
						<Link href="/stacks">
							View all
							<ArrowRightIcon className="size-4" />
						</Link>
					</Button>
				</div>

				{stacksLoading ? (
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						{Array.from({ length: 4 }).map((_, index) => (
							<StackSkeleton key={index} />
						))}
					</div>
				) : featuredStacks.length > 0 ? (
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						{featuredStacks.map((stack) => (
							<StackCard key={stack.stack_id} stack={stack} />
						))}
					</div>
				) : (
					<div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-primary/25 bg-card/40 text-center">
						<LoaderIcon className="size-6 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">No stacks yet</p>
							<p className="mt-1 text-xs text-muted-foreground">
								Build one in the{" "}
								<Link href="/builder" className="text-primary hover:underline">
									stack builder
								</Link>{" "}
								and publish it to the registry.
							</p>
						</div>
					</div>
				)}
			</section>
		</>
	);
}
