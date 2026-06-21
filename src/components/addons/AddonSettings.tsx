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
import { getAddonRef } from "@/lib/addon-ref";
import {
	deleteAddon,
	updateAddon,
	updateAddonOfficialStatus,
} from "@/services/addon";
import {
	removeAddonFromOrganization,
	updateAddonVisibility,
} from "@/services/access-control";
import { useOrganizations } from "@/hooks/useOrganizations";
import { IAddon } from "@/types/addon";
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

export function AddonSettings({
	addon,
	isAdmin = false,
}: {
	addon: IAddon;
	isAdmin?: boolean;
}) {
	const queryClient = useQueryClient();
	const addonRef = getAddonRef(addon);
	const { organizations } = useOrganizations();

	const [notice, setNotice] = useState<Notice>(null);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isTogglingOfficial, setIsTogglingOfficial] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);
	const [isChangingVisibility, setIsChangingVisibility] = useState(false);
	const [pendingVisibility, setPendingVisibility] = useState(addon.visibility ?? "public");

	const [isOrgOpen, setIsOrgOpen] = useState(false);
	const [isMovingOrg, setIsMovingOrg] = useState(false);
	const [pendingOrg, setPendingOrg] = useState<string>(addon.organization_id ?? "");
	const [isDetaching, setIsDetaching] = useState(false);

	const VisibilityIcon = visibilityIcon(addon.visibility);

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
			setNotice({ type: "success", message: "Addon metadata refreshed from GitHub." });
		} catch (error) {
			setNotice({
				type: "error",
				message: error instanceof Error ? error.message : "Failed to refresh addon.",
			});
		} finally {
			setIsRefreshing(false);
		}
	}

	async function toggleOfficial() {
		setIsTogglingOfficial(true);
		setNotice(null);
		try {
			const nextOfficial = !addon.official;
			await updateAddonOfficialStatus(addon.id, nextOfficial);
			await refreshAddonQueries();
			setNotice({
				type: "success",
				message: nextOfficial
					? "Addon is now marked as official."
					: "Addon was moved back to community.",
			});
		} catch (error) {
			setNotice({
				type: "error",
				message: error instanceof Error ? error.message : "Failed to update official status.",
			});
		} finally {
			setIsTogglingOfficial(false);
		}
	}

	async function changeVisibility() {
		setIsChangingVisibility(true);
		setNotice(null);
		try {
			await updateAddonVisibility(addon.id, pendingVisibility);
			await refreshAddonQueries();
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
			await updateAddonVisibility(addon.id, "org_private", undefined, pendingOrg);
			await refreshAddonQueries();
			const org = organizations.find((entry) => entry.id === pendingOrg);
			setNotice({
				type: "success",
				message: `Addon moved to ${org?.name ?? "the organization"}.`,
			});
			setIsOrgOpen(false);
		} catch (error) {
			setNotice({
				type: "error",
				message: error instanceof Error ? error.message : "Failed to move addon.",
			});
		} finally {
			setIsMovingOrg(false);
		}
	}

	async function detachFromOrganization() {
		setIsDetaching(true);
		setNotice(null);
		try {
			await removeAddonFromOrganization(addon.id);
			await refreshAddonQueries();
			setNotice({ type: "success", message: "Addon removed from its organization." });
		} catch (error) {
			setNotice({
				type: "error",
				message: error instanceof Error ? error.message : "Failed to detach addon.",
			});
		} finally {
			setIsDetaching(false);
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
		} catch (error) {
			setNotice({
				type: "error",
				message: error instanceof Error ? error.message : "Failed to delete addon.",
			});
		} finally {
			setIsDeleting(false);
		}
	}

	const busy =
		isRefreshing || isTogglingOfficial || isDeleting || isMovingOrg || isDetaching;

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
				description="Keep this addon's registry metadata in sync with its GitHub source."
			>
				<SettingsRow
					title="Update from GitHub"
					description="Re-fetch the addon manifest and latest commit from the linked repository."
				>
					<Button type="button" variant="outline" onClick={refreshAddon} disabled={busy}>
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
				</SettingsRow>

				{isAdmin ? (
					<SettingsRow
						title="Official status"
						description={
							addon.official
								? "This addon is currently marked as official."
								: "This addon is currently community."
						}
					>
						<Button
							type="button"
							variant={addon.official ? "outline" : "default"}
							onClick={toggleOfficial}
							disabled={busy}
							aria-label={addon.official ? "Mark addon as community" : "Mark addon as official"}
						>
							{isTogglingOfficial ? (
								<>
									<LoaderIcon className="size-3.5 animate-spin" />
									Updating...
								</>
							) : addon.official ? (
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
				) : null}
			</SettingsSection>

			<SettingsSection
				title="Access"
				description="Control who can discover and install this addon."
			>
				<SettingsRow
					title="Visibility"
					description={`Currently ${addon.visibility ?? "public"}.`}
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
									<span className="font-mono text-foreground">{addon.addon_id}</span>.
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
						addon.organization_id
							? "This addon belongs to an organization."
							: "Move this addon under an organization you belong to."
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
										The addon becomes org-private and visible to that organization&apos;s
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

						{addon.organization_id ? (
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
					title="Delete this addon"
					description={`Permanently removes ${addonRef} from the registry.`}
				>
					<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
						<DialogTrigger asChild>
							<Button type="button" variant="destructive" disabled={busy}>
								<Trash2Icon className="size-3.5" />
								Delete addon
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Delete addon</DialogTitle>
								<DialogDescription>
									This removes{" "}
									<span className="font-mono text-foreground">{addonRef}</span> from the
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
				</SettingsRow>
			</SettingsSection>
		</div>
	);
}
