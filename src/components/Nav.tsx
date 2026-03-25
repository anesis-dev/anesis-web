import Link from "next/link";
import { Button } from "./ui/button";
import { nav } from "@/constants/nav";

export default function Nav() {
	return (
		<nav className="-mx-1 flex items-center gap-1 overflow-x-auto pb-1 lg:mx-0 lg:overflow-visible lg:pb-0">
			{nav.map((n, i) => (
				<Button
					key={i}
					variant="ghost"
					className="h-9 shrink-0 whitespace-nowrap px-3 sm:px-4"
					asChild
				>
					<Link href={`/${n.url}`} className="font-medium">
						{n.title}
					</Link>
				</Button>
			))}
		</nav>
	);
}
