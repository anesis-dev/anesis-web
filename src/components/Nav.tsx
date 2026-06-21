
import Link from "next/link";

const navItems = [
	{ title: "Docs", url: "docs" },
	{ title: "Templates", url: "templates" },
	{ title: "Addons", url: "addons" },
];

export default function Nav() {
	return (
		<nav className="-mx-1 flex items-center gap-1 overflow-x-auto pb-1 lg:mx-0 lg:overflow-visible lg:pb-0">
			{navItems.map((n, i) => (
				<Link
					key={i}
					href={`/${n.url}`}
					className="shrink-0 whitespace-nowrap px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:px-4"
				>
					{n.title}
				</Link>
			))}
		</nav>
	);
}
