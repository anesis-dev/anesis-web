"use client";

import Link from "next/link";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
	AlertCircleIcon,
	ExternalLinkIcon,
	LoaderIcon,
	RefreshCcwIcon,
	Trash2Icon,
} from "lucide-react";
import { AddonCard } from "@/components/addons/AddonCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
import { getAddonRef } from "@/lib/addon-ref";
import { deleteAddon, updateAddon } from "@/services/addon";
import { IAddon } from "@/types/addon";

type Notice =
	| { type: "success"; message: string }
	| { type: "error"; message: string }
	| null;

export function OwnedAddonCard({ addon }: { addon: IAddon }) {
	const queryClient = useQueryClient();
	const addonRef = getAddonRef(addon);
	const [notice, setNotice] = useState<Notice>(null);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	async function refreshAddon() {
		setIsRefreshing(true);
		setNotice(null);

		try {
			await updateAddon(addon.url);
			await queryClient.invalidateQueries({ queryKey: ["addons"] });
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
			await queryClient.invalidateQueries({ queryKey: ["addons"] });
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
		<div className="flex flex-col gap-3">
			<AddonCard addon={addon} />

			<div className="rounded-3xl border bg-card p-4 shadow-sm">
				<div className="flex flex-col gap-4">
					<div className="space-y-1">
						<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
							Owner Actions
						</p>
						<p className="break-all font-mono text-sm text-foreground">{addonRef}</p>
						<p className="text-sm text-muted-foreground">
							Last synced {formatDate(addon.updated_at)} from GitHub. Published{" "}
							{formatDate(addon.created_at)} at commit{" "}
							<span className="font-mono text-foreground">
								{addon.commit_sha.slice(0, 7)}
							</span>
							.
						</p>
					</div>

					<div className="flex flex-col gap-2">
						<Button
							asChild
							type="button"
							size="sm"
							variant="outline"
							className="h-auto min-h-11 justify-start whitespace-normal px-3 py-2 text-left leading-5"
						>
							<Link
								href={addon.url}
								target="_blank"
								rel="noopener noreferrer"
							>
								<ExternalLinkIcon className="size-3.5" />
								Open source repository
							</Link>
						</Button>

						<Button
							type="button"
							size="sm"
							variant="outline"
							onClick={refreshAddon}
							disabled={isRefreshing}
							className="h-auto min-h-11 w-full justify-start whitespace-normal px-3 py-2 text-left leading-5"
						>
							{isRefreshing ? (
								<>
									<LoaderIcon className="size-3.5 animate-spin" />
									Refreshing...
								</>
							) : (
								<>
									<RefreshCcwIcon className="size-3.5" />
									Refresh metadata
								</>
							)}
						</Button>

						<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
							<DialogTrigger asChild>
								<Button
									type="button"
									size="sm"
									variant="destructive"
									className="h-auto min-h-11 w-full justify-start whitespace-normal px-3 py-2 text-left leading-5"
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
										<span className="font-mono text-foreground">
											{addonRef}
										</span>{" "}
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
					</div>
				</div>

				{notice ? (
					<Alert
						variant={notice.type === "error" ? "destructive" : "default"}
						className="mt-3"
					>
						<AlertCircleIcon />
						<AlertTitle>
							{notice.type === "error" ? "Action failed" : "Action completed"}
						</AlertTitle>
						<AlertDescription>{notice.message}</AlertDescription>
					</Alert>
				) : null}
			</div>
		</div>
	);
}
