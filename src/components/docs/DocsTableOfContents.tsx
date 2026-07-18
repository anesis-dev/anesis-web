"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface TocItem {
	id: string;
	text: string;
	level: 2 | 3;
}

function slugify(text: string) {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}


export function DocsTableOfContents() {
	const pathname = usePathname();
	const [items, setItems] = useState<TocItem[]>([]);
	const [activeId, setActiveId] = useState<string | null>(null);

	useEffect(() => {
		const container = document.getElementById("docs-article");
		if (!container) {
			setItems([]);
			return;
		}

		const headings = Array.from(
			container.querySelectorAll<HTMLHeadingElement>("h2, h3"),
		);

		const collected: TocItem[] = headings.map((heading) => {
			if (!heading.id) {
				heading.id = slugify(heading.textContent ?? "");
			}
			return {
				id: heading.id,
				text: heading.textContent ?? "",
				level: heading.tagName === "H3" ? 3 : 2,
			};
		});

		setItems(collected.filter((item) => item.id && item.text));

		if (headings.length === 0) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
				if (visible.length > 0) {
					setActiveId(visible[0].target.id);
				}
			},
			{ rootMargin: "0px 0px -70% 0px", threshold: 1 },
		);

		headings.forEach((heading) => observer.observe(heading));
		return () => observer.disconnect();
	}, [pathname]);

	if (items.length < 2) {
		return null;
	}

	return (
		<aside className="hidden w-56 shrink-0 2xl:block">
			<div className="sticky top-0 max-h-dvh overflow-y-auto py-10 pr-6">
				<p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
					On this page
				</p>
				<ul className="mt-3 space-y-1 border-l">
					{items.map((item) => (
						<li key={item.id}>
							<a
								href={`#${item.id}`}
								className={cn(
									"-ml-px block border-l py-1 text-sm transition-colors",
									item.level === 3 ? "pl-6" : "pl-3",
									activeId === item.id
										? "border-primary font-medium text-foreground"
										: "border-transparent text-muted-foreground hover:text-foreground",
								)}
							>
								{item.text}
							</a>
						</li>
					))}
				</ul>
			</div>
		</aside>
	);
}
