"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DownloadIcon, PackageIcon } from "lucide-react";
import { RegistryCard } from "@/components/registry/RegistryCard";
import { authorLogin } from "@/lib/author";
import { useAuth } from "@/hooks/useAuth";
import { starStack } from "@/services/stack";
import { IStack } from "@/types/stack";

export function StackCard({ stack }: { stack: IStack }) {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [isStarred, setIsStarred] = useState(stack.is_starred ?? false);
	const [starCount, setStarCount] = useState(stack.star_count ?? 0);
	const [starring, setStarring] = useState(false);
	const ownerLogin = authorLogin(stack.config?.author);

	useEffect(() => {
		setIsStarred(stack.is_starred ?? false);
		setStarCount(stack.star_count ?? 0);
	}, [stack.is_starred, stack.star_count]);

	async function handleStar() {
		if (starring) return;
		setStarring(true);
		try {
			const result = await starStack(stack.stack_id);
			setIsStarred(result.is_starred);
			setStarCount(result.star_count);
			await queryClient.invalidateQueries({ queryKey: ["stacks"] });
		} finally {
			setStarring(false);
		}
	}

	return (
		<RegistryCard
			href={`/stacks/${encodeURIComponent(stack.stack_id)}`}
			title={stack.name}
			description={stack.description}
			official={stack.official}
			isPrivate={stack.visibility === "private"}
			owner={
				ownerLogin ? { label: `@${ownerLogin}`, href: `/user/${ownerLogin}` } : null
			}
			version={stack.version}
			versionCount={stack.versionCount}
			meta={[{ icon: <PackageIcon className="size-3.5" />, label: stack.config?.template }]}
			tags={stack.config?.addons?.map((addon) => addon.id)}
			isStarred={isStarred}
			starCount={starCount}
			onToggleStar={handleStar}
			starring={starring}
			starDisabled={!user}
			footerExtras={
				(stack.download_count ?? 0) > 0 ? (
					<span
						className="flex items-center gap-1 text-[11px] text-muted-foreground"
						title={`${stack.download_count} installs`}
					>
						<DownloadIcon className="size-3" />
						{stack.download_count}
					</span>
				) : undefined
			}
		/>
	);
}
