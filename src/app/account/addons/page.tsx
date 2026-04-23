"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PaginationControls } from "@/components/PaginationControls";
import { OwnedAddonCard } from "@/components/addons/OwnedAddonCard";
import { PublishAddonDialog } from "@/components/addons/PublishAddonDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@/components/ui/input-group";
import { useAuth } from "@/hooks/useAuth";
import { useMyAddons } from "@/hooks/useMyAddons";
import { getDateTimestamp } from "@/lib/date";
import {
	AlertCircleIcon,
	BoxesIcon,
	SearchIcon,
	ShieldCheckIcon,
	SparklesIcon,
} from "lucide-react";

const PAGE_SIZE = 6;

function MetricTile({
	label,
	value,
	icon: Icon,
}: {
	label: string;
	value: string | number;
	icon: React.ElementType;
}) {
	return (
		<div className="rounded-lg border bg-background/85 px-4 py-3 shadow-sm">
			<div className="flex items-center justify-between gap-3">
				<p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
					{label}
				</p>
				<Icon className="size-4 text-muted-foreground" />
			</div>
			<p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
				{value}
			</p>
		</div>
	);
}

export default function AccountAddonsPage() {
	const { user, login } = useAuth();
	const { addons, isLoading, isError } = useMyAddons(!!user);
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const officialAddons = addons.filter((addon) => addon.official).length;
	const communityAddons = addons.length - officialAddons;

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
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-5 lg:px-8">
			<section className="overflow-hidden rounded-xl border bg-card shadow-sm">
				<div className="bg-[linear-gradient(135deg,rgba(245,158,11,0.12),transparent_38%),linear-gradient(315deg,rgba(16,185,129,0.08),transparent_44%)] px-5 py-6 sm:px-6 sm:py-7">
					<div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
						<div className="max-w-3xl space-y-3">
							<div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
								<span className="rounded-md border bg-background/90 px-2.5 py-1">
									Addon workspace
								</span>
							</div>
							<div className="space-y-2">
								<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
									Your addons
								</h1>
								<p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
									Manage addon entries published under @{user.login}, keep
									registry metadata in sync with GitHub, and retire old packages
									from one place.
								</p>
							</div>
						</div>

						<div className="grid gap-3 sm:grid-cols-3 xl:w-[28rem]">
							<MetricTile
								label="Entries"
								value={isLoading ? "..." : addons.length}
								icon={BoxesIcon}
							/>
							<MetricTile
								label="Official"
								value={isLoading ? "..." : officialAddons}
								icon={ShieldCheckIcon}
							/>
							<MetricTile
								label="Community"
								value={isLoading ? "..." : communityAddons}
								icon={SparklesIcon}
							/>
						</div>
					</div>
				</div>
			</section>

			<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
				<div className="space-y-3">
					<InputGroup className="h-11 bg-background">
						<InputGroupAddon>
							<InputGroupText>
								<SearchIcon className="size-4" />
								Search
							</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							value={search}
							onChange={(event) => {
								setSearch(event.target.value);
								setPage(1);
							}}
							placeholder="Filter by addon id, name, description, or author"
							aria-label="Search your addons"
						/>
					</InputGroup>
					<p className="text-xs text-muted-foreground">
						{isLoading ? "Loading addons..." : `${myAddons.length} addon(s) in your workspace`}
					</p>
				</div>

				<PublishAddonDialog className="h-11 w-full justify-center gap-1.5 sm:w-auto" />
			</div>

			{isError && (
				<Alert variant="destructive">
					<AlertCircleIcon />
					<AlertTitle>Addons are unavailable</AlertTitle>
					<AlertDescription>
						Try again in a moment. The registry did not return your published
						addons.
					</AlertDescription>
				</Alert>
			)}

			{!isLoading && !isError && myAddons.length === 0 && (
				<div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/10 py-16 text-center">
					<BoxesIcon className="size-8 text-muted-foreground" />
					<div className="space-y-1">
						<p className="font-medium">
							{addons.length === 0 ? "No addons yet" : "No addons match this filter"}
						</p>
						<p className="text-sm text-muted-foreground">
							{addons.length === 0
								? "Publish your first addon from a GitHub directory that contains `oxide.addon.json`."
								: "Try another search phrase or clear the current filter to see the rest of your addons."}
						</p>
					</div>
					{addons.length > 0 ? (
						<Button type="button" variant="outline" onClick={() => setSearch("")}>
							Clear search
						</Button>
					) : null}
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
