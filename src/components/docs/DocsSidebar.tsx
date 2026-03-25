"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "@/constants/docsNav";
import { cn } from "@/lib/utils";

export function DocsSidebar() {
	const pathname = usePathname();

	return (
		<>
			<div className="overflow-x-auto border-b lg:hidden">
				<nav className="flex min-w-max gap-2 p-4">
					{docsNav.map((item) => {
						const active = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"rounded-full border px-3 py-1.5 text-sm transition-colors",
									active
										? "border-primary bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-accent hover:text-foreground",
								)}
							>
								{item.title}
							</Link>
						);
					})}
				</nav>
			</div>

			<aside className="hidden lg:flex lg:w-60 lg:shrink-0">
				<div className="sticky top-0 flex h-[calc(100dvh-8vh)] w-full flex-col border-r bg-card/60">
					<div className="px-5 py-4">
						<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
							Docs
						</p>
					</div>

					<nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-3">
						{docsNav.map((item) => {
							const active = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										"rounded-md px-3 py-2 text-sm transition-colors",
										active
											? "bg-accent text-foreground"
											: "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
									)}
								>
									{item.title}
								</Link>
							);
						})}
					</nav>
				</div>
			</aside>
		</>
	);
}
