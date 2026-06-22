"use client";

import Link from "next/link";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
	AlertCircleIcon,
	ExternalLinkIcon,
	GlobeIcon,
	LoaderIcon,
	LockIcon,
	PackageIcon,
	RefreshCcwIcon,
	ShieldCheckIcon,
	Trash2Icon,
} from "lucide-react";
import { formatDate } from "@/lib/date";
import {
	getTemplateLatestHref,
	getTemplateRef,
} from "@/lib/template-ref";
import {
	deleteTemplate,
	updateTemplate,
	updateTemplateAsOfficial,
	updateTemplateVisibility,
} from "@/services/template";
import { ITemplate } from "@/types/template";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
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

export function OwnedTemplateCard({
	template,
	versionCount = template.versionCount ?? 1,
	isAdmin = false,
}: {
	template: ITemplate;
	versionCount?: number;
	isAdmin?: boolean;
}) {
	const templateRef = getTemplateRef(template);
	const templateHref = getTemplateLatestHref(template.name);
	const queryClient = useQueryClient();
	const [notice, setNotice] = useState<Notice>(null);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isRefreshingOfficial, setIsRefreshingOfficial] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);
	const [isChangingVisibility, setIsChangingVisibility] = useState(false);
	const [pendingVisibility, setPendingVisibility] = useState(template.visibility ?? "public");
	const publishedAt = formatDate(template.created_at);

	async function refreshTemplateQueries() {
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: ["templates"] }),
			queryClient.invalidateQueries({ queryKey: ["my-templates"] }),
			queryClient.invalidateQueries({ queryKey: ["template", template.name] }),
			queryClient.invalidateQueries({ queryKey: ["template", templateRef] }),
			queryClient.invalidateQueries({ queryKey: ["template-versions", template.name] }),
		]);
	}

	async function refreshTemplate() {
		setIsRefreshing(true);
		setNotice(null);

		try {
			await updateTemplate(template.url);
			await refreshTemplateQueries();
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

	async function refreshTemplateAsOfficial() {
		setIsRefreshingOfficial(true);
		setNotice(null);

		try {
			await updateTemplateAsOfficial(template.url);
			await refreshTemplateQueries();
			setNotice({
				type: "success",
				message: "Template metadata refreshed from GitHub and kept official.",
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
			setIsRefreshingOfficial(false);
		}
	}

	async function changeVisibility() {
		setIsChangingVisibility(true);
		setNotice(null);

		try {
			await updateTemplateVisibility(template.id, pendingVisibility);
			await refreshTemplateQueries();
			setNotice({ type: "success", message: `Visibility changed to "${pendingVisibility}".` });
			setIsVisibilityOpen(false);
		} catch (error) {
			setNotice({
				type: "error",
				message: error instanceof Error ? error.message : "Failed to update visibility.",
			});
		} finally {
			setIsChangingVisibility(false);
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
				queryClient.removeQueries({ queryKey: ["template", template.name] }),
				queryClient.removeQueries({ queryKey: ["template", templateRef] }),
				queryClient.removeQueries({ queryKey: ["template-versions", template.name] }),
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
		<Card className="h-full gap-0 overflow-hidden py-0 shadow-sm transition-colors hover:border-foreground/30">
			<CardHeader className="flex flex-col justify-between gap-3 px-4 py-4">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div className="flex min-w-0 flex-1 flex-col gap-3">
						<div className="flex flex-wrap items-center gap-2">
							{template.official ? (
								<Badge className="border-primary/20 bg-primary/10 text-primary">
									<ShieldCheckIcon className="mr-1 size-3" />
									Official
								</Badge>
							) : (
								<Badge className="border-border/70 bg-background/80 text-muted-foreground">
									Community
								</Badge>
							)}
							<Badge
								className={cn(
									"border-border/70 bg-background/80",
									template.visibility === "private" &&
										"border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
									(!template.visibility || template.visibility === "public") &&
										"text-muted-foreground",
								)}
							>
								{template.visibility === "private" ? (
									<LockIcon className="mr-1 size-3" />
								) : (
									<GlobeIcon className="mr-1 size-3" />
								)}
								{template.visibility ?? "public"}
							</Badge>
							<Badge className="border-border/70 bg-background/80 font-mono text-muted-foreground">
								v{template.version}
							</Badge>
							{versionCount > 1 ? (
								<Badge className="border-border/70 bg-background/80 text-muted-foreground">
									{versionCount} versions
								</Badge>
							) : null}
						</div>

						<div className="space-y-1.5">
							<CardTitle className="text-base leading-6">
								<Link
									href={templateHref}
									className="block line-clamp-2 transition-colors hover:text-primary"
								>
									{template.config.metadata.displayName}
								</Link>
							</CardTitle>
							<div className="flex flex-wrap items-center gap-2">
								<span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
									Package
								</span>
								<span className="inline-flex items-center rounded-md border bg-background/90 px-2.5 py-1 font-mono text-xs text-foreground">
									{template.name}
								</span>
							</div>
						</div>
					</div>

					<div className="flex shrink-0 items-center gap-2 self-start">
						<Button asChild size="icon-xs" variant="ghost">
							<Link
								href={template.config.repository.url}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={`Open repository for ${template.config.metadata.displayName}`}
							>
								<ExternalLinkIcon />
							</Link>
						</Button>
						<Button asChild size="sm" variant="outline" className="gap-1.5">
							<Link href={templateHref}>
								<PackageIcon className="size-3.5" />
								Open package
							</Link>
						</Button>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
					<Link
						href={`/user/${template.config.author.github}`}
						className="flex min-w-0 items-center gap-1.5 transition-colors hover:text-foreground"
					>
						<GitHubIcon className="size-3.5 shrink-0" />
						<span className="truncate">@{template.config.author.github}</span>
					</Link>
					<span className="font-mono">v{template.version}</span>
					<span>Published {publishedAt}</span>
				</div>
			</CardHeader>

			<CardFooter className="mt-auto flex flex-col items-stretch gap-2 border-t px-4 py-4">
				<div className="flex flex-col gap-2">
					<Dialog open={isVisibilityOpen} onOpenChange={setIsVisibilityOpen}>
						<DialogTrigger asChild>
							<Button
								type="button"
								size="sm"
								variant="outline"
								className="h-9 w-full justify-center gap-1.5 whitespace-nowrap px-4 text-center"
								disabled={isRefreshing || isRefreshingOfficial || isDeleting}
							>
								{template.visibility === "private" ? (
									<LockIcon className="size-3.5" />
								) : (
									<GlobeIcon className="size-3.5" />
								)}
								Change visibility
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-sm">
							<DialogHeader>
								<DialogTitle>Change visibility</DialogTitle>
								<DialogDescription>
									Control who can access{" "}
									<span className="font-mono text-foreground">{template.name}</span>.
								</DialogDescription>
							</DialogHeader>
							<div className="py-2">
								<select
									value={pendingVisibility}
									onChange={(e) => setPendingVisibility(e.target.value)}
									className="h-9 w-full cursor-pointer rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
								>
									<option value="public">public — anyone can access</option>
									<option value="private">private — only you</option>
								</select>
							</div>
							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsVisibilityOpen(false)}
									disabled={isChangingVisibility}
								>
									Cancel
								</Button>
								<Button
									type="button"
									onClick={changeVisibility}
									disabled={isChangingVisibility}
								>
									{isChangingVisibility ? (
										<>
											<LoaderIcon className="size-3.5 animate-spin" />
											Saving...
										</>
									) : (
										"Save"
									)}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>

					<div
						className={cn(
							"grid gap-2",
							isAdmin ? "sm:grid-cols-2" : "grid-cols-1",
						)}
					>
						<Button
							type="button"
							size="sm"
							variant="outline"
							onClick={refreshTemplate}
							disabled={isRefreshing || isRefreshingOfficial || isDeleting}
							aria-label={`Update template ${template.config.metadata.displayName}`}
							className="h-9 w-full justify-center gap-1.5 whitespace-nowrap px-4 text-center"
						>
							{isRefreshing ? (
								<>
									<LoaderIcon className="size-3.5 animate-spin" />
									Updating...
								</>
							) : (
								<>
									<RefreshCcwIcon className="size-3.5" />
									Update template
								</>
							)}
						</Button>

						{isAdmin && (
							<Button
								type="button"
								size="sm"
								variant="secondary"
								onClick={refreshTemplateAsOfficial}
								disabled={isRefreshing || isRefreshingOfficial || isDeleting}
								aria-label={`Update as official for ${template.config.metadata.displayName}`}
								className="h-9 w-full justify-center gap-1.5 whitespace-nowrap px-4 text-center"
							>
								{isRefreshingOfficial ? (
									<>
										<LoaderIcon className="size-3.5 animate-spin" />
										Updating official...
									</>
								) : (
									<>
										<ShieldCheckIcon className="size-3.5" />
										Update as official
									</>
								)}
							</Button>
						)}
					</div>

					<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
						<DialogTrigger asChild>
							<Button
								type="button"
								size="sm"
								variant="destructive"
								aria-label={`Delete template ${template.config.metadata.displayName}`}
								className="h-9 w-full justify-center gap-1.5 whitespace-nowrap px-4 text-center"
								disabled={isRefreshing || isRefreshingOfficial || isDeleting}
							>
								<Trash2Icon className="size-3.5" />
								Delete template
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
