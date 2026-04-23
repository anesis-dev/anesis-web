"use client";

import Link from "next/link";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
	AlertCircleIcon,
	ExternalLinkIcon,
	LoaderIcon,
	PackageIcon,
	RefreshCcwIcon,
	ShieldCheckIcon,
	Trash2Icon,
	UserIcon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
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
	DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/date";
import { getAddonHref, getAddonRef } from "@/lib/addon-ref";
import { cn } from "@/lib/utils";
import { deleteAddon, updateAddon } from "@/services/addon";
import { IAddon } from "@/types/addon";

type Notice =
	| { type: "success"; message: string }
	| { type: "error"; message: string }
	| null;

function Badge({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
				className,
			)}
		>
			{children}
		</span>
	);
}

export function OwnedAddonCard({ addon }: { addon: IAddon }) {
	const queryClient = useQueryClient();
	const addonRef = getAddonRef(addon);
	const detailsHref = getAddonHref(addon);
	const [notice, setNotice] = useState<Notice>(null);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	async function refreshAddonQueries() {
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: ["addons"] }),
			queryClient.invalidateQueries({ queryKey: ["addons", "my"] }),
			queryClient.invalidateQueries({ queryKey: ["addon", addonRef] }),
		]);
	}

	async function refreshAddon() {
		setIsRefreshing(true);
		setNotice(null);

		try {
			await updateAddon(addon.url);
			await refreshAddonQueries();
			setNotice({
				type: "success",
				message: "Addon metadata refreshed from GitHub.",
			});
		} catch (error) {
			setNotice({
				type: "error",
				message:
					error instanceof Error ? error.message : "Failed to refresh addon.",
			});
		} finally {
			setIsRefreshing(false);
		}
	}

	async function removeAddon() {
		setIsDeleting(true);
		setNotice(null);

		try {
			await deleteAddon(addon.addon_id, addon.version);
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["addons"] }),
				queryClient.invalidateQueries({ queryKey: ["addons", "my"] }),
				queryClient.removeQueries({ queryKey: ["addon", addonRef] }),
			]);
			setIsDeleteOpen(false);
			setNotice({
				type: "success",
				message: "Addon removed from the registry.",
			});
		} catch (error) {
			setNotice({
				type: "error",
				message:
					error instanceof Error ? error.message : "Failed to delete addon.",
			});
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<Card className="h-full gap-0 overflow-hidden py-0 shadow-sm transition-colors hover:border-foreground/30">
			<CardHeader className="flex min-h-[13.5rem] flex-col justify-between gap-4 border-b bg-[linear-gradient(135deg,rgba(245,158,11,0.08),transparent_38%),linear-gradient(315deg,rgba(16,185,129,0.06),transparent_42%)] px-5 py-5">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div className="flex min-w-0 flex-1 flex-col gap-3">
						<div className="flex flex-wrap items-center gap-2">
							{addon.official ? (
								<Badge className="border-primary/20 bg-primary/10 text-primary">
									<ShieldCheckIcon className="mr-1 size-3" />
									Official
								</Badge>
							) : (
								<Badge className="border-border/70 bg-background/80 text-muted-foreground">
									Community
								</Badge>
							)}
							<Badge className="border-border/70 bg-background/80 font-mono text-muted-foreground">
								v{addon.version}
							</Badge>
						</div>

						<div className="space-y-1.5">
							<CardTitle className="min-h-[3.5rem] text-lg leading-7">
								<Link
									href={detailsHref}
									className="line-clamp-2 block transition-colors hover:text-primary"
								>
									{addon.name}
								</Link>
							</CardTitle>
							<div className="flex flex-wrap items-center gap-2">
								<span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
									Addon ID
								</span>
								<span className="inline-flex items-center rounded-md border bg-background/90 px-2.5 py-1 font-mono text-xs text-foreground">
									{addon.addon_id}
								</span>
							</div>
						</div>
					</div>

					<div className="flex shrink-0 items-center gap-2 self-start">
						<Button asChild size="icon-xs" variant="ghost">
							<Link
								href={addon.url}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={`Open repository for ${addon.name}`}
							>
								<ExternalLinkIcon />
							</Link>
						</Button>
						<Button asChild size="sm" variant="outline" className="gap-1.5">
							<Link href={detailsHref}>
								<PackageIcon className="size-3.5" />
								Open package
							</Link>
						</Button>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
					<span className="flex min-w-0 items-center gap-1.5">
						<UserIcon className="size-3.5 shrink-0" />
						<span className="truncate">{addon.config.author}</span>
					</span>
					<span className="font-mono">{addon.version}</span>
					<span>Synced {formatDate(addon.updated_at)}</span>
				</div>
			</CardHeader>

			<CardContent className="flex flex-1 flex-col px-5 py-5">
				<div className="grid gap-3 sm:grid-cols-2">
					<div className="rounded-lg border bg-muted/15 px-3 py-3">
						<p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
							Addon ID
						</p>
						<p className="mt-2 truncate font-mono text-sm text-foreground">
							{addon.addon_id}
						</p>
					</div>

					<div className="rounded-lg border bg-muted/15 px-3 py-3">
						<p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
							Last sync
						</p>
						<p className="mt-2 text-sm font-medium text-foreground">
							{formatDate(addon.updated_at)}
						</p>
					</div>
				</div>
			</CardContent>

			<CardFooter className="flex flex-col items-stretch gap-2 border-t px-5 py-5">
				<Button
					type="button"
					size="sm"
					variant="outline"
					onClick={refreshAddon}
					disabled={isRefreshing || isDeleting}
					aria-label={`Update addon ${addon.name}`}
					className="h-11 w-full justify-center gap-1.5 whitespace-nowrap px-4 text-center"
				>
					{isRefreshing ? (
						<>
							<LoaderIcon className="size-3.5 animate-spin" />
							Updating...
						</>
					) : (
						<>
							<RefreshCcwIcon className="size-3.5" />
							Update addon
						</>
					)}
				</Button>

				<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
					<DialogTrigger asChild>
						<Button
							type="button"
							size="sm"
							variant="destructive"
							aria-label={`Delete addon ${addon.name}`}
							className="h-11 w-full justify-center gap-1.5 whitespace-nowrap px-4 text-center"
							disabled={isRefreshing || isDeleting}
						>
							<Trash2Icon className="size-3.5" />
							Delete addon
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Delete addon</DialogTitle>
							<DialogDescription>
								This removes{" "}
								<span className="font-mono text-foreground">{addonRef}</span>{" "}
								from the registry.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsDeleteOpen(false)}
								disabled={isDeleting}
							>
								Cancel
							</Button>
							<Button
								type="button"
								variant="destructive"
								onClick={removeAddon}
								disabled={isDeleting}
							>
								{isDeleting ? (
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

				{notice ? (
					<Alert variant={notice.type === "error" ? "destructive" : "default"}>
						<AlertCircleIcon />
						<AlertTitle>
							{notice.type === "error" ? "Action failed" : "Action completed"}
						</AlertTitle>
						<AlertDescription>{notice.message}</AlertDescription>
					</Alert>
				) : null}
			</CardFooter>
		</Card>
	);
}
