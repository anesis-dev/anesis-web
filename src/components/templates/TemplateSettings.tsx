"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
	AlertCircleIcon,
	Building2Icon,
	GlobeIcon,
	LoaderIcon,
	LockIcon,
	RefreshCcwIcon,
	ShieldCheckIcon,
	ShieldOffIcon,
	Trash2Icon,
	UsersIcon,
} from "lucide-react";
import { getTemplateRef } from "@/lib/template-ref";
import {
	deleteTemplate,
	updateTemplate,
	updateTemplateAsOfficial,
	updateTemplateOfficialStatus,
} from "@/services/template";
import {
	removeTemplateFromOrganization,
	updateTemplateVisibility,
} from "@/services/access-control";
import { useOrganizations } from "@/hooks/useOrganizations";
import { ITemplate } from "@/types/template";
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
import { SettingsRow, SettingsSection } from "@/components/SettingsSection";

type Notice =
	| { type: "success"; message: string }
	| { type: "error"; message: string }
	| null;

function visibilityIcon(visibility?: string) {
	if (visibility === "private") return LockIcon;
	if (visibility === "org_private") return UsersIcon;
	return GlobeIcon;
}

export function TemplateSettings({
	template,
	isAdmin = false,
}: {
	template: ITemplate;
	isAdmin?: boolean;
}) {
	const queryClient = useQueryClient();
	const templateRef = getTemplateRef(template);
	const { organizations } = useOrganizations();

	const [notice, setNotice] = useState<Notice>(null);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isRefreshingOfficial, setIsRefreshingOfficial] = useState(false);
	const [isTogglingOfficial, setIsTogglingOfficial] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);
	const [isChangingVisibility, setIsChangingVisibility] = useState(false);
	const [pendingVisibility, setPendingVisibility] = useState(template.visibility ?? "public");

	const [isOrgOpen, setIsOrgOpen] = useState(false);
	const [isMovingOrg, setIsMovingOrg] = useState(false);
	const [pendingOrg, setPendingOrg] = useState<string>(template.organization_id ?? "");
	const [isDetaching, setIsDetaching] = useState(false);

	const VisibilityIcon = visibilityIcon(template.visibility);

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
			setNotice({ type: "success", message: "Template metadata refreshed from GitHub." });
		} catch (error) {
			setNotice({
				type: "error",
				message: error instanceof Error ? error.message : "Failed to refresh template.",
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
					error instanceof Error ? error.message : "Failed to refresh template as official.",
			});
		} finally {
			setIsRefreshingOfficial(false);
		}
	}

	async function toggleOfficial() {
		setIsTogglingOfficial(true);
		setNotice(null);
		try {
			const nextOfficial = !template.official;
			await updateTemplateOfficialStatus(template.id, nextOfficial);
			await refreshTemplateQueries();
			setNotice({
				type: "success",
				message: nextOfficial
					? `Version ${template.version} is now marked as official.`
					: `Version ${template.version} was moved back to community.`,
			});
		} catch (error) {
			setNotice({
				type: "error",
				message:
					error instanceof Error ? error.message : "Failed to update official status.",
			});
		} finally {
			setIsTogglingOfficial(false);
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

	async function moveToOrganization() {
		if (!pendingOrg) {
			setNotice({ type: "error", message: "Select an organization first." });
			return;
		}
		setIsMovingOrg(true);
		setNotice(null);
		try {
			await updateTemplateVisibility(template.id, "org_private", undefined, pendingOrg);
			await refreshTemplateQueries();
			const org = organizations.find((entry) => entry.id === pendingOrg);
			setNotice({
				type: "success",
				message: `Template moved to ${org?.name ?? "the organization"}.`,
			});
			setIsOrgOpen(false);
		} catch (error) {
			setNotice({
				type: "error",
				message: error instanceof Error ? error.message : "Failed to move template.",
			});
		} finally {
			setIsMovingOrg(false);
		}
	}

	async function detachFromOrganization() {
		setIsDetaching(true);
		setNotice(null);
		try {
			await removeTemplateFromOrganization(template.id);
			await refreshTemplateQueries();
			setNotice({ type: "success", message: "Template removed from its organization." });
		} catch (error) {
			setNotice({
				type: "error",
				message: error instanceof Error ? error.message : "Failed to detach template.",
			});
		} finally {
			setIsDetaching(false);
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
				message: error instanceof Error ? error.message : "Failed to delete template.",
			});
		} finally {
			setIsDeleting(false);
		}
	}

	const busy =
		isRefreshing ||
		isRefreshingOfficial ||
		isTogglingOfficial ||
		isDeleting ||
		isMovingOrg ||
		isDetaching;

	return (
		<div className="flex flex-col gap-6">
			{notice ? (
				<Alert variant={notice.type === "error" ? "destructive" : "default"}>
					<AlertCircleIcon />
					<AlertTitle>
						{notice.type === "error" ? "Action failed" : "Action completed"}
					</AlertTitle>
					<AlertDescription>{notice.message}</AlertDescription>
				</Alert>
			) : null}

			<SettingsSection
				title="General"
				description="Keep this template's registry metadata in sync with its GitHub source."
			>
				<SettingsRow
					title="Update from GitHub"
					description="Re-fetch the template metadata and latest commit from the linked repository."
				>
					<Button type="button" variant="outline" onClick={refreshTemplate} disabled={busy}>
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
				</SettingsRow>

				{isAdmin ? (
					<>
						<SettingsRow
							title="Update as official"
							description="Refresh metadata from GitHub while keeping the official badge."
						>
							<Button
								type="button"
								variant="secondary"
								onClick={refreshTemplateAsOfficial}
								disabled={busy}
							>
								{isRefreshingOfficial ? (
									<>
										<LoaderIcon className="size-3.5 animate-spin" />
										Updating...
									</>
								) : (
									<>
										<ShieldCheckIcon className="size-3.5" />
										Update as official
									</>
								)}
							</Button>
						</SettingsRow>

						<SettingsRow
							title="Official status"
							description={
								template.official
									? `Version ${template.version} is currently marked as official.`
									: `Version ${template.version} is currently community.`
							}
						>
							<Button
								type="button"
								variant={template.official ? "outline" : "default"}
								onClick={toggleOfficial}
								disabled={busy}
								aria-label={
									template.official
										? `Mark version ${template.version} as community`
										: `Mark version ${template.version} as official`
								}
							>
								{isTogglingOfficial ? (
									<>
										<LoaderIcon className="size-3.5 animate-spin" />
										Updating...
									</>
								) : template.official ? (
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
						</SettingsRow>
					</>
				) : null}
			</SettingsSection>

			<SettingsSection
				title="Access"
				description="Control who can discover and install this template."
			>
				<SettingsRow
					title="Visibility"
					description={`Currently ${template.visibility ?? "public"}.`}
				>
					<Dialog open={isVisibilityOpen} onOpenChange={setIsVisibilityOpen}>
						<DialogTrigger asChild>
							<Button type="button" variant="outline" disabled={busy}>
								<VisibilityIcon className="size-3.5" />
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
									onChange={(event) => setPendingVisibility(event.target.value)}
									aria-label="Visibility"
									className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
								>
									<option value="public">public — anyone can access</option>
									<option value="private">private — only you</option>
									<option value="org_private">org_private — granted organizations</option>
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
								<Button type="button" onClick={changeVisibility} disabled={isChangingVisibility}>
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
				</SettingsRow>

				<SettingsRow
					title="Organization"
					description={
						template.organization_id
							? "This template belongs to an organization."
							: "Move this template under an organization you belong to."
					}
				>
					<div className="flex flex-wrap gap-2">
						<Dialog open={isOrgOpen} onOpenChange={setIsOrgOpen}>
							<DialogTrigger asChild>
								<Button type="button" variant="outline" disabled={busy}>
									<Building2Icon className="size-3.5" />
									Move to organization
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-sm">
								<DialogHeader>
									<DialogTitle>Move to organization</DialogTitle>
									<DialogDescription>
										The template becomes org-private and visible to that organization&apos;s
										members.
									</DialogDescription>
								</DialogHeader>
								<div className="py-2">
									{organizations.length > 0 ? (
										<select
											value={pendingOrg}
											onChange={(event) => setPendingOrg(event.target.value)}
											aria-label="Organization"
											className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
										>
											<option value="">Select an organization…</option>
											{organizations.map((org) => (
												<option key={org.id} value={org.id}>
													{org.name}
												</option>
											))}
										</select>
									) : (
										<p className="text-sm text-muted-foreground">
											You are not a member of any organization yet.
										</p>
									)}
								</div>
								<DialogFooter>
									<Button
										type="button"
										variant="outline"
										onClick={() => setIsOrgOpen(false)}
										disabled={isMovingOrg}
									>
										Cancel
									</Button>
									<Button
										type="button"
										onClick={moveToOrganization}
										disabled={isMovingOrg || !pendingOrg}
									>
										{isMovingOrg ? (
											<>
												<LoaderIcon className="size-3.5 animate-spin" />
												Moving...
											</>
										) : (
											"Move"
										)}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>

						{template.organization_id ? (
							<Button
								type="button"
								variant="ghost"
								onClick={detachFromOrganization}
								disabled={busy}
							>
								{isDetaching ? (
									<>
										<LoaderIcon className="size-3.5 animate-spin" />
										Removing...
									</>
								) : (
									"Remove from organization"
								)}
							</Button>
						) : null}
					</div>
				</SettingsRow>
			</SettingsSection>

			<SettingsSection
				title="Danger zone"
				description="Irreversible actions. Proceed with care."
				tone="danger"
			>
				<SettingsRow
					title="Delete this template"
					description={`Permanently removes ${templateRef} from the registry.`}
				>
					<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
						<DialogTrigger asChild>
							<Button type="button" variant="destructive" disabled={busy}>
								<Trash2Icon className="size-3.5" />
								Delete template
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Delete template</DialogTitle>
								<DialogDescription>
									This removes{" "}
									<span className="font-mono text-foreground">{templateRef}</span> from the
									registry.
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
				</SettingsRow>
			</SettingsSection>
		</div>
	);
}
