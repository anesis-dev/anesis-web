import { cn } from "@/lib/utils";

export function StatCard({
	label,
	value,
	helper,
	icon: Icon,
	className,
}: {
	label: string;
	value: React.ReactNode;
	helper?: string;
	icon: React.ElementType;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm",
				className,
			)}
		>
			<div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
				<Icon className="size-4" />
				<span>{label}</span>
			</div>
			<p className="text-3xl font-semibold tracking-tight tabular-nums text-foreground">
				{value}
			</p>
			{helper ? (
				<p className="text-sm leading-6 text-muted-foreground">{helper}</p>
			) : null}
		</div>
	);
}
