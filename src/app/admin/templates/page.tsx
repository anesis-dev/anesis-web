"use client";

import { useQueryClient } from "@tanstack/react-query";
import { PaginationControls } from "@/components/PaginationControls";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useTemplates } from "@/hooks/useTemplates";
import { useAuth } from "@/hooks/useAuth";
import {
	AlertCircleIcon,
	GitBranchIcon,
	ShieldCheckIcon,
	ShieldOffIcon,
	Trash2Icon,
	ExternalLinkIcon,
	LoaderIcon,
	PackageIcon,
	RefreshCcwIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useMemo } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/date";
import { ITemplate } from "@/types/template";
import {
	deleteTemplate,
	updateTemplateAsOfficial,
	updateTemplateOfficialStatus,
} from "@/services/template";
import { getTemplateHref, getTemplateRef } from "@/lib/template-ref";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useTemplateVersions } from "@/hooks/useTemplateVersions";

function SkeletonRow() {
	return (
		<tr className="border-b animate-pulse">
			<td className="py-3 px-4">
				<div className="h-4 w-36 rounded bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-4 w-24 rounded bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-4 w-20 rounded bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-4 w-28 rounded bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-5 w-16 rounded-full bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-4 w-20 rounded bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="flex gap-2">
					<div className="h-7 w-7 rounded bg-muted" />
					<div className="h-7 w-7 rounded bg-muted" />
					<div className="h-7 w-7 rounded bg-muted" />
					<div className="h-7 w-7 rounded bg-muted" />
				</div>
			</td>
		</tr>
	);
}

function OfficialBadge({ official }: { official: boolean }) {
	return official ? (
		<span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
			<ShieldCheckIcon className="size-3" />
			Official
		</span>
	) : (
		<span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
			Community
		</span>
	);
}

const PAGE_SIZE = 10;

type Notice =
	| { type: "success"; message: string }
	| { type: "error"; message: string }
	| null;

function TemplateVersionsDialog({
	template,
	open,
	busyAction,
	onOpenChange,
	onToggleOfficial,
}: {
	template: ITemplate | null;
	open: boolean;
	busyAction: string | null;
	onOpenChange: (open: boolean) => void;
	onToggleOfficial: (template: ITemplate) => void;
}) {
	const templateName = template?.name ?? "";
	const { versions, isLoading, isError } = useTemplateVersions(templateName);

	const visibleVersions =
		versions.length > 0 ? versions : template ? [template] : [];

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-3xl">
				<DialogHeader>
					<DialogTitle>Template versions</DialogTitle>
					<DialogDescription>
						{template ? (
							<>
								Choose the exact published version for{" "}
								<span className="font-mono text-foreground">{template.name}</span> and
								change its moderation status.
							</>
						) : (
							"No template selected."
						)}
					</DialogDescription>
				</DialogHeader>

				{isLoading ? (
					<div className="space-y-3">
						{Array.from({ length: 3 }).map((_, index) => (
							<div
								key={index}
								className="animate-pulse rounded-xl border bg-muted/20 p-4"
							>
								<div className="h-4 w-28 rounded bg-muted" />
								<div className="mt-3 h-3 w-40 rounded bg-muted" />
							</div>
						))}
					</div>
				) : isError ? (
					<div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
						Unable to load template versions right now.
					</div>
				) : (
					<div className="max-h-[65vh] space-y-3 overflow-y-auto pr-1">
						{visibleVersions.map((version) => {
							const isBusy = busyAction === `official:${version.id}`;

							return (
								<div
									key={version.id}
									className="rounded-xl border bg-background/80 p-4"
								>
									<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
										<div className="space-y-2">
											<div className="flex flex-wrap items-center gap-2">
												<span className="rounded-md border bg-muted/30 px-2.5 py-1 font-mono text-xs text-foreground">
													v{version.version}
												</span>
												<OfficialBadge official={version.official} />
											</div>
											<div className="space-y-1 text-sm text-muted-foreground">
												<p className="font-medium text-foreground">
													{version.config.metadata.displayName}
												</p>
												<p>Published {formatDate(version.created_at)}</p>
											</div>
										</div>

										<div className="flex flex-wrap items-center gap-2">
											<Button asChild size="sm" variant="outline">
												<Link href={getTemplateHref(version)}>
													Open version
												</Link>
											</Button>
											<Button
												type="button"
												size="sm"
												variant={version.official ? "secondary" : "default"}
												disabled={busyAction !== null}
												onClick={() => onToggleOfficial(version)}
												aria-label={
													version.official
														? `Mark version ${version.version} as community`
														: `Mark version ${version.version} as official`
												}
											>
												{isBusy ? (
													<>
														<LoaderIcon className="size-3.5 animate-spin" />
														Updating...
													</>
												) : version.official ? (
													<>
														<ShieldOffIcon className="size-3.5" />
														Mark as community
													</>
												) : (
													<>
														<ShieldCheckIcon className="size-3.5" />
														Mark as official
													</>
												)}
											</Button>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}

export default function AdminTemplatesPage() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const searchActive = search.trim().length > 0;
	const { templates, isLoading, isError, pagination } = useTemplates({
		page: searchActive ? 1 : page,
		pageSize: searchActive ? 100 : PAGE_SIZE,
	});
	const [notice, setNotice] = useState<Notice>(null);
	const [busyAction, setBusyAction] = useState<string | null>(null);
	const [pendingDelete, setPendingDelete] = useState<ITemplate | null>(null);
	const [versionsTarget, setVersionsTarget] = useState<ITemplate | null>(null);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return templates;
		return templates.filter(
			(t) =>
				t.name.toLowerCase().includes(q) ||
				t.config.metadata.displayName.toLowerCase().includes(q) ||
				t.config.author.github.toLowerCase().includes(q) ||
				t.config.specialization.toLowerCase().includes(q),
		);
	}, [templates, search]);

	const totalCount = pagination?.total ?? templates.length;
	const localPagination = searchActive || !pagination;
	const totalPages = Math.max(
		1,
		localPagination
			? Math.ceil(filtered.length / PAGE_SIZE)
			: (pagination?.totalPages ?? 1),
	);
	const currentPage = Math.min(page, totalPages);
	const visibleTemplates = localPagination
		? filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
		: filtered;

	async function refreshTemplateQueries() {
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: ["templates"] }),
			queryClient.invalidateQueries({ queryKey: ["my-templates"] }),
			queryClient.invalidateQueries({ queryKey: ["template"] }),
			queryClient.invalidateQueries({ queryKey: ["template-versions"] }),
		]);
	}

	async function handleRefreshOfficialTemplate(template: ITemplate) {
		setBusyAction(`refresh-official:${template.id}`);
		setNotice(null);

		try {
			await updateTemplateAsOfficial(template.url);
			await refreshTemplateQueries();
			setNotice({
				type: "success",
				message: template.official
					? `${template.config.metadata.displayName} was refreshed from GitHub and kept official.`
					: `${template.config.metadata.displayName} was refreshed from GitHub and marked as official.`,
			});
		} catch (error) {
			setNotice({
				type: "error",
				message:
					error instanceof Error
						? error.message
						: "Failed to refresh template as official.",
			});
		} finally {
			setBusyAction(null);
		}
	}

	async function handleToggleOfficial(template: ITemplate) {
		const nextOfficial = !template.official;
		setBusyAction(`official:${template.id}`);
		setNotice(null);

		try {
			await updateTemplateOfficialStatus(template.id, nextOfficial);
			await refreshTemplateQueries();
			setNotice({
				type: "success",
				message: nextOfficial
					? `${template.config.metadata.displayName} v${template.version} is now marked as official.`
					: `${template.config.metadata.displayName} v${template.version} was moved back to community.`,
			});
		} catch (error) {
			setNotice({
				type: "error",
				message:
					error instanceof Error
						? error.message
						: "Failed to update template official status.",
			});
		} finally {
			setBusyAction(null);
		}
	}

	async function handleDeleteTemplate() {
		if (!pendingDelete) {
			return;
		}

		const template = pendingDelete;
		const templateRef = getTemplateRef(template);
		setBusyAction(`delete:${template.id}`);
		setNotice(null);

		try {
			await deleteTemplate(templateRef);
			await refreshTemplateQueries();
			setPendingDelete(null);
			setNotice({
				type: "success",
				message: `${template.config.metadata.displayName} was deleted from the registry.`,
			});
		} catch (error) {
			setNotice({
				type: "error",
				message:
					error instanceof Error ? error.message : "Failed to delete template.",
			});
		} finally {
			setBusyAction(null);
		}
	}

	return (
		<div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Templates</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Manage all templates published on the platform.
					</p>
				</div>

				{!isLoading && (
					<span className="mt-1 font-mono text-sm text-muted-foreground">
						{filtered.length === totalCount
							? `${totalCount} total`
							: `${filtered.length} / ${totalCount}`}
					</span>
				)}
			</div>

			{/* Search */}
			<Input
				placeholder="Search by name, author or specialization…"
				value={search}
				onChange={(e) => {
					setSearch(e.target.value);
					setPage(1);
				}}
				className="w-full sm:max-w-sm"
			/>

			<Card className="border-dashed">
				<CardHeader>
					<CardTitle className="text-sm">Template moderation actions</CardTitle>
					<CardDescription>
						Open a package version list, choose the exact release you want to
						moderate, then change its official status or keep owner-based GitHub
						re-sync available where appropriate.
					</CardDescription>
				</CardHeader>
			</Card>

			{notice ? (
				<Alert variant={notice.type === "error" ? "destructive" : "default"}>
					<AlertCircleIcon />
					<AlertTitle>
						{notice.type === "error" ? "Action failed" : "Action completed"}
					</AlertTitle>
					<AlertDescription>{notice.message}</AlertDescription>
				</Alert>
			) : null}

			{isError && (
				<div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
					<AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
					<p>Templates could not be loaded right now.</p>
				</div>
			)}

			<div className="rounded-xl border overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-[860px] w-full text-sm">
						<thead>
							<tr className="border-b bg-muted/40 text-left text-xs font-medium text-muted-foreground">
								<th className="py-3 px-4">Name</th>
								<th className="py-3 px-4">Display Name</th>
								<th className="py-3 px-4">Author</th>
								<th className="py-3 px-4">Specialization</th>
								<th className="py-3 px-4">Status</th>
								<th className="py-3 px-4">Published</th>
								<th className="py-3 px-4">Actions</th>
							</tr>
						</thead>
						<tbody>
							{isLoading ? (
								Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
							) : isError ? (
								<tr>
									<td colSpan={7}>
										<div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
											<AlertCircleIcon className="size-7 text-muted-foreground" />
											<p className="text-sm text-muted-foreground">
												Unable to fetch the template list right now.
											</p>
										</div>
									</td>
								</tr>
							) : filtered.length === 0 ? (
								<tr>
									<td colSpan={7}>
										<div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
											<PackageIcon className="size-7 text-muted-foreground" />
											<p className="text-sm text-muted-foreground">
												{templates.length === 0
													? "No templates published yet."
													: "No templates match your search."}
											</p>
										</div>
									</td>
								</tr>
							) : (
								visibleTemplates.map((t) => (
									<tr
										key={t.id}
										className="border-b transition-colors last:border-0 hover:bg-muted/30"
									>
										<td className="py-3 px-4 font-mono text-xs">
											<Link
												href={getTemplateHref(t)}
												className="transition-colors hover:text-foreground"
											>
												{t.name}
											</Link>
										</td>
										<td className="py-3 px-4 font-medium">
											{t.config.metadata.displayName}
										</td>
										<td className="py-3 px-4">
											<Link
												href={`/user/${t.config.author.github}`}
												className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
											>
												@{t.config.author.github}
											</Link>
										</td>
										<td className="py-3 px-4 text-muted-foreground">
											{t.config.specialization || "—"}
										</td>
										<td className="py-3 px-4">
											<OfficialBadge official={t.official} />
										</td>
										<td className="py-3 px-4 text-xs text-muted-foreground">
											{formatDate(t.created_at)}
										</td>
										<td className="py-3 px-4">
											<div className="flex flex-wrap items-center gap-1.5">
												{(() => {
													const isOwnedByCurrentUser = user?.id === t.owner_id;

													return (
														<>
												<Button
													type="button"
													size="sm"
													variant="outline"
													onClick={() => setVersionsTarget(t)}
													className="h-7 gap-1.5 px-2.5 text-xs"
													aria-label={`Manage versions for ${t.config.metadata.displayName}`}
												>
													<GitBranchIcon className="size-3.5" />
													{t.versionCount ?? 1} version
													{(t.versionCount ?? 1) === 1 ? "" : "s"}
												</Button>

												<Button
													asChild
													size="icon-xs"
													variant="ghost"
													title="View repository"
													aria-label={`Open repository for ${t.config.metadata.displayName}`}
												>
													<Link
														href={t.config.repository.url}
														target="_blank"
														rel="noopener noreferrer"
													>
														<ExternalLinkIcon />
													</Link>
												</Button>

												<Button
													size="icon-xs"
													variant="ghost"
													title={
														isOwnedByCurrentUser
															? "Refresh as official template"
															: "Only the template owner can re-sync it from GitHub"
													}
													aria-label={
														isOwnedByCurrentUser
															? t.official
																? `Refresh official metadata for ${t.config.metadata.displayName}`
																: `Refresh ${t.config.metadata.displayName} as official`
															: `GitHub refresh unavailable for ${t.config.metadata.displayName}`
													}
													disabled={busyAction !== null || !isOwnedByCurrentUser}
													onClick={() => handleRefreshOfficialTemplate(t)}
													className="text-muted-foreground hover:text-primary"
												>
													{busyAction === `refresh-official:${t.id}` ? (
														<LoaderIcon className="animate-spin" />
													) : (
														<RefreshCcwIcon />
													)}
												</Button>

												<Button
													size="icon-xs"
													variant="ghost"
													title={
														t.official
															? "Mark as community template"
															: "Mark as official template"
													}
													aria-label={
														t.official
															? `Mark ${t.config.metadata.displayName} as community`
															: `Mark ${t.config.metadata.displayName} as official`
													}
													disabled={busyAction !== null}
													onClick={() => handleToggleOfficial(t)}
													className={
														t.official
															? "text-primary hover:text-muted-foreground"
															: "text-muted-foreground hover:text-primary"
													}
												>
													{busyAction === `official:${t.id}` ? (
														<LoaderIcon className="animate-spin" />
													) : t.official ? (
														<ShieldOffIcon />
													) : (
														<ShieldCheckIcon />
													)}
												</Button>

												<Button
													size="icon-xs"
													variant="ghost"
													title="Delete template"
													aria-label={`Delete ${t.config.metadata.displayName}`}
													disabled={busyAction !== null}
													onClick={() => setPendingDelete(t)}
													className="text-muted-foreground hover:text-destructive"
												>
													{busyAction === `delete:${t.id}` ? (
														<LoaderIcon className="animate-spin" />
													) : (
														<Trash2Icon />
													)}
												</Button>
														</>
													);
												})()}
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
			{!isLoading && !isError && (
				<PaginationControls
					page={currentPage}
					totalPages={totalPages}
					onPageChange={setPage}
				/>
			)}

			<Dialog
				open={pendingDelete !== null}
				onOpenChange={(open) => {
					if (!open && busyAction?.startsWith("delete:")) {
						return;
					}

					setPendingDelete(open ? pendingDelete : null);
				}}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Delete template</DialogTitle>
						<DialogDescription>
							{pendingDelete ? (
								<>
									This removes{" "}
									<span className="font-mono text-foreground">
										{getTemplateRef(pendingDelete)}
									</span>{" "}
									from the registry.
								</>
							) : (
								"No template selected."
							)}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setPendingDelete(null)}
							disabled={busyAction?.startsWith("delete:")}
						>
							Cancel
						</Button>
						<Button
							type="button"
							variant="destructive"
							onClick={handleDeleteTemplate}
							disabled={!pendingDelete || busyAction?.startsWith("delete:")}
						>
							{busyAction?.startsWith("delete:") ? (
								<>
									<LoaderIcon className="size-3.5 animate-spin" />
									Deleting...
								</>
							) : (
								<>
									<Trash2Icon className="size-3.5" />
									Delete template
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<TemplateVersionsDialog
				template={versionsTarget}
				open={versionsTarget !== null}
				busyAction={busyAction}
				onOpenChange={(open) => {
					if (!open) {
						setVersionsTarget(null);
					}
				}}
				onToggleOfficial={handleToggleOfficial}
			/>
		</div>
	);
}
