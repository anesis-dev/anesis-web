"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PaginationControls } from "@/components/PaginationControls";
import { OwnedStackCard } from "@/components/stacks/OwnedStackCard";
import { PublishStackDialog } from "@/components/stacks/PublishStackDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@/components/ui/input-group";
import { useAuth } from "@/hooks/useAuth";
import { useMyStacks } from "@/hooks/useMyStacks";
import { AlertCircleIcon, LayersIcon, SearchIcon } from "lucide-react";

const PAGE_SIZE = 6;

export default function AccountStacksPage() {
	const { user, login } = useAuth();
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const { stacks, isLoading, isError, pagination } = useMyStacks({
		enabled: !!user,
		pageSize: 100,
	});

	const filtered = useMemo(() => {
		const query = search.trim().toLowerCase();
		if (!query) return stacks;
		return stacks.filter((stack) =>
			[stack.stack_id, stack.name, stack.description, stack.config?.template]
				.filter(Boolean)
				.some((field) => field.toLowerCase().includes(query)),
		);
	}, [stacks, search]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	if (!user) {
		return (
			<div className="mx-auto flex min-h-[50vh] w-full max-w-5xl items-center justify-center px-4 py-10 sm:px-5">
				<div className="flex w-full max-w-xl flex-col gap-3 rounded-2xl border bg-card p-5 sm:p-6">
					<h1 className="text-2xl font-semibold tracking-tight">Your stacks</h1>
					<p className="text-sm text-muted-foreground">
						Sign in with GitHub to manage stacks published from your account.
					</p>
					<div className="flex flex-wrap gap-3">
						<Button onClick={login}>Login with GitHub</Button>
						<Link href="/">
							<Button variant="outline">Go back to home</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-5 lg:px-8">
			<section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<h1 className="text-2xl font-semibold tracking-tight">Your stacks</h1>
				<span className="font-mono text-sm text-muted-foreground">
					{isLoading ? "..." : `${pagination?.total ?? stacks.length} total`}
				</span>
			</section>

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<InputGroup className="h-11 max-w-md bg-background">
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
						placeholder="Filter by name, id, description or template"
						aria-label="Search your stacks"
					/>
				</InputGroup>

				<PublishStackDialog className="h-11 w-full justify-center gap-1.5 sm:w-auto" />
			</div>

			{isError && (
				<Alert variant="destructive">
					<AlertCircleIcon />
					<AlertTitle>Stacks are unavailable</AlertTitle>
					<AlertDescription>
						Try again in a moment. The registry did not return your published stacks.
					</AlertDescription>
				</Alert>
			)}

			{!isLoading && !isError && filtered.length === 0 && (
				<div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/10 py-16 text-center">
					<LayersIcon className="size-8 text-muted-foreground" />
					<div className="space-y-1">
						<p className="font-medium">
							{stacks.length === 0 ? "No stacks yet" : "No stacks match this filter"}
						</p>
						<p className="text-sm text-muted-foreground">
							{stacks.length === 0
								? "Publish a stack above, or run `anesis stack publish <github-url>` from a repo containing `anesis.stack.json`."
								: "Try another search phrase or clear the filter."}
						</p>
					</div>
				</div>
			)}

			{!isLoading && !isError && filtered.length > 0 && (
				<>
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{visible.map((stack) => (
							<OwnedStackCard key={stack.id} stack={stack} />
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
