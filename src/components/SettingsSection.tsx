import { cn } from "@/lib/utils";

export function SettingsSection({
	title,
	description,
	tone = "default",
	children,
}: {
	title: string;
	description?: string;
	tone?: "default" | "danger";
	children: React.ReactNode;
}) {
	const isDanger = tone === "danger";

	return (
		<section
			className={cn(
				"overflow-hidden rounded-2xl border bg-card shadow-sm",
				isDanger && "border-destructive/40",
			)}
		>
			<header
				className={cn(
					"border-b px-5 py-4",
					isDanger && "border-destructive/40 bg-destructive/5",
				)}
			>
				<h3
					className={cn(
						"text-base font-semibold",
						isDanger && "text-destructive",
					)}
				>
					{title}
				</h3>
				{description ? (
					<p className="mt-1 text-sm text-muted-foreground">{description}</p>
				) : null}
			</header>
			<div className="divide-y">{children}</div>
		</section>
	);
}

export function SettingsRow({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="min-w-0">
				<p className="text-sm font-medium text-foreground">{title}</p>
				{description ? (
					<p className="mt-1 text-sm text-muted-foreground">{description}</p>
				) : null}
			</div>
			<div className="shrink-0">{children}</div>
		</div>
	);
}
