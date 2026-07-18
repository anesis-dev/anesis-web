"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PackageIcon } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { StarButton } from "@/components/StarButton";
import { useAuth } from "@/hooks/useAuth";
import { starStack } from "@/services/stack";
import { IStack } from "@/types/stack";

export function StackCard({ stack }: { stack: IStack }) {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [isStarred, setIsStarred] = useState(stack.is_starred ?? false);
	const [starCount, setStarCount] = useState(stack.star_count ?? 0);
	const [starring, setStarring] = useState(false);

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
		<Card className="relative gap-3 py-4 h-full transition-colors hover:border-foreground/30">
			<Link
				href={`/stacks/${encodeURIComponent(stack.stack_id)}`}
				className="absolute inset-0 rounded-[inherit]"
				aria-label={stack.name}
			/>

			<CardHeader className="gap-1 pb-0">
				<div className="flex items-start justify-between gap-2">
					<CardTitle className="text-sm font-semibold leading-snug">
						{stack.name}
					</CardTitle>
					{stack.official ? (
						<span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
							official
						</span>
					) : null}
				</div>
				<CardDescription className="line-clamp-2 text-xs leading-relaxed">
					{stack.description || "No description."}
				</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
					<span className="inline-flex items-center gap-1">
						<PackageIcon className="size-3.5" />
						{stack.config?.template}
					</span>
					<span>{stack.config?.addons?.length ?? 0} addons</span>
				</div>
			</CardContent>

			<CardFooter className="mt-auto flex items-center justify-end gap-3 border-t pt-3">
				<StarButton
					isStarred={isStarred}
					starCount={starCount}
					onToggle={handleStar}
					loading={starring}
					disabled={!user}
					variant="icon"
				/>
			</CardFooter>
		</Card>
	);
}
