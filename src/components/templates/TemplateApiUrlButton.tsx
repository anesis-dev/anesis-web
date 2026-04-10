"use client";

import { useState } from "react";
import { VariantProps } from "class-variance-authority";
import { CopyIcon, LoaderIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { fetchTemplateUrl } from "@/services/template";
import { Button, buttonVariants } from "@/components/ui/button";

type ButtonState = "idle" | "loading" | "success";

export function TemplateApiUrlButton({
	templateRef,
	label = "Copy Download URL",
	size = "sm",
	variant = "outline",
	className,
	onMessage,
}: {
	templateRef: string;
	label?: string;
	size?: VariantProps<typeof buttonVariants>["size"];
	variant?: VariantProps<typeof buttonVariants>["variant"];
	className?: string;
	onMessage?: (message: string, type: "success" | "error") => void;
}) {
	const { user, login } = useAuth();
	const [state, setState] = useState<ButtonState>("idle");

	async function handleClick() {
		if (state === "loading") {
			return;
		}

		if (!user) {
			login();
			return;
		}

		setState("loading");

		try {
			const result = await fetchTemplateUrl(templateRef);

			if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(result.archive_url);
				onMessage?.("Template download URL copied to clipboard.", "success");
			} else {
				window.open(result.archive_url, "_blank", "noopener,noreferrer");
				onMessage?.("Template download URL opened in a new tab.", "success");
			}

			setState("success");
			window.setTimeout(() => setState("idle"), 2000);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to load template download URL.";
			onMessage?.(message, "error");
			setState("idle");
		}
	}

	return (
		<Button
			type="button"
			size={size}
			variant={variant}
			onClick={handleClick}
			disabled={state === "loading"}
			className={className}
		>
			{state === "loading" ? (
				<>
					<LoaderIcon className="size-3.5 animate-spin" />
					Loading...
				</>
			) : (
				<>
					<CopyIcon className="size-3.5" />
					{state === "success" ? "Copied URL" : label}
				</>
			)}
		</Button>
	);
}
