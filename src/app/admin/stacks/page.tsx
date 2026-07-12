"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PaginationControls } from "@/components/PaginationControls";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useStacks } from "@/hooks/useStacks";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date";
import { deleteStack, updateStackOfficialStatus } from "@/services/stack";
import { IStack } from "@/types/stack";
import {
	AlertCircleIcon,
	ExternalLinkIcon,
	LayersIcon,
	LoaderIcon,
	ShieldCheckIcon,
	ShieldOffIcon,
	Trash2Icon,
} from "lucide-react";

const PAGE_SIZE = 10;

type Notice =
	| { type: "success"; message: string }
	| { type: "error"; message: string }
	| null;

export default function AdminStacksPage() {
	const queryClient = useQueryClient();
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const { stacks, isLoading, isError, pagination } = useStacks({ pageSize: 100 });
	const [notice, setNotice] = useState<Notice>(null);
	const [busyAction, setBusyAction] = useState<string | null>(null);
	const [pendingDelete, setPendingDelete] = useState<IStack | null>(null);

	const filtered = useMemo(() => {
		const query = search.trim().toLowerCase();
		if (!query) return stacks;
		return stacks.filter((stack) =>
			[stack.stack_id, stack.name, stack.description, stack.config?.template]
				.filter(Boolean)
				.some((field) => field.toLowerCase().includes(query)),
		);
	}, [stacks, search]);

	const totalCount = pagination?.total ?? stacks.length;
	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	async function refresh() {
		await queryClient.invalidateQueries({ queryKey: ["stacks"] });
	}

	async function handleToggleOfficial(stack: IStack) {
		const nextOfficial = !stack.official;
		setBusyAction(`official:${stack.id}`);
		setNotice(null);
		try {
			await updateStackOfficialStatus(stack.id, nextOfficial);
			await refresh();
			setNotice({
				type: "success",
				message: nextOfficial
					? `${stack.name} is now marked as official.`
					: `${stack.name} was moved back to community.`,
			});
		} catch (error) {
			setNotice({
				type: "error",
				message:
					error instanceof Error ? error.message : "Failed to update official status.",
			});
		} finally {
			setBusyAction(null);
		}
	}

	async function handleDelete() {
		if (!pendingDelete) return;
		const stack = pendingDelete;
		setBusyAction(`delete:${stack.id}`);
		setNotice(null);
		try {
			await deleteStack(stack.stack_id);
			await refresh();
			setPendingDelete(null);
			setNotice({ type: "success", message: `${stack.name} was deleted from the registry.` });
		} catch (error) {
			setNotice({
				type: "error",
				message: error instanceof Error ? error.message : "Failed to delete stack.",
			});
		} finally {
			setBusyAction(null);
		}
	}

	return (
		<div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Stacks</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Moderate stack registry entries published on the platform.
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

			<Input
				placeholder="Search by stack id, name or template…"
				value={search}
				onChange={(event) => {
					setSearch(event.target.value);
					setPage(1);
				}}
				className="w-full sm:max-w-sm"
			/>

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
					<table className="min-w-[760px] w-full text-sm">
						<thead>
							<tr className="border-b bg-muted/40 text-left text-xs font-medium text-muted-foreground">
								<th className="py-3 px-4">Stack ID</th>
								<th className="py-3 px-4">Name</th>
								<th className="py-3 px-4">Template</th>
								<th className="py-3 px-4">Status</th>
								<th className="py-3 px-4">Published</th>
								<th className="py-3 px-4">Actions</th>
							</tr>
						</thead>
						<tbody>
							{isLoading ? (
								<tr>
									<td colSpan={6}>
										<div className="flex items-center justify-center py-16">
											<LoaderIcon className="size-5 animate-spin text-muted-foreground" />
										</div>
									</td>
								</tr>
							) : isError ? (
								<tr>
									<td colSpan={6}>
										<div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
											<AlertCircleIcon className="size-7 text-muted-foreground" />
											<p className="text-sm text-muted-foreground">
												Unable to fetch the stack list right now.
											</p>
										</div>
									</td>
								</tr>
							) : filtered.length === 0 ? (
								<tr>
									<td colSpan={6}>
										<div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
											<LayersIcon className="size-7 text-muted-foreground" />
											<p className="text-sm text-muted-foreground">
												{stacks.length === 0
													? "No stacks published yet."
													: "No stacks match your search."}
											</p>
										</div>
									</td>
								</tr>
							) : (
								visible.map((stack) => (
									<tr
										key={stack.id}
										className="border-b transition-colors last:border-0 hover:bg-muted/30"
									>
										<td className="py-3 px-4 font-mono text-xs">{stack.stack_id}</td>
										<td className="py-3 px-4 font-medium">{stack.name}</td>
										<td className="py-3 px-4 font-mono text-xs text-muted-foreground">
											{stack.config?.template}
										</td>
										<td className="py-3 px-4">
											<span
												className={cn(
													"rounded-full px-2 py-0.5 text-xs",
													stack.official
														? "bg-primary/10 text-primary"
														: "bg-muted text-muted-foreground",
												)}
											>
												{stack.official ? "official" : "community"}
											</span>
										</td>
										<td className="py-3 px-4 text-xs text-muted-foreground">
											{formatDate(stack.created_at)}
										</td>
										<td className="py-3 px-4">
											<div className="flex items-center gap-1">
												<Button
													asChild
													size="icon-xs"
													variant="ghost"
													title="View repository"
												>
													<Link href={stack.url} target="_blank" rel="noopener noreferrer">
														<ExternalLinkIcon />
													</Link>
												</Button>
												<Button
													size="icon-xs"
													variant="ghost"
													title={
														stack.official
															? "Mark as community stack"
															: "Mark as official stack"
													}
													disabled={busyAction !== null}
													onClick={() => handleToggleOfficial(stack)}
													className={cn(
														stack.official
															? "text-primary hover:text-muted-foreground"
															: "text-muted-foreground hover:text-primary",
													)}
												>
													{busyAction === `official:${stack.id}` ? (
														<LoaderIcon className="animate-spin" />
													) : stack.official ? (
														<ShieldOffIcon />
													) : (
														<ShieldCheckIcon />
													)}
												</Button>
												<Button
													size="icon-xs"
													variant="ghost"
													title="Delete stack"
													disabled={busyAction !== null}
													onClick={() => setPendingDelete(stack)}
													className="text-muted-foreground hover:text-destructive"
												>
													{busyAction === `delete:${stack.id}` ? (
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
					if (!open && busyAction?.startsWith("delete:")) return;
					setPendingDelete(open ? pendingDelete : null);
				}}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Delete stack</DialogTitle>
						<DialogDescription>
							{pendingDelete ? (
								<>
									This removes{" "}
									<span className="font-mono text-foreground">
										{pendingDelete.stack_id}
									</span>{" "}
									from the registry.
								</>
							) : (
								"No stack selected."
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
							onClick={handleDelete}
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
									Delete stack
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
