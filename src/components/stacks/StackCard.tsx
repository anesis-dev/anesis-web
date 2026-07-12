import Link from "next/link";
import { PackageIcon, StarIcon } from "lucide-react";
import { IStack } from "@/types/stack";

export function StackCard({ stack }: { stack: IStack }) {
	return (
		<Link
			href={`/stacks/${encodeURIComponent(stack.stack_id)}`}
			className="flex h-full flex-col gap-3 rounded-xl border bg-card px-6 py-5 transition-colors hover:border-primary/50"
		>
			<div className="flex items-start justify-between gap-3">
				<h2 className="font-medium">{stack.name}</h2>
				{stack.official ? (
					<span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
						official
					</span>
				) : null}
			</div>
			<p className="line-clamp-2 text-sm text-muted-foreground">
				{stack.description || "No description."}
			</p>
			<div className="mt-auto flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
				<span className="inline-flex items-center gap-1">
					<PackageIcon className="size-3.5" />
					{stack.config?.template}
				</span>
				<span>{stack.config?.addons?.length ?? 0} addons</span>
				{stack.star_count ? (
					<span className="inline-flex items-center gap-1">
						<StarIcon className="size-3.5" />
						{stack.star_count}
					</span>
				) : null}
			</div>
		</Link>
	);
}
