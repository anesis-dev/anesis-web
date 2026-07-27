"use client";

import { useState } from "react";
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarButtonProps {
	isStarred: boolean;
	starCount: number;
	onToggle: () => void;
	loading?: boolean;
	disabled?: boolean;
	variant?: "button" | "icon";
}

export function StarButton({
	isStarred,
	starCount,
	onToggle,
	loading = false,
	disabled = false,
	variant = "button",
}: StarButtonProps) {
	const [optimisticStarred, setOptimisticStarred] = useState<boolean | null>(null);
	const [optimisticCount, setOptimisticCount] = useState<number | null>(null);

	const displayStarred = optimisticStarred ?? isStarred;
	const displayCount = optimisticCount ?? starCount;

	function handleClick(e: React.MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (loading || disabled) return;

		const next = !displayStarred;
		setOptimisticStarred(next);
		setOptimisticCount(displayCount + (next ? 1 : -1));

		Promise.resolve(onToggle()).catch(() => {
			setOptimisticStarred(null);
			setOptimisticCount(null);
		});
	}

	if (variant === "icon") {
		return (
			<button
				type="button"
				onClick={handleClick}
				disabled={loading || disabled}
				title={disabled ? "Log in to star" : displayStarred ? "Unstar" : "Star"}
				aria-label={
					disabled
						? "Log in to star"
						: `${displayStarred ? "Unstar" : "Star"} (${displayCount})`
				}
				aria-pressed={displayStarred}
				className={cn(
					"relative z-10 flex items-center gap-1 rounded px-1 py-0.5 text-[11px] font-medium transition-colors",
					disabled || loading
						? "cursor-not-allowed text-muted-foreground/40"
						: displayStarred
							? "text-amber-500 hover:text-amber-400"
							: "text-muted-foreground hover:text-foreground",
				)}
			>
				<StarIcon className={cn("size-3.5 shrink-0", displayStarred && "fill-current")} />
				<span className="tabular-nums">{displayCount}</span>
			</button>
		);
	}

	return (
		<div className="flex items-center">
			<button
				type="button"
				onClick={handleClick}
				disabled={loading || disabled}
				title={disabled ? "Log in to star" : displayStarred ? "Unstar" : "Star this"}
				aria-label={
					disabled
						? "Log in to star"
						: `${displayStarred ? "Unstar" : "Star"} (${displayCount})`
				}
				aria-pressed={displayStarred}
				className={cn(
					"inline-flex items-center gap-1.5 rounded-l-md border px-3 py-1.5 text-sm font-medium transition-colors",
					disabled || loading
						? "cursor-not-allowed border-border bg-muted/50 text-muted-foreground/50"
						: displayStarred
							? "border-amber-400/60 bg-amber-50 text-amber-600 hover:bg-amber-100 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
							: "border-border bg-muted/30 text-foreground hover:bg-muted",
				)}
			>
				<StarIcon
					className={cn("size-4 shrink-0", displayStarred && "fill-current")}
				/>
				<span>{displayStarred ? "Starred" : "Star"}</span>
			</button>
			<span
				className={cn(
					"inline-flex min-w-[2rem] items-center justify-center rounded-r-md border border-l-0 px-2.5 py-1.5 text-sm font-medium tabular-nums",
					disabled || loading
						? "border-border bg-muted/50 text-muted-foreground/50"
						: displayStarred
							? "border-amber-400/60 bg-amber-50 text-amber-600 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-400"
							: "border-border bg-muted/30 text-foreground",
				)}
			>
				{displayCount}
			</span>
		</div>
	);
}
