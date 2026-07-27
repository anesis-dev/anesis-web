import * as React from "react";
import { ShieldCheckIcon, LockIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const badgeVariantClasses = {
	official: "gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary",
	private:
		"gap-1 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400",
	tag: "rounded px-1.5 py-0.5 text-[11px] font-medium bg-muted text-muted-foreground",
	pill: "max-w-full rounded-full border bg-background/75 px-2.5 py-1 text-center text-xs font-medium text-muted-foreground break-words dark:bg-background/20",
	outline: "rounded-md border px-2 py-0.5 text-xs font-medium",
} as const;

export type BadgeVariant = keyof typeof badgeVariantClasses;

export interface BadgeProps extends React.ComponentProps<"span"> {
	variant?: BadgeVariant;
}

function Badge({ variant = "tag", className, ...props }: BadgeProps) {
	return (
		<span
			data-slot="badge"
			className={cn(
				"inline-flex items-center justify-center",
				badgeVariantClasses[variant],
				className,
			)}
			{...props}
		/>
	);
}

function OfficialBadge({ className }: { className?: string }) {
	return (
		<Badge variant="official" className={className}>
			<ShieldCheckIcon className="size-2.5" />
			Official
		</Badge>
	);
}

function PrivateBadge({ className }: { className?: string }) {
	return (
		<Badge variant="private" className={className}>
			<LockIcon className="size-2.5" />
			Private
		</Badge>
	);
}

export { Badge, OfficialBadge, PrivateBadge };
