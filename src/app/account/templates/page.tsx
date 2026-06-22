"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PaginationControls } from "@/components/PaginationControls";
import { OwnedTemplateCard } from "@/components/templates/OwnedTemplateCard";
import { PublishTemplateDialog } from "@/components/templates/PublishTemplateDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@/components/ui/input-group";
import { useAuth } from "@/hooks/useAuth";
import { useMyTemplates } from "@/hooks/useMyTemplates";
import {
	AlertCircleIcon,
	GitBranchIcon,
	PackageIcon,
	SearchIcon,
	ShieldCheckIcon,
	SparklesIcon,
} from "lucide-react";

const PAGE_SIZE = 6;

function MetricStat({
	label,
	value,
	icon: Icon,
}: {
	label: string;
	value: string | number;
	icon: React.ElementType;
}) {
	return (
		<div className="flex items-center gap-2 rounded-md border bg-background/60 px-3 py-1.5">
			<Icon className="size-3.5 text-muted-foreground" />
			<span className="text-sm font-semibold text-foreground">{value}</span>
			<span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
				{label}
			</span>
		</div>
	);
}

export default function AccountTemplatesPage() {
	const { user, login } = useAuth();
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const searchActive = search.trim().length > 0;
	const { templates, isLoading, isError, pagination } = useMyTemplates({
		enabled: !!user,
		page: searchActive ? 1 : page,
		pageSize: searchActive ? 100 : PAGE_SIZE,
	});
	const isAdmin = user?.role === "admin";
	const totalCount = pagination?.total ?? templates.length;
	const officialPackages = templates.filter((template) => template.official).length;
	const totalVersions = templates.reduce(
		(total, template) => total + (template.versionCount ?? 1),
		0,
	);

	const myTemplates = useMemo(() => {
		const query = search.trim().toLowerCase();
		if (!query) {
			return templates;
		}

		return templates.filter((template) =>
			[
				template.name,
				template.config.metadata.displayName,
				template.config.metadata.description,
				template.config.specialization,
				...template.config.languages,
				...template.config.technologies,
			]
				.join(" ")
				.toLowerCase()
				.includes(query),
		);
	}, [search, templates]);

	const localPagination = searchActive || !pagination;
	const totalPages = Math.max(
		1,
		localPagination
			? Math.ceil(myTemplates.length / PAGE_SIZE)
			: (pagination?.totalPages ?? 1),
	);
	const currentPage = Math.min(page, totalPages);
	const visibleTemplates = localPagination
		? myTemplates.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
		: myTemplates;
	const packageSummary =
		!pagination || totalCount === myTemplates.length
			? `${myTemplates.length} package(s) across ${totalVersions} published version(s)`
			: `${myTemplates.length} of ${totalCount} package(s) across ${totalVersions} visible version(s)`;

	if (!user) {
		return (
			<div className="mx-auto flex min-h-[50vh] w-full max-w-5xl items-center justify-center px-4 py-10 sm:px-5">
				<div className="flex w-full max-w-xl flex-col gap-3 rounded-2xl border bg-card p-5 sm:p-6">
					<h1 className="text-2xl font-semibold tracking-tight">
						Your templates
					</h1>
					<p className="text-sm text-muted-foreground">
						Sign in with GitHub to view templates published from your account.
					</p>
					<div className="flex flex-wrap gap-3">
						<Button onClick={login}>
							Login with GitHub
						</Button>
						<Link href="/">
							<Button variant="outline">Go back to home</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-5 lg:px-8">
			<section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<h1 className="text-2xl font-semibold tracking-tight">
					Your templates
				</h1>

				<div className="flex flex-wrap items-center gap-2">
					<MetricStat
						label="Packages"
						value={isLoading ? "..." : totalCount}
						icon={PackageIcon}
					/>
					<MetricStat
						label="Versions"
						value={isLoading ? "..." : totalVersions}
						icon={GitBranchIcon}
					/>
					<MetricStat
						label="Official"
						value={isLoading ? "..." : officialPackages}
						icon={ShieldCheckIcon}
					/>
				</div>
			</section>

			<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
				<div className="space-y-3">
					<InputGroup className="h-11 bg-background">
						<InputGroupAddon>
							<InputGroupText>
								<SearchIcon className="size-4" />
								Search
							</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							value={search}
							onChange={(event) => {
								setSearch(event.target.value);
								setPage(1);
							}}
							placeholder="Filter by package name, description, specialization, language, or stack"
							aria-label="Search your templates"
						/>
					</InputGroup>
					<p className="text-xs text-muted-foreground">
						{isLoading ? "Loading templates..." : packageSummary}
					</p>
				</div>

				<PublishTemplateDialog className="h-11 w-full justify-center gap-1.5 sm:w-auto" />
			</div>

			{isAdmin ? (
				<Alert>
					<SparklesIcon />
					<AlertTitle>Admin sync controls are enabled</AlertTitle>
					<AlertDescription>
						Use <strong>Update as official</strong> on any package card to pull the
						latest GitHub metadata and preserve official status in one step.
					</AlertDescription>
				</Alert>
			) : null}

			{isError && (
				<Alert variant="destructive">
					<AlertCircleIcon />
					<AlertTitle>Templates are unavailable</AlertTitle>
					<AlertDescription>
						Try again in a moment. The registry did not return your published
						packages.
					</AlertDescription>
				</Alert>
			)}

			{!isLoading && !isError && myTemplates.length === 0 && (
				<div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/10 py-16 text-center">
					<PackageIcon className="size-8 text-muted-foreground" />
					<div className="space-y-1">
						<p className="font-medium">
							{templates.length === 0 ? "No templates yet" : "No templates match this filter"}
						</p>
						<p className="text-sm text-muted-foreground">
							{templates.length === 0
								? "Publish your first template from a GitHub directory that contains `anesis.template.json`."
								: "Try another search phrase or clear the current filter to see the rest of your packages."}
						</p>
					</div>
					{templates.length > 0 ? (
						<Button
							type="button"
							variant="outline"
							onClick={() => setSearch("")}
						>
							Clear search
						</Button>
					) : null}
				</div>
			)}

			{!isLoading && !isError && myTemplates.length > 0 && (
				<>
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{visibleTemplates.map((template) => (
							<OwnedTemplateCard
								key={template.id}
								template={template}
								versionCount={template.versionCount ?? 1}
								isAdmin={isAdmin}
							/>
						))}
					</div>
					<PaginationControls
						page={currentPage}
						totalPages={totalPages}
						onPageChange={setPage}
					/>
				</>
			)}
		</div>
	);
}
