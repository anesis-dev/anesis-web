"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
	AlertCircleIcon,
	GlobeIcon,
	LoaderIcon,
	LockIcon,
	ShieldCheckIcon,
	ShieldOffIcon,
	Trash2Icon,
} from "lucide-react";
import {
	deleteStack,
	updateStackOfficialStatus,
	updateStackVisibility,
} from "@/services/stack";
import { IStack } from "@/types/stack";
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

export function StackSettings({
	stack,
	isAdmin = false,
}: {
	stack: IStack;
	isAdmin?: boolean;
}) {
	const queryClient = useQueryClient();
	const stackRef = stack.stack_id;

	const [notice, setNotice] = useState<Notice>(null);
	const [isTogglingOfficial, setIsTogglingOfficial] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);
	const [isChangingVisibility, setIsChangingVisibility] = useState(false);
	const [pendingVisibility, setPendingVisibility] = useState(stack.visibility ?? "public");

	async function refreshStackQueries() {
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: ["stacks"] }),
			queryClient.invalidateQueries({ queryKey: ["stacks", "my"] }),
			queryClient.invalidateQueries({ queryKey: ["stack", stackRef] }),
		]);
	}

	async function toggleOfficial() {
		setIsTogglingOfficial(true);
		setNotice(null);
		try {
			const nextOfficial = !stack.official;
			await updateStackOfficialStatus(stack.id, nextOfficial);
			await refreshStackQueries();
			setNotice({
				type: "success",
				message: nextOfficial
					? "Stack is now marked as official."
					: "Stack was moved back to community.",
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
			await updateStackVisibility(stack.id, pendingVisibility);
			await refreshStackQueries();
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

	async function removeStack() {
		setIsDeleting(true);
		setNotice(null);
		try {
			await deleteStack(stack.stack_id, stack.version);
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["stacks"] }),
				queryClient.invalidateQueries({ queryKey: ["stacks", "my"] }),
				queryClient.removeQueries({ queryKey: ["stack", stackRef] }),
			]);
			setIsDeleteOpen(false);
		} catch (error) {
			setNotice({
				type: "error",
				message: error instanceof Error ? error.message : "Failed to delete stack.",
			});
		} finally {
			setIsDeleting(false);
		}
	}

	const busy = isTogglingOfficial || isDeleting;

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

			{isAdmin ? (
				<SettingsSection
					title="General"
					description="Control the official status of this stack."
				>
					<SettingsRow
						title="Official status"
						description={
							stack.official
								? "This stack is currently marked as official."
								: "This stack is currently community."
						}
					>
						<Button
							type="button"
							variant={stack.official ? "outline" : "default"}
							onClick={toggleOfficial}
							disabled={busy}
							aria-label={stack.official ? "Mark stack as community" : "Mark stack as official"}
						>
							{isTogglingOfficial ? (
								<>
									<LoaderIcon className="size-3.5 animate-spin" />
									Updating...
								</>
							) : stack.official ? (
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
				</SettingsSection>
			) : null}

			<SettingsSection
				title="Access"
				description="Control who can discover and install this stack."
			>
				<SettingsRow
					title="Visibility"
					description={`Currently ${stack.visibility ?? "public"}.`}
				>
					<Dialog open={isVisibilityOpen} onOpenChange={setIsVisibilityOpen}>
						<DialogTrigger asChild>
							<Button type="button" variant="outline" disabled={busy}>
								{stack.visibility === "private" ? (
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
									<span className="font-mono text-foreground">{stack.stack_id}</span>.
								</DialogDescription>
							</DialogHeader>
							<div className="py-2">
								<select
									value={pendingVisibility}
									onChange={(event) => setPendingVisibility(event.target.value)}
									aria-label="Visibility"
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
			</SettingsSection>

			<SettingsSection
				title="Danger zone"
				description="Irreversible actions. Proceed with care."
				tone="danger"
			>
				<SettingsRow
					title="Delete this stack"
					description={`Permanently removes ${stackRef} from the registry.`}
				>
					<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
						<DialogTrigger asChild>
							<Button type="button" variant="destructive" disabled={busy}>
								<Trash2Icon className="size-3.5" />
								Delete stack
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Delete stack</DialogTitle>
								<DialogDescription>
									This removes{" "}
									<span className="font-mono text-foreground">{stackRef}</span> from the registry.
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
									onClick={removeStack}
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
											Delete stack
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
