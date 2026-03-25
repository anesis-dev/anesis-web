"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PaginationControls } from "@/components/PaginationControls";
import {
	AlertCircleIcon,
	ExternalLinkIcon,
	ShieldCheckIcon,
	UsersIcon,
} from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { useUsers } from "@/hooks/useUsers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

function SkeletonRow() {
	return (
		<tr className="border-b animate-pulse">
			<td className="py-3 px-4">
				<div className="h-8 w-8 rounded-full bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-4 w-28 rounded bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-4 w-20 rounded bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-5 w-16 rounded-full bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-4 w-24 rounded bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="flex gap-2">
					<div className="h-7 w-7 rounded bg-muted" />
					<div className="h-7 w-7 rounded bg-muted" />
				</div>
			</td>
		</tr>
	);
}

function RoleBadge({ role }: { role: "admin" | "user" }) {
	return role === "admin" ? (
		<span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
			<ShieldCheckIcon className="size-3" />
			Admin
		</span>
	) : (
		<span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
			User
		</span>
	);
}

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
	const { users, isLoading, isError } = useUsers();
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return users;

		return users.filter(
			(user) =>
				user.login.toLowerCase().includes(q) ||
				String(user.github_id).includes(q) ||
				user.role.toLowerCase().includes(q),
		);
	}, [search, users]);

	const adminCount = users.filter((user) => user.role === "admin").length;
	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const paginatedUsers = filtered.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);

	return (
		<div className="flex flex-col gap-6 p-8">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Users</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Manage all registered users on the platform.
					</p>
				</div>

				{!isLoading && !isError && (
					<span className="mt-1 font-mono text-sm text-muted-foreground">
						{filtered.length === users.length
							? `${users.length} total / ${adminCount} admins`
							: `${filtered.length} / ${users.length}`}
					</span>
				)}
			</div>

			<Input
				placeholder="Search by login, GitHub ID or role…"
				value={search}
				onChange={(event) => {
					setSearch(event.target.value);
					setPage(1);
				}}
				className="max-w-sm"
			/>

			{isError && (
				<Card className="border-dashed">
					<CardHeader>
						<div className="flex items-center gap-2">
							<AlertCircleIcon className="size-4 text-muted-foreground" />
							<CardTitle className="text-sm font-medium">
								Failed to load users
							</CardTitle>
						</div>
						<CardDescription>
							The admin users endpoint is available, but the current request did
							not complete successfully.
						</CardDescription>
					</CardHeader>
				</Card>
			)}

			<div className="rounded-xl border overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b bg-muted/40 text-left text-xs font-medium text-muted-foreground">
								<th className="py-3 px-4">Avatar</th>
								<th className="py-3 px-4">Login</th>
								<th className="py-3 px-4">GitHub ID</th>
								<th className="py-3 px-4">Role</th>
								<th className="py-3 px-4">Joined</th>
								<th className="py-3 px-4">Actions</th>
							</tr>
						</thead>
						<tbody>
							{isLoading ? (
								Array.from({ length: 8 }).map((_, index) => (
									<SkeletonRow key={index} />
								))
							) : isError ? (
								<tr>
									<td colSpan={6}>
										<div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
											<AlertCircleIcon className="size-7 text-muted-foreground" />
											<p className="text-sm text-muted-foreground">
												Unable to fetch the user list right now.
											</p>
										</div>
									</td>
								</tr>
							) : filtered.length === 0 ? (
								<tr>
									<td colSpan={6}>
										<div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
											<UsersIcon className="size-7 text-muted-foreground" />
											<p className="text-sm text-muted-foreground">
												{users.length === 0
													? "No registered users yet."
													: "No users match your search."}
											</p>
										</div>
									</td>
								</tr>
							) : (
								paginatedUsers.map((user) => (
									<tr
										key={user.id}
										className="border-b transition-colors last:border-0 hover:bg-muted/30"
									>
										<td className="py-3 px-4">
											<Avatar size="sm">
												<AvatarImage src={user.avatar_url} alt={user.login} />
												<AvatarFallback>
													{user.login.slice(0, 2).toUpperCase()}
												</AvatarFallback>
											</Avatar>
										</td>
										<td className="py-3 px-4">
											<Link
												href={`/user/${user.login}`}
												className="font-mono text-xs transition-colors hover:text-primary"
											>
												@{user.login}
											</Link>
										</td>
										<td className="py-3 px-4 font-mono text-xs text-muted-foreground">
											{user.github_id}
										</td>
										<td className="py-3 px-4">
											<RoleBadge role={user.role} />
										</td>
										<td className="py-3 px-4 text-xs text-muted-foreground">
											{user.created_at
												? new Date(user.created_at).toLocaleDateString(
														"en-US",
														{
															year: "numeric",
															month: "short",
															day: "numeric",
														},
													)
												: "—"}
										</td>
										<td className="py-3 px-4">
											<div className="flex items-center gap-1">
												<Button
													asChild
													size="icon-xs"
													variant="ghost"
													title="Open profile page"
													aria-label={`Open profile page for ${user.login}`}
												>
													<Link href={`/user/${user.login}`}>
														<ExternalLinkIcon />
													</Link>
												</Button>
												<Button
													asChild
													size="icon-xs"
													variant="ghost"
													title="Open GitHub profile"
													aria-label={`Open GitHub profile for ${user.login}`}
												>
													<Link
														href={`https://github.com/${user.login}`}
														target="_blank"
														rel="noopener noreferrer"
													>
														<GitHubIcon className="size-3.5" />
													</Link>
												</Button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
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
