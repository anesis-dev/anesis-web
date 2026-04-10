import Link from "next/link";
import { formatDate } from "@/lib/date";
import { IAddon } from "@/types/addon";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	Clock3Icon,
	ExternalLinkIcon,
	HashIcon,
	ShieldCheckIcon,
	UserIcon,
} from "lucide-react";

function Badge({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
				className,
			)}
		>
			{children}
		</span>
	);
}

export function AddonStatusBadge({ official }: { official: boolean }) {
	return official ? (
		<span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
			<ShieldCheckIcon className="size-3" />
			Official
		</span>
	) : (
		<span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
			Community
		</span>
	);
}

interface AddonCardProps {
	addon: IAddon;
}

export function AddonCard({ addon }: AddonCardProps) {
	const { config } = addon;

	return (
		<Card className="flex h-full flex-col gap-4 py-5 transition-colors hover:border-foreground/30">
			<CardHeader className="gap-2 pb-0">
				<div className="flex items-start justify-between gap-3">
					<div className="space-y-1">
						<CardTitle className="text-base leading-snug">
							{config.name}
						</CardTitle>
						<CardDescription className="line-clamp-3 text-xs leading-relaxed">
							{config.description}
						</CardDescription>
					</div>
					<AddonStatusBadge official={addon.official} />
				</div>
			</CardHeader>

			<CardContent className="flex flex-col gap-3">
				<div className="flex flex-wrap gap-1.5">
					<Badge className="border-orange-500/20 bg-orange-500/6 text-orange-700/85 dark:text-orange-300/90">
						<HashIcon className="mr-1 size-3" />
						{addon.addon_id}
					</Badge>
					<Badge className="border-border bg-muted/40 text-muted-foreground">
						v{addon.version}
					</Badge>
					<Badge className="border-border bg-muted/40 text-muted-foreground">
						schema {config.schema_version}
					</Badge>
				</div>

				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<UserIcon className="size-3.5 shrink-0" />
					<span className="truncate">{config.author}</span>
				</div>

				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Clock3Icon className="size-3.5 shrink-0" />
					<span>Published {formatDate(addon.created_at)}</span>
				</div>
			</CardContent>

			<CardFooter className="mt-auto border-t pt-4">
				<Button
					asChild
					size="sm"
					variant="outline"
					className="min-w-0 flex-1 justify-center gap-1.5"
				>
					<Link
						href={addon.url}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`Open repository for ${config.name}`}
					>
						<ExternalLinkIcon className="size-3.5" />
						Open repository
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
