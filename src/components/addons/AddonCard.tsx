/**
 * Addon card — Client Component.
 *
 * Renders a compact card for an addon in grid listings. Structure mirrors
 * `TemplateCard`: an absolutely-positioned link overlay covers the card,
 * while the star button and author link sit above it via `z-10`.
 *
 * Props:
 * - `addon` — the full `IAddon` object from the API.
 * - `visibility` — optional override for the visibility badge.
 *
 * `AddonStatusBadge` is also exported for reuse in detail pages.
 */
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getAddonHref } from "@/lib/addon-ref";
import { IAddon } from "@/types/addon";
import {
	Card,
	CardFooter,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { cn } from "@/lib/utils";
import { LockIcon, ShieldCheckIcon, UsersIcon } from "lucide-react";
import { StarButton } from "@/components/StarButton";
import { starAddon } from "@/services/addon";
import { useAuth } from "@/hooks/useAuth";

function Tag({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium bg-muted text-muted-foreground",
				className,
			)}
		>
			{children}
		</span>
	);
}

export function AddonStatusBadge({ official }: { official: boolean }) {
	return official ? (
		<span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
			<ShieldCheckIcon className="size-2.5" />
			Official
		</span>
	) : null;
}

interface AddonCardProps {
	addon: IAddon;
	visibility?: string;
}

export function AddonCard({ addon, visibility }: AddonCardProps) {
	const { config } = addon;
	const detailsHref = getAddonHref(addon);

	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [isStarred, setIsStarred] = useState(addon.is_starred ?? false);
	const [starCount, setStarCount] = useState(addon.star_count ?? 0);
	const [starring, setStarring] = useState(false);

	useEffect(() => {
		setIsStarred(addon.is_starred ?? false);
		setStarCount(addon.star_count ?? 0);
	}, [addon.is_starred, addon.star_count]);

	async function handleStar() {
		if (starring) return;
		setStarring(true);
		try {
			const result = await starAddon(addon.addon_id);
			setIsStarred(result.is_starred);
			setStarCount(result.star_count);
			await queryClient.invalidateQueries({ queryKey: ["addons"] });
		} finally {
			setStarring(false);
		}
	}

	return (
		<Card className="relative gap-3 py-4 h-full transition-colors hover:border-foreground/30">
			<Link
				href={detailsHref}
				className="absolute inset-0 rounded-[inherit]"
				aria-label={config.name}
			/>

			<CardHeader className="gap-1 pb-0">
				<div className="flex items-start justify-between gap-2">
					<CardTitle className="text-sm font-semibold leading-snug">
						{config.name}
					</CardTitle>
					<div className="flex items-center gap-1 shrink-0">
						<AddonStatusBadge official={addon.official} />
						{(visibility ?? addon.visibility) === "private" && (
							<span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
								<LockIcon className="size-2.5" />
								Private
							</span>
						)}
						{(visibility ?? addon.visibility) === "org_private" && (
							<span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400">
								<UsersIcon className="size-2.5" />
								Members only
							</span>
						)}
					</div>
				</div>
				<CardDescription className="line-clamp-2 text-xs leading-relaxed">
					{config.description}
				</CardDescription>
			</CardHeader>

			<CardFooter className="mt-auto flex items-center justify-between gap-3 border-t pt-3">
				<Link
					href={`/user/${config.author}`}
					className="relative z-10 flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
				>
					<GitHubIcon className="size-3 shrink-0" />
					<span className="truncate">@{config.author}</span>
				</Link>

				<div className="flex items-center gap-2 shrink-0">
					<StarButton
						isStarred={isStarred}
						starCount={starCount}
						onToggle={handleStar}
						loading={starring}
						disabled={!user}
						variant="icon"
					/>
					<span className="font-mono text-[11px] text-muted-foreground">
						v{addon.version}
					</span>
				</div>
			</CardFooter>
		</Card>
	);
}
