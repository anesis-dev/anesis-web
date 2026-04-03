"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PaginationControls } from "@/components/PaginationControls";
import { OwnedTemplateCard } from "@/components/templates/OwnedTemplateCard";
import { PublishTemplateDialog } from "@/components/templates/PublishTemplateDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useMyTemplates } from "@/hooks/useMyTemplates";
import { AlertCircleIcon, PackageIcon } from "lucide-react";

const PAGE_SIZE = 6;

export default function AccountTemplatesPage() {
	const { user } = useAuth();
	const { templates, isLoading, isError } = useMyTemplates(!!user);
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);

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

	const totalPages = Math.max(1, Math.ceil(myTemplates.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const paginatedTemplates = myTemplates.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);

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
					<div>
						<Link href="/">
							<Button variant="outline">Go back to home</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-5 lg:px-8">
			<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
				<div className="space-y-1">
					<h1 className="text-3xl font-semibold tracking-tight">
						Your templates
					</h1>
					<p className="text-sm text-muted-foreground">
						Templates published under @{user.login}. Use a GitHub directory URL
						to publish a new one.
					</p>
				</div>
				<PublishTemplateDialog className="w-full gap-1.5 sm:w-auto" />
			</div>

			<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<Input
					value={search}
					onChange={(event) => {
						setSearch(event.target.value);
						setPage(1);
					}}
					placeholder="Search your templates"
					className="w-full sm:max-w-sm"
				/>
				<p className="text-xs text-muted-foreground">
					{isLoading
						? "Loading templates..."
						: `${myTemplates.length} template(s)`}
				</p>
			</div>

			{isError && (
				<div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
					<AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
					<p>Templates could not be loaded right now. Try again in a moment.</p>
				</div>
			)}

			{!isLoading && !isError && myTemplates.length === 0 && (
				<div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-16 text-center">
					<PackageIcon className="size-8 text-muted-foreground" />
					<div className="space-y-1">
						<p className="font-medium">No templates yet</p>
						<p className="text-sm text-muted-foreground">
							Publish your first template from a GitHub directory that contains
							`oxide.template.json`.
						</p>
					</div>
				</div>
			)}

			{!isLoading && !isError && paginatedTemplates.length > 0 && (
				<>
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{paginatedTemplates.map((template) => (
							<OwnedTemplateCard key={template.id} template={template} />
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
