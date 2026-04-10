"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PaginationControls } from "@/components/PaginationControls";
import { AddonCard } from "@/components/addons/AddonCard";
import { PublishAddonDialog } from "@/components/addons/PublishAddonDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddons } from "@/hooks/useAddons";
import { useAuth } from "@/hooks/useAuth";
import { getDateTimestamp } from "@/lib/date";
import {
	AlertCircleIcon,
	BookOpenIcon,
	BoxesIcon,
	FilesIcon,
	UsersIcon,
} from "lucide-react";

const PAGE_SIZE = 9;

function StatCard({
	label,
	value,
	description,
}: {
	label: string;
	value: string | number;
	description: string;
}) {
	return (
		<div className="rounded-2xl border bg-card p-5">
			<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
				{label}
			</p>
			<p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
			<p className="mt-2 text-sm text-muted-foreground">{description}</p>
		</div>
	);
}

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
	const { addons, isLoading, isError } = useAddons();
	const { user, login } = useAuth();
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);

	const filtered = useMemo(() => {
		const query = search.trim().toLowerCase();
		const sorted = [...addons].sort((left, right) => {
			if (left.official !== right.official) {
				return Number(right.official) - Number(left.official);
			}

			return (
				getDateTimestamp(right.created_at) - getDateTimestamp(left.created_at)
			);
		});

		if (!query) {
			return sorted;
		}

		return sorted.filter((addon) =>
			[
				addon.addon_id,
				addon.name,
				addon.config.description,
				addon.config.author,
			]
				.join(" ")
				.toLowerCase()
				.includes(query),
		);
	}, [addons, search]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const paginatedAddons = filtered.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);
	const authorCount = new Set(addons.map((addon) => addon.config.author)).size;
	const officialCount = addons.filter((addon) => addon.official).length;

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-5 lg:px-8">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<div className="max-w-3xl space-y-2">
					<h1 className="text-4xl font-semibold tracking-tight">Addon Registry</h1>
					<p className="text-sm leading-6 text-muted-foreground sm:text-base">
						Browse registry entries synced through <code>oxide-server</code>. The
						CLI and backend now cover publish, update, archive lookup, and delete
						flows; this screen stays focused on discovery and publishing.
					</p>
				</div>

				<div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
					<Button variant="outline" asChild>
						<Link href="/addons">
							<FilesIcon className="size-4" />
							Official catalog
						</Link>
					</Button>
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

			<div className="grid gap-4 md:grid-cols-3">
				<StatCard
					label="Published"
					value={isLoading ? "..." : addons.length}
					description="Registry entries fetched from the live addon endpoint."
				/>
				<StatCard
					label="Authors"
					value={isLoading ? "..." : authorCount}
					description="Distinct addon authors represented in the registry."
				/>
				<StatCard
					label="Official"
					value={isLoading ? "..." : officialCount}
					description="Entries currently marked as official on the backend."
				/>
			</div>

			<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<Input
					value={search}
					onChange={(event) => {
						setSearch(event.target.value);
						setPage(1);
					}}
					placeholder="Search by addon id, name, description or author"
					className="w-full sm:max-w-md"
				/>
				<Button variant="outline" asChild>
					<Link href="/account/addons">
						<UsersIcon className="size-4" />
						My addons
					</Link>
				</Button>
			</div>

			{!isLoading && !isError && (
				<p className="text-xs text-muted-foreground">
					{filtered.length === addons.length ? (
						<>
							Showing{" "}
							<span className="font-medium text-foreground">{addons.length}</span>{" "}
							{addons.length === 1 ? "addon" : "addons"}
						</>
					) : (
						<>
							Showing{" "}
							<span className="font-medium text-foreground">
								{filtered.length}
							</span>{" "}
							of{" "}
							<span className="font-medium text-foreground">{addons.length}</span>{" "}
							addons
						</>
					)}
				</p>
			)}

			{isLoading && (
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
					{Array.from({ length: 6 }).map((_, index) => (
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

			{!isLoading && !isError && filtered.length === 0 && (
				<div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
					<BoxesIcon className="size-8 text-muted-foreground" />
					<div>
						<p className="text-sm font-medium">No addons found</p>
						<p className="mt-1 text-xs text-muted-foreground">
							{addons.length === 0
								? "No addons have been published yet."
								: "Try adjusting your search query."}
						</p>
					</div>
				</div>
			)}

			{!isLoading && !isError && filtered.length > 0 && (
				<>
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{paginatedAddons.map((addon) => (
							<AddonCard key={addon.id} addon={addon} />
						))}
					</div>
					<PaginationControls
						page={currentPage}
						totalPages={totalPages}
						onPageChange={setPage}
					/>
				</>
			)}
		</div>
	);
}
