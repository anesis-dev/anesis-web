import {
	InfoIcon,
	LightbulbIcon,
	TriangleAlertIcon,
	type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutVariant = "note" | "tip" | "warning";

const variants: Record<
	CalloutVariant,
	{ icon: LucideIcon; label: string; className: string; iconClassName: string }
> = {
	note: {
		icon: InfoIcon,
		label: "Note",
		className: "border-border bg-muted/40",
		iconClassName: "text-muted-foreground",
	},
	tip: {
		icon: LightbulbIcon,
		label: "Tip",
		className: "border-primary/30 bg-primary/5",
		iconClassName: "text-primary",
	},
	warning: {
		icon: TriangleAlertIcon,
		label: "Heads up",
		className: "border-amber-500/30 bg-amber-500/5",
		iconClassName: "text-amber-600 dark:text-amber-500",
	},
};


export function Callout({
	variant = "note",
	title,
	children,
}: {
	variant?: CalloutVariant;
	title?: string;
	children: React.ReactNode;
}) {
	const { icon: Icon, label, className, iconClassName } = variants[variant];

	return (
		<div className={cn("flex gap-3 rounded-xl border p-4", className)}>
			<Icon className={cn("mt-0.5 size-4 shrink-0", iconClassName)} />
			<div className="min-w-0 space-y-1 text-sm leading-6">
				<p className="font-medium text-foreground">{title ?? label}</p>
				<div className="text-muted-foreground">{children}</div>
			</div>
		</div>
	);
}
