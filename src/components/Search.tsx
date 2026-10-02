"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const SearchDialog = dynamic(
	() => import("./SearchDialog").then((m) => m.SearchDialog),
	{ ssr: false },
);

export function Search({
	className,
	variant = "full",
}: {
	className?: string;
	variant?: "full" | "icon";
}) {
	const [open, setOpen] = React.useState(false);
	const hasOpened = useLatch(open);
	const router = useRouter();

	React.useEffect(() => {
		// Header renders two Search instances (desktop + mobile) and the dialog
		// portals to <body>, so only one may own the shortcut or Ctrl+K opens two.
		if (variant !== "full") return;

		const down = (e: KeyboardEvent) => {
			const target = e.target;
			const isEditableTarget =
				target instanceof HTMLElement &&
				(target.isContentEditable ||
					target instanceof HTMLInputElement ||
					target instanceof HTMLTextAreaElement ||
					target instanceof HTMLSelectElement);

			if (isEditableTarget || e.altKey || e.shiftKey) {
				return;
			}

			if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen(true);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [variant]);

	function handleSelect(url: string) {
		router.push(url.startsWith("/") ? url : `/${url}`);
		setOpen(false);
	}

	return (
		<>
			{variant === "icon" ? (
				<Button
					onClick={() => setOpen(true)}
					className={className}
					variant="outline"
					size="icon"
					aria-label="Open site search"
				>
					<SearchIcon className="size-4" />
				</Button>
			) : (
				<Button
					onClick={() => setOpen(true)}
					className={cn(
						"min-w-0 justify-between gap-3 px-3 sm:gap-6",
						className,
					)}
					variant="outline"
					aria-label="Open site search"
				>
					<span className="text-muted-foreground">Search...</span>
					<kbd className="hidden text-xs tracking-widest text-muted-foreground sm:inline-flex">
						Ctrl K
					</kbd>
				</Button>
			)}

			{/* Mounted on first open only: keeps cmdk + the dialog out of the
			    bundle every page loads. Stays mounted so the close animation runs. */}
			{hasOpened ? (
				<SearchDialog
					open={open}
					onOpenChange={setOpen}
					onSelect={handleSelect}
				/>
			) : null}
		</>
	);
}

// true from the first time `value` is true onwards.
function useLatch(value: boolean) {
	const [latched, setLatched] = React.useState(value);
	if (value && !latched) setLatched(true);
	return latched;
}
