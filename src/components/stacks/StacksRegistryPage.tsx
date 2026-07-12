"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/PaginationControls";
import { StackCard } from "@/components/stacks/StackCard";
import { useStacks } from "@/hooks/useStacks";
import { getDateTimestamp } from "@/lib/date";
import { AlertCircleIcon, LayersIcon, SearchIcon } from "lucide-react";

const PAGE_SIZE = 24;

function StackSkeleton() {
	return (
		<div className="flex h-full animate-pulse flex-col gap-4 rounded-xl border bg-card px-6 py-5">
			<div className="h-4 w-2/3 rounded bg-muted" />
			<div className="space-y-2">
				<div className="h-3 w-full rounded bg-muted" />
				<div className="h-3 w-4/5 rounded bg-muted" />
			</div>
			<div className="mt-auto h-5 w-40 rounded bg-muted" />
		</div>
	);
}

export function StacksRegistryPage() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const { stacks, isLoading, isError, pagination } = useStacks(
		{ page, pageSize: PAGE_SIZE },
		{ search },
	);

	// Server handles search/pagination; keep official stacks first within the page.
	const sorted = useMemo(
		() =>
			[...stacks].sort((left, right) => {
				if (left.official !== right.official) {
					return Number(right.official) - Number(left.official);
				}
				return (
					getDateTimestamp(right.created_at) - getDateTimestamp(left.created_at)
				);
			}),
		[stacks],
	);
	const totalPages = Math.max(1, pagination?.totalPages ?? 1);

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-10">
			<div className="flex items-center gap-3">
				<LayersIcon className="size-6 text-primary" />
				<h1 className="text-2xl font-semibold tracking-tight">Stacks</h1>
			</div>
			<p className="mt-2 max-w-2xl text-sm text-muted-foreground">
				A stack is a template plus an ordered list of addons with pinned inputs — scaffold a
				batteries-included project in one command.
			</p>

			<div className="relative mt-6 max-w-md">
				<SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					value={search}
					onChange={(event) => {
						setSearch(event.target.value);
						setPage(1);
					}}
					placeholder="Search stacks..."
					className="pl-9"
				/>
			</div>

			{isError ? (
				<div className="mt-8 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
					<AlertCircleIcon className="size-4" /> Could not load stacks. Please try again.
				</div>
			) : null}

			<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{isLoading ? (
					Array.from({ length: 6 }).map((_, index) => <StackSkeleton key={index} />)
				) : sorted.length === 0 ? (
					<p className="text-sm text-muted-foreground">No stacks published yet.</p>
				) : (
					sorted.map((stack) => <StackCard key={stack.stack_id} stack={stack} />)
				)}
			</div>

			{!isLoading && !isError && (
				<div className="mt-8">
					<PaginationControls
						page={Math.min(page, totalPages)}
						totalPages={totalPages}
						onPageChange={setPage}
					/>
				</div>
			)}
		</div>
	);
}
