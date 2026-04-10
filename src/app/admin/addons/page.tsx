"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PaginationControls } from "@/components/PaginationControls";
import { AddonStatusBadge } from "@/components/addons/AddonCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAddons } from "@/hooks/useAddons";
import { formatDate } from "@/lib/date";
import { deleteAddon } from "@/services/addon";
import { IAddon } from "@/types/addon";
import {
	AlertCircleIcon,
	BoxesIcon,
	ExternalLinkIcon,
	LoaderIcon,
	Trash2Icon,
} from "lucide-react";

const PAGE_SIZE = 10;

type Notice =
	| { type: "success"; message: string }
	| { type: "error"; message: string }
	| null;

function SkeletonRow() {
	return (
		<tr className="border-b animate-pulse">
			<td className="py-3 px-4">
				<div className="h-4 w-28 rounded bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-4 w-36 rounded bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-4 w-20 rounded bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-4 w-16 rounded bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-5 w-16 rounded-full bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-4 w-24 rounded bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="flex gap-2">
					<div className="h-7 w-7 rounded bg-muted" />
					<div className="h-7 w-7 rounded bg-muted" />
				</div>
			</td>
		</tr>
	);
}

export default function AdminAddonsPage() {
	const { addons, isLoading, isError } = useAddons();
	const queryClient = useQueryClient();
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [notice, setNotice] = useState<Notice>(null);
	const [busyAction, setBusyAction] = useState<string | null>(null);
	const [pendingDelete, setPendingDelete] = useState<IAddon | null>(null);

	const filtered = useMemo(() => {
		const query = search.trim().toLowerCase();
		if (!query) {
			return addons;
		}

		return addons.filter((addon) =>
			[
				addon.addon_id,
				addon.name,
				addon.config.author,
				addon.version,
				addon.config.description,
			]
				.join(" ")
				.toLowerCase()
				.includes(query),
		);
	}, [addons, search]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const paginatedAddons = filtered.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);

	async function handleDeleteAddon() {
		if (!pendingDelete) {
			return;
		}

		const addon = pendingDelete;
		setBusyAction(`delete:${addon.id}`);
		setNotice(null);

		try {
			await deleteAddon(addon.addon_id, addon.version);
			await queryClient.invalidateQueries({ queryKey: ["addons"] });
			setPendingDelete(null);
			setNotice({
				type: "success",
				message: `${addon.name} was deleted from the registry.`,
			});
		} catch (error) {
			setNotice({
				type: "error",
				message:
					error instanceof Error ? error.message : "Failed to delete addon.",
			});
		} finally {
			setBusyAction(null);
		}
	}

	return (
		<div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Addons</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Moderate addon registry entries published on the platform.
					</p>
				</div>

				{!isLoading && (
					<span className="mt-1 font-mono text-sm text-muted-foreground">
						{filtered.length === addons.length
							? `${addons.length} total`
							: `${filtered.length} / ${addons.length}`}
					</span>
				)}
			</div>

			<Input
				placeholder="Search by addon id, name, author or version…"
				value={search}
				onChange={(event) => {
					setSearch(event.target.value);
					setPage(1);
				}}
				className="w-full sm:max-w-sm"
			/>

			<Card className="border-dashed">
				<CardHeader>
					<CardTitle className="text-sm">Addon moderation actions</CardTitle>
					<CardDescription>
						The backend currently exposes delete actions for registry entries.
						Official-status management has not been added yet.
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

			<div className="rounded-xl border overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-[860px] w-full text-sm">
						<thead>
							<tr className="border-b bg-muted/40 text-left text-xs font-medium text-muted-foreground">
								<th className="py-3 px-4">Addon ID</th>
								<th className="py-3 px-4">Name</th>
								<th className="py-3 px-4">Author</th>
								<th className="py-3 px-4">Version</th>
								<th className="py-3 px-4">Status</th>
								<th className="py-3 px-4">Published</th>
								<th className="py-3 px-4">Actions</th>
							</tr>
						</thead>
						<tbody>
							{isLoading ? (
								Array.from({ length: 8 }).map((_, index) => (
									<SkeletonRow key={index} />
								))
							) : isError ? (
								<tr>
									<td colSpan={7}>
										<div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
											<AlertCircleIcon className="size-7 text-muted-foreground" />
											<p className="text-sm text-muted-foreground">
												Unable to fetch the addon list right now.
											</p>
										</div>
									</td>
								</tr>
							) : filtered.length === 0 ? (
								<tr>
									<td colSpan={7}>
										<div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
											<BoxesIcon className="size-7 text-muted-foreground" />
											<p className="text-sm text-muted-foreground">
												{addons.length === 0
													? "No addons published yet."
													: "No addons match your search."}
											</p>
										</div>
									</td>
								</tr>
							) : (
								paginatedAddons.map((addon) => (
									<tr
										key={addon.id}
										className="border-b transition-colors last:border-0 hover:bg-muted/30"
									>
										<td className="py-3 px-4 font-mono text-xs">
											{addon.addon_id}
										</td>
										<td className="py-3 px-4 font-medium">{addon.name}</td>
										<td className="py-3 px-4 text-muted-foreground">
											{addon.config.author}
										</td>
										<td className="py-3 px-4 font-mono text-xs">
											{addon.version}
										</td>
										<td className="py-3 px-4">
											<AddonStatusBadge official={addon.official} />
										</td>
										<td className="py-3 px-4 text-xs text-muted-foreground">
											{formatDate(addon.created_at)}
										</td>
										<td className="py-3 px-4">
											<div className="flex items-center gap-1">
												<Button
													asChild
													size="icon-xs"
													variant="ghost"
													title="View repository"
													aria-label={`Open repository for ${addon.name}`}
												>
													<Link
														href={addon.url}
														target="_blank"
														rel="noopener noreferrer"
													>
														<ExternalLinkIcon />
													</Link>
												</Button>

												<Button
													size="icon-xs"
													variant="ghost"
													title="Delete addon"
													aria-label={`Delete ${addon.name}`}
													disabled={busyAction !== null}
													onClick={() => setPendingDelete(addon)}
													className="text-muted-foreground hover:text-destructive"
												>
													{busyAction === `delete:${addon.id}` ? (
														<LoaderIcon className="animate-spin" />
													) : (
														<Trash2Icon />
													)}
												</Button>
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
						<DialogTitle>Delete addon</DialogTitle>
						<DialogDescription>
							{pendingDelete ? (
								<>
									This removes{" "}
									<span className="font-mono text-foreground">
										{pendingDelete.addon_id}@{pendingDelete.version}
									</span>{" "}
									from the registry.
								</>
							) : (
								"No addon selected."
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
							onClick={handleDeleteAddon}
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
									Delete addon
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
