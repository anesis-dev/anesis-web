"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircleIcon, LoaderIcon, RefreshCcwIcon, Trash2Icon } from "lucide-react";
import { getTemplateRef } from "@/lib/template-ref";
import { deleteTemplate, updateTemplate } from "@/services/template";
import { ITemplate } from "@/types/template";
import { TemplateCard } from "@/components/templates/TemplateCard";
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

type Notice =
	| { type: "success"; message: string }
	| { type: "error"; message: string }
	| null;

export function OwnedTemplateCard({ template }: { template: ITemplate }) {
	const templateRef = getTemplateRef(template);
	const queryClient = useQueryClient();
	const [notice, setNotice] = useState<Notice>(null);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	async function refreshTemplate() {
		setIsRefreshing(true);
		setNotice(null);

		try {
			await updateTemplate(template.url);
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["templates"] }),
				queryClient.invalidateQueries({ queryKey: ["my-templates"] }),
				queryClient.invalidateQueries({ queryKey: ["template", templateRef] }),
			]);
			setNotice({
				type: "success",
				message: "Template metadata refreshed from GitHub.",
			});
		} catch (error) {
			setNotice({
				type: "error",
				message:
					error instanceof Error ? error.message : "Failed to refresh template.",
			});
		} finally {
			setIsRefreshing(false);
		}
	}

	async function removeTemplate() {
		setIsDeleting(true);
		setNotice(null);

		try {
			await deleteTemplate(templateRef);
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["templates"] }),
				queryClient.invalidateQueries({ queryKey: ["my-templates"] }),
				queryClient.removeQueries({ queryKey: ["template", templateRef] }),
			]);
			setIsDeleteOpen(false);
		} catch (error) {
			setNotice({
				type: "error",
				message:
					error instanceof Error ? error.message : "Failed to delete template.",
			});
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<div className="flex flex-col gap-3">
			<TemplateCard template={template} />

			<div className="rounded-2xl border bg-muted/20 p-3">
				<div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
					<Button
						type="button"
						size="sm"
						variant="outline"
						onClick={refreshTemplate}
						disabled={isRefreshing}
					>
						{isRefreshing ? (
							<>
								<LoaderIcon className="size-3.5 animate-spin" />
								Refreshing...
							</>
						) : (
							<>
								<RefreshCcwIcon className="size-3.5" />
								Refresh from GitHub
							</>
						)}
					</Button>

					<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
						<DialogTrigger asChild>
							<Button type="button" size="sm" variant="destructive">
								<Trash2Icon className="size-3.5" />
								Delete
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Delete template</DialogTitle>
								<DialogDescription>
									This removes{" "}
									<span className="font-mono text-foreground">{templateRef}</span>{" "}
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
									onClick={removeTemplate}
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
											Delete template
										</>
									)}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
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
