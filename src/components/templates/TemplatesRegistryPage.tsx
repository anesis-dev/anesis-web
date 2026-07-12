"use client";

import { useState } from "react";
import { PaginationControls } from "@/components/PaginationControls";
import { useTemplates } from "@/hooks/useTemplates";
import { useAllTemplates } from "@/hooks/useAllTemplates";
import { useAuth } from "@/hooks/useAuth";
import { TemplateCard } from "@/components/templates/TemplateCard";
import {
	TemplateFilters,
	TemplateFiltersState,
} from "@/components/templates/TemplateFilters";
import { PublishTemplateDialog } from "@/components/templates/PublishTemplateDialog";
import { AlertCircleIcon, PackageIcon } from "lucide-react";

const DEFAULT_FILTERS: TemplateFiltersState = {
	search: "",
	official: false,
	specialization: null,
	languages: [],
	technologies: [],
};

const PAGE_SIZE = 24;

function SkeletonCard() {
	return (
		<div className="flex flex-col gap-4 rounded-xl border bg-card py-5 px-6 animate-pulse">
			<div className="flex items-start justify-between gap-2">
				<div className="h-4 w-2/3 rounded bg-muted" />
				<div className="h-5 w-14 rounded-full bg-muted" />
			</div>
			<div className="space-y-2">
				<div className="h-3 w-full rounded bg-muted" />
				<div className="h-3 w-4/5 rounded bg-muted" />
			</div>
			<div className="flex flex-wrap gap-1.5">
				{[80, 60, 72].map((w) => (
					<div
						key={w}
						className="h-5 rounded-md bg-muted"
						style={{ width: w }}
					/>
				))}
			</div>
			<div className="mt-auto flex items-center justify-between border-t pt-4">
				<div className="h-3 w-24 rounded bg-muted" />
				<div className="h-3 w-10 rounded bg-muted" />
			</div>
		</div>
	);
}

export function TemplatesRegistryPage() {
	const [filters, setFilters] = useState<TemplateFiltersState>(DEFAULT_FILTERS);
	const [page, setPage] = useState(1);
	// ponytail: TemplateFiltersState is structurally assignable to ICatalogFilters.
	const { templates, isLoading, isError, pagination } = useTemplates(
		{ page, pageSize: PAGE_SIZE },
		filters,
	);
	// Facet options come from the full catalog so the dropdowns stay complete
	// regardless of the current server-filtered page.
	const { templates: allTemplates } = useAllTemplates();
	const { user } = useAuth();
	const totalCount = pagination?.total ?? templates.length;
	const totalPages = Math.max(1, pagination?.totalPages ?? 1);
	const currentPage = Math.min(page, totalPages);

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-5 lg:px-8">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="flex flex-col gap-1">
					<h1 className="text-2xl font-bold tracking-tight">Templates</h1>
					<p className="text-sm text-muted-foreground">
						Browse and install project templates published by the community.
					</p>
				</div>
				{user && <PublishTemplateDialog className="w-full gap-1.5 sm:w-auto" />}
			</div>

			<TemplateFilters
				templates={allTemplates}
				filters={filters}
				onChange={(nextFilters) => {
					setFilters(nextFilters);
					setPage(1);
				}}
			/>

			{!isLoading && !isError && (
				<p className="text-xs text-muted-foreground">
					Showing{" "}
					<span className="font-medium text-foreground">{totalCount}</span>{" "}
					{totalCount === 1 ? "template" : "templates"}
				</p>
			)}

			{isLoading && (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{Array.from({ length: 12 }).map((_, i) => (
						<SkeletonCard key={i} />
					))}
				</div>
			)}

			{isError && (
				<div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 py-16 text-center">
					<AlertCircleIcon className="size-8 text-destructive" />
					<div>
						<p className="font-medium text-sm">Failed to load templates</p>
						<p className="text-xs text-muted-foreground mt-1">
							Check your connection or try again later.
						</p>
					</div>
				</div>
			)}

			{!isLoading && !isError && templates.length === 0 && (
				<div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
					<PackageIcon className="size-8 text-muted-foreground" />
					<div>
						<p className="font-medium text-sm">No templates found</p>
						<p className="text-xs text-muted-foreground mt-1">
							{allTemplates.length === 0
								? "No templates have been published yet."
								: "Try adjusting your search or filters."}
						</p>
					</div>
				</div>
			)}

			{!isLoading && !isError && templates.length > 0 && (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{templates.map((template) => (
						<TemplateCard
							key={template.id}
							template={template}
							versionCount={template.versionCount ?? 1}
							linkToLatest
						/>
					))}
				</div>
			)}

			{!isLoading && !isError && (
				<PaginationControls
					page={currentPage}
					totalPages={totalPages}
					onPageChange={setPage}
				/>
			)}
		</div>
	);
}
