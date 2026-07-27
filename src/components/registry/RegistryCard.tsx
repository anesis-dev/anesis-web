"use client";

import Link from "next/link";
import { ReactNode } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge, OfficialBadge, PrivateBadge } from "@/components/ui/badge";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { StarButton } from "@/components/StarButton";

export interface RegistryCardOwner {
	label: string;
	href: string;
	icon?: ReactNode;
}

export interface RegistryCardMetaItem {
	icon?: ReactNode;
	label: ReactNode;
	title?: string;
}

const MAX_VISIBLE_TAGS = 4;

export interface RegistryCardProps {
	href: string;
	title: string;
	description?: string;
	official?: boolean;
	isPrivate?: boolean;
	owner?: RegistryCardOwner | null;
	tags?: string[];
	meta?: RegistryCardMetaItem[];
	version?: string;
	versionCount?: number;
	footerExtras?: ReactNode;
	isStarred: boolean;
	starCount: number;
	onToggleStar: () => void;
	starring?: boolean;
	starDisabled?: boolean;
}

export function RegistryCard({
	href,
	title,
	description,
	official = false,
	isPrivate = false,
	owner,
	tags,
	meta,
	version,
	versionCount = 1,
	footerExtras,
	isStarred,
	starCount,
	onToggleStar,
	starring = false,
	starDisabled = false,
}: RegistryCardProps) {
	const hasContent = (meta && meta.length > 0) || (tags && tags.length > 0);

	return (
		<Card className="relative gap-3 py-4 h-full transition-colors hover:border-foreground/30">
			<Link href={href} className="absolute inset-0 rounded-[inherit]" aria-label={title} />

			<CardHeader className="gap-1 pb-0">
				<div className="flex items-start justify-between gap-2">
					<CardTitle className="text-sm font-semibold leading-snug">{title}</CardTitle>
					<div className="flex items-center gap-1 shrink-0">
						{official && <OfficialBadge />}
						{isPrivate && <PrivateBadge />}
					</div>
				</div>
				<CardDescription className="line-clamp-2 text-xs leading-relaxed">
					{description || "No description."}
				</CardDescription>
			</CardHeader>

			{hasContent && (
				<CardContent className="flex flex-col gap-2">
					{meta && meta.length > 0 && (
						<div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
							{meta.map((item, index) => (
								<span key={index} className="inline-flex items-center gap-1" title={item.title}>
									{item.icon}
									{item.label}
								</span>
							))}
						</div>
					)}
					{tags && tags.length > 0 && (
						<div className="flex flex-nowrap items-center gap-1 overflow-hidden">
							{tags.slice(0, MAX_VISIBLE_TAGS).map((tag) => (
								<Badge key={tag} variant="tag" className="shrink-0">
									{tag}
								</Badge>
							))}
							{tags.length > MAX_VISIBLE_TAGS && (
								<Badge variant="tag" className="shrink-0">
									+{tags.length - MAX_VISIBLE_TAGS}
								</Badge>
							)}
						</div>
					)}
				</CardContent>
			)}

			<CardFooter className="mt-auto flex items-center justify-between gap-3 border-t pt-3">
				{owner ? (
					<Link
						href={owner.href}
						className="relative z-10 flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
					>
						{owner.icon ?? <GitHubIcon className="size-3 shrink-0" />}
						<span className="truncate">{owner.label}</span>
					</Link>
				) : (
					<span />
				)}

				<div className="flex items-center gap-2 shrink-0">
					{footerExtras}
					<StarButton
						isStarred={isStarred}
						starCount={starCount}
						onToggle={onToggleStar}
						loading={starring}
						disabled={starDisabled}
						variant="icon"
					/>
					{version && (
						<span className="font-mono text-[11px] text-muted-foreground">
							v{version}
							{versionCount > 1 && (
								<span className="ml-1 text-muted-foreground/60">({versionCount})</span>
							)}
						</span>
					)}
				</div>
			</CardFooter>
		</Card>
	);
}
