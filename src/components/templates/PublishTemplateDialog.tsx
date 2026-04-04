"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { publishTemplate } from "@/services/template";
import { validateTemplatePublishUrl } from "@/lib/template-url";
import {
	PlusIcon,
	CheckCircleIcon,
	AlertCircleIcon,
	LoaderIcon,
} from "lucide-react";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

type DialogState =
	| { status: "idle" }
	| { status: "loading" }
	| { status: "success"; name: string }
	| { status: "error"; message: string };

export function PublishTemplateDialog({
	label = "Publish Template",
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

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (state.status === "loading") return;

		const validationError = validateTemplatePublishUrl(url);
		if (validationError) {
			setState({ status: "error", message: validationError });
			return;
		}

		setState({ status: "loading" });
		try {
			const result = await publishTemplate(url.trim());
			setState({ status: "success", name: result.name });
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["templates"] }),
				queryClient.invalidateQueries({ queryKey: ["my-templates"] }),
			]);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Something went wrong.";
			setState({ status: "error", message });
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
					<DialogTitle>Publish a Template</DialogTitle>
					<DialogDescription>
						Paste the GitHub URL pointing to the directory that contains your{" "}
						<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
							oxide.template.json
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
								Your template{" "}
								<span className="font-mono text-foreground">{state.name}</span>{" "}
								is now live.
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
								placeholder="https://github.com/owner/repo/tree/main/my-template"
								value={url}
								onChange={(e) => {
									setUrl(e.target.value);
									if (state.status === "error") {
										setState({ status: "idle" });
									}
								}}
								disabled={state.status === "loading"}
								autoFocus
								aria-label="GitHub template directory URL"
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
