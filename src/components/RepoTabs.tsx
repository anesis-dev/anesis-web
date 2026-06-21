"use client";

import { cn } from "@/lib/utils";

export interface RepoTab {
	id: string;
	label: string;
	icon: React.ElementType;
	count?: number;
}

export function RepoTabs({
	tabs,
	active,
	onChange,
	className,
}: {
	tabs: RepoTab[];
	active: string;
	onChange: (id: string) => void;
	className?: string;
}) {
	return (
		<div className={cn("border-b", className)}>
			<nav
				className="-mb-px flex gap-1 overflow-x-auto"
				role="tablist"
				aria-label="Sections"
			>
				{tabs.map((tab) => {
					const Icon = tab.icon;
					const isActive = active === tab.id;

					return (
						<button
							key={tab.id}
							type="button"
							role="tab"
							aria-selected={isActive}
							onClick={() => onChange(tab.id)}
							className={cn(
								"group inline-flex items-center gap-2 whitespace-nowrap rounded-t-md border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors",
								isActive
									? "border-primary text-foreground"
									: "border-transparent text-muted-foreground hover:border-border hover:bg-muted/40 hover:text-foreground",
							)}
						>
							<Icon
								className={cn(
									"size-4",
									isActive ? "text-foreground" : "text-muted-foreground",
								)}
							/>
							{tab.label}
							{typeof tab.count === "number" ? (
								<span
									className={cn(
										"rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
										isActive
											? "bg-primary/10 text-primary"
											: "bg-muted text-muted-foreground",
									)}
								>
									{tab.count}
								</span>
							) : null}
						</button>
					);
				})}
			</nav>
		</div>
	);
}
