"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CommandCard } from "@/components/CommandCard";
import { StarButton } from "@/components/StarButton";
import { useAuth } from "@/hooks/useAuth";
import { useStack } from "@/hooks/useStack";
import { getTemplateLatestHref } from "@/lib/template-ref";
import { starStack } from "@/services/stack";
import { AlertCircleIcon, ArrowLeftIcon, PackageIcon } from "lucide-react";

export function StackDetail({ stackRef }: { stackRef: string }) {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { stack, isLoading, isError } = useStack(stackRef);
	const [isStarred, setIsStarred] = useState(false);
	const [starCount, setStarCount] = useState(0);
	const [starring, setStarring] = useState(false);

	useEffect(() => {
		setIsStarred(stack?.is_starred ?? false);
		setStarCount(stack?.star_count ?? 0);
	}, [stack?.is_starred, stack?.star_count]);

	if (isLoading) {
		return (
			<div className="mx-auto w-full max-w-3xl px-4 py-10">
				<div className="h-8 w-1/2 animate-pulse rounded bg-muted" />
				<div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-muted" />
				<div className="mt-8 h-40 animate-pulse rounded-xl bg-muted" />
			</div>
		);
	}

	if (isError || !stack) {
		return (
			<div className="mx-auto w-full max-w-3xl px-4 py-10">
				<div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
					<AlertCircleIcon className="size-4" /> Stack &ldquo;{stackRef}&rdquo; was not found.
				</div>
				<Link
					href="/stacks"
					className="mt-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
				>
					<ArrowLeftIcon className="size-4" /> Back to stacks
				</Link>
			</div>
		);
	}

	const { config } = stack;
	const stackId = stack.stack_id;

	async function handleStar() {
		if (starring || !user) return;
		setStarring(true);
		try {
			const result = await starStack(stackId);
			setIsStarred(result.is_starred);
			setStarCount(result.star_count);
			await queryClient.invalidateQueries({ queryKey: ["stack", stackRef] });
			await queryClient.invalidateQueries({ queryKey: ["stacks"] });
		} finally {
			setStarring(false);
		}
	}

	return (
		<div className="mx-auto w-full max-w-3xl px-4 py-10">
			<Link
				href="/stacks"
				className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
			>
				<ArrowLeftIcon className="size-4" /> Stacks
			</Link>

			<div className="mt-4 flex items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">{stack.name}</h1>
					<p className="mt-1 text-sm text-muted-foreground">{stack.description}</p>
				</div>
				<div className="flex shrink-0 items-center gap-2">
					{stack.official ? (
						<span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
							official
						</span>
					) : null}
					<StarButton
						isStarred={isStarred}
						starCount={starCount}
						onToggle={handleStar}
						loading={starring}
						disabled={!user}
					/>
				</div>
			</div>

			<CommandCard
				className="mt-6"
				label="Scaffold this stack"
				command={`anesis new my-app --stack ${stack.stack_id}`}
				helper="Generates the template, then applies every addon in order."
			/>

			<section className="mt-8">
				<h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
					Composition
				</h2>

				<div className="mt-3 rounded-xl border">
					<Link
						href={getTemplateLatestHref(config.template)}
						className="flex items-center justify-between border-b px-4 py-3 transition-colors hover:bg-muted/40"
					>
						<span className="flex items-center gap-2">
							<PackageIcon className="size-4 text-primary" />
							<span className="font-medium">{config.template}</span>
						</span>
						<span className="text-xs text-muted-foreground">template</span>
					</Link>

					<ol className="divide-y">
						{config.addons.map((addon, index) => (
							<li
								key={`${addon.id}-${index}`}
								className="flex items-center justify-between px-4 py-3"
							>
								<span className="flex items-center gap-3">
									<span className="text-xs text-muted-foreground">{index + 1}</span>
									<Link href="/addons" className="font-medium hover:underline">
										{addon.id}
									</Link>
									<span className="text-xs text-muted-foreground">{addon.command}</span>
								</span>
								{addon.inputs && Object.keys(addon.inputs).length > 0 ? (
									<span className="text-xs text-muted-foreground">
										{Object.entries(addon.inputs)
											.map(([key, value]) => `${key}=${value}`)
											.join(", ")}
									</span>
								) : null}
							</li>
						))}
					</ol>
				</div>
			</section>
		</div>
	);
}
