"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PaginationControls } from "@/components/PaginationControls";
import { OwnedAddonCard } from "@/components/addons/OwnedAddonCard";
import { PublishAddonDialog } from "@/components/addons/PublishAddonDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useMyAddons } from "@/hooks/useMyAddons";
import { getDateTimestamp } from "@/lib/date";
import { AlertCircleIcon, BookOpenIcon, BoxesIcon } from "lucide-react";

const PAGE_SIZE = 6;

export default function AccountAddonsPage() {
	const { user, login } = useAuth();
	const { addons, isLoading, isError } = useMyAddons(user?.id, !!user);
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);

	const myAddons = useMemo(() => {
		const query = search.trim().toLowerCase();
		const sorted = [...addons].sort(
			(left, right) =>
				getDateTimestamp(right.created_at) - getDateTimestamp(left.created_at),
		);

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

	const totalPages = Math.max(1, Math.ceil(myAddons.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const paginatedAddons = myAddons.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);

	if (!user) {
		return (
			<div className="mx-auto flex min-h-[50vh] w-full max-w-5xl items-center justify-center px-4 py-10 sm:px-5">
				<div className="flex w-full max-w-xl flex-col gap-3 rounded-2xl border bg-card p-5 sm:p-6">
					<h1 className="text-2xl font-semibold tracking-tight">Your addons</h1>
					<p className="text-sm text-muted-foreground">
						Sign in with GitHub to view and manage addons published from your
						account.
					</p>
					<div className="flex flex-wrap gap-3">
						<Button onClick={login}>Login with GitHub</Button>
						<Link href="/addons">
							<Button variant="outline">Browse addon registry</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-5 lg:px-8">
			<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
				<div className="space-y-1">
					<h1 className="text-3xl font-semibold tracking-tight">Your addons</h1>
					<p className="max-w-3xl text-sm text-muted-foreground">
						Addon registry publishing and ownership controls are live in the web
						app now. The current public CLI release still focuses on templates,
						so this page is the main place to publish and curate your addon
						entries.
					</p>
				</div>
				<PublishAddonDialog className="w-full gap-1.5 sm:w-auto" />
			</div>

			<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<Input
					value={search}
					onChange={(event) => {
						setSearch(event.target.value);
						setPage(1);
					}}
					placeholder="Search your addons"
					className="w-full sm:max-w-sm"
				/>
				<div className="flex flex-wrap gap-2">
					<Button variant="outline" asChild>
						<Link href="/addons">
							<BoxesIcon className="size-4" />
							Public registry
						</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link href="/docs/addons">
							<BookOpenIcon className="size-4" />
							Addon docs
						</Link>
					</Button>
				</div>
			</div>

			<p className="text-xs text-muted-foreground">
				{isLoading ? "Loading addons..." : `${myAddons.length} addon(s)`}
			</p>

			{isError && (
				<div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
					<AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
					<p>Addons could not be loaded right now. Try again in a moment.</p>
				</div>
			)}

			{!isLoading && !isError && myAddons.length === 0 && (
				<div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-16 text-center">
					<BoxesIcon className="size-8 text-muted-foreground" />
					<div className="space-y-1">
						<p className="font-medium">No addons yet</p>
						<p className="text-sm text-muted-foreground">
							Publish your first addon from a GitHub directory that contains
							`oxide.addon.json`.
						</p>
					</div>
				</div>
			)}

			{!isLoading && !isError && paginatedAddons.length > 0 && (
				<>
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{paginatedAddons.map((addon) => (
							<OwnedAddonCard key={addon.id} addon={addon} />
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
