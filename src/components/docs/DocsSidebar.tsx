"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav, docsNavSections } from "@/constants/docsNav";
import { cn } from "@/lib/utils";

export function DocsSidebar() {
	const pathname = usePathname();

	return (
		<>
			{}
			<div className="overflow-x-auto border-b lg:hidden">
				<nav className="flex min-w-max gap-2 p-3 sm:p-4">
					{docsNav.map((item) => {
						const active = pathname === item.href;
						const Icon = item.icon;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
									active
										? "border-primary bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-accent hover:text-foreground",
								)}
							>
								<Icon className="size-3.5" />
								{item.title}
							</Link>
						);
					})}
				</nav>
			</div>

			{}
			<aside className="hidden lg:flex lg:w-64 lg:shrink-0 xl:w-72">
				<div className="sticky top-0 flex h-dvh w-full flex-col border-r bg-card/60">
					<div className="px-5 py-4">
						<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
							Documentation
						</p>
					</div>

					<nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-2 pb-8">
						{docsNavSections.map((section) => (
							<div key={section.label} className="flex flex-col gap-1">
								<p className="px-3 pb-1 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
									{section.label}
								</p>
								{section.items.map((item) => {
									const active = pathname === item.href;
									const Icon = item.icon;
									return (
										<Link
											key={item.href}
											href={item.href}
											aria-current={active ? "page" : undefined}
											className={cn(
												"flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
												active
													? "bg-accent font-medium text-foreground"
													: "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
											)}
										>
											<Icon
												className={cn(
													"size-4 shrink-0",
													active ? "text-primary" : "text-muted-foreground/70",
												)}
											/>
											{item.title}
										</Link>
									);
								})}
							</div>
						))}
					</nav>
				</div>
			</aside>
		</>
	);
}
