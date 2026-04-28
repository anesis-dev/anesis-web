"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { VariantProps } from "class-variance-authority";
import {
	AlertCircleIcon,
	CheckCircleIcon,
	LoaderIcon,
	PlusIcon,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { validateAddonPublishUrl } from "@/lib/template-url";
import { publishAddon } from "@/services/addon";

type DialogState =
	| { status: "idle" }
	| { status: "loading" }
	| { status: "success"; addonId: string }
	| { status: "error"; message: string };

export function PublishAddonDialog({
	label = "Publish Addon",
	size = "sm",
	variant = "default",
	className,
}: {
	label?: string;
	size?: VariantProps<typeof buttonVariants>["size"];
	variant?: VariantProps<typeof buttonVariants>["variant"];
	className?: string;
}) {
	const [open, setOpen] = useState(false);
	const [url, setUrl] = useState("");
	const [state, setState] = useState<DialogState>({ status: "idle" });
	const queryClient = useQueryClient();

	function handleOpenChange(isOpen: boolean) {
		setOpen(isOpen);
		if (!isOpen) {
			setTimeout(() => {
				setUrl("");
				setState({ status: "idle" });
			}, 200);
		}
	}

	async function handleSubmit(event: React.FormEvent) {
		event.preventDefault();
		if (state.status === "loading") {
			return;
		}

		const validationError = validateAddonPublishUrl(url);
		if (validationError) {
			setState({ status: "error", message: validationError });
			return;
		}

		setState({ status: "loading" });
		try {
			const result = await publishAddon(url.trim());
			setState({ status: "success", addonId: result.addon_id });
			await queryClient.invalidateQueries({ queryKey: ["addons"] });
		} catch (error) {
			setState({
				status: "error",
				message:
					error instanceof Error ? error.message : "Something went wrong.",
			});
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button
					size={size}
					variant={variant}
					className={className ?? "gap-1.5"}
				>
					<PlusIcon className="size-3.5" />
					{label}
				</Button>
			</DialogTrigger>

			<DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Publish an Addon</DialogTitle>
					<DialogDescription>
						Paste the GitHub URL pointing to the directory that contains your{" "}
						<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
							anesis.addon.json
						</code>{" "}
						file.
					</DialogDescription>
				</DialogHeader>

				{state.status === "success" ? (
					<div className="flex flex-col items-center gap-4 py-4 text-center">
						<CheckCircleIcon className="size-12 text-green-500" />
						<div>
							<p className="font-semibold">Published successfully!</p>
							<p className="mt-1 text-sm text-muted-foreground">
								Your addon{" "}
								<span className="font-mono text-foreground">
									{state.addonId}
								</span>{" "}
								is now in the registry.
							</p>
						</div>
						<Button onClick={() => handleOpenChange(false)} className="mt-2">
							Done
						</Button>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Input
								placeholder="https://github.com/owner/repo/tree/main/addon"
								value={url}
								onChange={(event) => {
									setUrl(event.target.value);
									if (state.status === "error") {
										setState({ status: "idle" });
									}
								}}
								disabled={state.status === "loading"}
								autoFocus
								aria-label="GitHub addon directory URL"
							/>

							{state.status === "error" && (
								<div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
									<AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
									<span>{state.message}</span>
								</div>
							)}
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => handleOpenChange(false)}
								disabled={state.status === "loading"}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={!url.trim() || state.status === "loading"}
								className="gap-1.5"
							>
								{state.status === "loading" ? (
									<>
										<LoaderIcon className="size-3.5 animate-spin" />
										Publishing…
									</>
								) : (
									"Publish"
								)}
							</Button>
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}
