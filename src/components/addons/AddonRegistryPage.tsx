"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PaginationControls } from "@/components/PaginationControls";
import { AddonCard } from "@/components/addons/AddonCard";
import { PublishAddonDialog } from "@/components/addons/PublishAddonDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddons } from "@/hooks/useAddons";
import { SortMode } from "@/services/addon";
import { useAuth } from "@/hooks/useAuth";
import { getDateTimestamp } from "@/lib/date";
import { SortSelect } from "@/components/SortSelect";
import {
	AlertCircleIcon,
	BookOpenIcon,
	BoxesIcon,
	SearchIcon,
	ShieldCheckIcon,
} from "lucide-react";

const PAGE_SIZE = 24;

function AddonSkeleton() {
	return (
		<div className="flex h-full animate-pulse flex-col gap-4 rounded-xl border bg-card px-6 py-5">
			<div className="flex items-start justify-between gap-3">
				<div className="h-4 w-2/3 rounded bg-muted" />
				<div className="h-5 w-20 rounded-full bg-muted" />
			</div>
			<div className="space-y-2">
				<div className="h-3 w-full rounded bg-muted" />
				<div className="h-3 w-4/5 rounded bg-muted" />
			</div>
			<div className="flex gap-2">
				<div className="h-5 w-24 rounded bg-muted" />
				<div className="h-5 w-14 rounded bg-muted" />
			</div>
			<div className="h-3 w-28 rounded bg-muted" />
			<div className="mt-auto h-9 w-full rounded-md bg-muted" />
		</div>
	);
}

export function AddonRegistryPage() {
	const { user, login } = useAuth();
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [officialOnly, setOfficialOnly] = useState(false);
	const [sort, setSort] = useState<SortMode>("recent");
	const { addons, isLoading, isError, pagination } = useAddons(
		{ page, pageSize: PAGE_SIZE },
		sort,
		{ search, official: officialOnly },
	);

	
	
	const visibleAddons = useMemo(() => {
		if (sort !== "recent") return addons;
		return [...addons].sort((left, right) => {
			if (left.official !== right.official) {
				return Number(right.official) - Number(left.official);
			}
			return (
				getDateTimestamp(right.created_at) - getDateTimestamp(left.created_at)
			);
		});
	}, [addons, sort]);

	const totalCount = pagination?.total ?? addons.length;
	const totalPages = Math.max(1, pagination?.totalPages ?? 1);
	const currentPage = Math.min(page, totalPages);

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-5 lg:px-8">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="flex flex-col gap-1">
					<h1 className="text-2xl font-bold tracking-tight">Addons</h1>
					<p className="text-sm text-muted-foreground">
						Browse and install workflow addons published by the community.
					</p>
				</div>

				<div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
					<Button variant="outline" asChild>
						<Link href="/docs/addons">
							<BookOpenIcon className="size-4" />
							Addon docs
						</Link>
					</Button>
					{user ? (
						<PublishAddonDialog className="w-full gap-1.5 sm:w-auto" />
					) : (
						<Button onClick={login} className="w-full gap-1.5 sm:w-auto">
							<BoxesIcon className="size-4" />
							Login to publish
						</Button>
					)}
				</div>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative flex-1 sm:max-w-md">
					<SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<Input
						value={search}
						onChange={(event) => {
							setSearch(event.target.value);
							setPage(1);
						}}
						placeholder="Search by addon id, name, description or author"
						className="pl-10"
					/>
				</div>
				<div className="flex gap-2">
					<SortSelect
						value={sort}
						onChange={(next) => {
							setSort(next);
							setPage(1);
						}}
					/>
					<Button
						type="button"
						variant={officialOnly ? "default" : "outline"}
						onClick={() => setOfficialOnly(!officialOnly)}
						className="w-full gap-1.5 sm:w-auto"
					>
						<ShieldCheckIcon className="size-4" />
						Official only
					</Button>
				</div>
			</div>

			{!isLoading && !isError && (
				<p className="text-xs text-muted-foreground">
					Showing{" "}
					<span className="font-medium text-foreground">{totalCount}</span>{" "}
					{totalCount === 1 ? "addon" : "addons"}
				</p>
			)}

			{isLoading && (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{Array.from({ length: 12 }).map((_, index) => (
						<AddonSkeleton key={index} />
					))}
				</div>
			)}

			{isError && (
				<div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 py-16 text-center">
					<AlertCircleIcon className="size-8 text-destructive" />
					<div>
						<p className="text-sm font-medium">Failed to load addons</p>
						<p className="mt-1 text-xs text-muted-foreground">
							Check your connection or try again later.
						</p>
					</div>
				</div>
			)}

			{!isLoading && !isError && addons.length === 0 && (
				<div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
					<BoxesIcon className="size-8 text-muted-foreground" />
					<div>
						<p className="text-sm font-medium">No addons found</p>
						<p className="mt-1 text-xs text-muted-foreground">
							{totalCount === 0
								? "No addons have been published yet."
								: "Try adjusting your search query."}
						</p>
					</div>
				</div>
			)}

			{!isLoading && !isError && addons.length > 0 && (
				<>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{visibleAddons.map((addon) => (
							<AddonCard key={addon.id} addon={addon} />
						))}
					</div>
				</>
			)}
			{!isLoading && !isError && (
				<PaginationControls
					page={currentPage}
					totalPages={totalPages}
					onPageChange={setPage}
				/>
			)}
		</div>
	);
}
