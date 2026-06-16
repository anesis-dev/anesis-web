/**
 * Docs prev / next pagination — Server Component.
 *
 * Looks up `currentHref` in the `docsNav` array and renders "← Previous" and
 * "Next →" buttons for adjacent items. Returns `null` if the current href is
 * not found in the nav (e.g. unlisted pages).
 */
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { docsNav } from "@/constants/docsNav";

export function DocsPagination({ currentHref }: { currentHref: string }) {
	const currentIndex = docsNav.findIndex((item) => item.href === currentHref);

	if (currentIndex === -1) {
		return null;
	}

	const previous = currentIndex > 0 ? docsNav[currentIndex - 1] : null;
	const next = currentIndex < docsNav.length - 1 ? docsNav[currentIndex + 1] : null;

	return (
		<div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
			<div>
				{previous && (
					<Button
						variant="outline"
						asChild
						className="h-auto w-full justify-between whitespace-normal px-4 py-3 text-left sm:w-auto sm:justify-center"
					>
						<Link href={previous.href}>
							<ArrowLeftIcon className="size-4" />
							{previous.title}
						</Link>
					</Button>
				)}
			</div>
			<div className="sm:text-right">
				{next && (
					<Button
						variant="outline"
						asChild
						className="h-auto w-full justify-between whitespace-normal px-4 py-3 text-left sm:w-auto sm:justify-center"
					>
						<Link href={next.href}>
							{next.title}
							<ArrowRightIcon className="size-4" />
						</Link>
					</Button>
				)}
			</div>
		</div>
	);
}
