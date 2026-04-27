"use client";

import Link from "next/link";
import { useAddons } from "@/hooks/useAddons";
import { useUsers } from "@/hooks/useUsers";
import { useTemplates } from "@/hooks/useTemplates";
import { formatDate, getDateTimestamp } from "@/lib/date";
import {
	BoxesIcon,
	PackageIcon,
	ShieldCheckIcon,
	UsersIcon,
	TrendingUpIcon,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function StatCard({
	title,
	value,
	description,
	icon: Icon,
	loading,
}: {
	title: string;
	value: string | number;
	description?: string;
	icon: React.ElementType;
	loading?: boolean;
}) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>
				<Icon className="size-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				{loading ? (
					<div className="h-8 w-16 animate-pulse rounded bg-muted" />
				) : (
					<p className="text-3xl font-bold">{value}</p>
				)}
				{description && (
					<p className="mt-1 text-xs text-muted-foreground">{description}</p>
				)}
			</CardContent>
		</Card>
	);
}

function RecentTemplateSkeleton() {
	return (
		<tr className="border-b animate-pulse">
			<td className="py-3 px-4">
				<div className="h-4 w-32 rounded bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-4 w-20 rounded bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-4 w-24 rounded bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-5 w-14 rounded-full bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-4 w-24 rounded bg-muted" />
			</td>
		</tr>
	);
}

function RecentUserSkeleton() {
	return (
		<tr className="border-b animate-pulse">
			<td className="py-3 px-4">
				<div className="flex items-center gap-3">
					<div className="h-8 w-8 rounded-full bg-muted" />
					<div className="h-4 w-24 rounded bg-muted" />
				</div>
			</td>
			<td className="py-3 px-4">
				<div className="h-5 w-16 rounded-full bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-4 w-24 rounded bg-muted" />
			</td>
		</tr>
	);
}

function UserRoleBadge({ role }: { role: "admin" | "user" }) {
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

export default function AdminDashboard() {
	const { templates, isLoading, pagination: templatePagination } = useTemplates({
		pageSize: 100,
	});
	const { addons, isLoading: addonsLoading, pagination: addonPagination } = useAddons({
		pageSize: 100,
	});
	const { users, isLoading: usersLoading, isError: usersError } = useUsers();

	const totalTemplates = templatePagination?.total ?? templates.length;
	const officialTemplates = templates.filter((t) => t.official).length;
	const communityTemplates = totalTemplates - officialTemplates;

	const recentTemplates = [...templates]
		.sort((a, b) => getDateTimestamp(b.created_at) - getDateTimestamp(a.created_at))
		.slice(0, 8);
	const recentUsers = [...users]
		.sort((a, b) => getDateTimestamp(b.created_at) - getDateTimestamp(a.created_at))
		.slice(0, 8);

	return (
		<div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Overview of your Oxide platform.
				</p>
			</div>

			{/* Stats */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
				<StatCard
					title="Total Templates"
					value={totalTemplates}
					description="Published on the platform"
					icon={PackageIcon}
					loading={isLoading}
				/>
				<StatCard
					title="Official Templates"
					value={officialTemplates}
					description="Verified by Oxide team"
					icon={ShieldCheckIcon}
					loading={isLoading}
				/>
				<StatCard
					title="Community Templates"
					value={communityTemplates}
					description="Published by users"
					icon={TrendingUpIcon}
					loading={isLoading}
				/>
				<StatCard
					title="Published Addons"
					value={addonPagination?.total ?? addons.length}
					description="Registered in the addon registry"
					icon={BoxesIcon}
					loading={addonsLoading}
				/>
				<StatCard
					title="Total Users"
					value={usersError ? "—" : users.length}
					description={
						usersError ? "Users endpoint unavailable" : "Registered accounts"
					}
					icon={UsersIcon}
					loading={usersLoading}
				/>
			</div>

			<div className="grid gap-6 2xl:grid-cols-[minmax(0,1.6fr)_minmax(360px,1fr)]">
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Recent Templates</CardTitle>
						<CardDescription>
							The latest templates published on the platform.
						</CardDescription>
					</CardHeader>
					<CardContent className="p-0">
						<div className="overflow-x-auto">
							<table className="min-w-[680px] w-full text-sm">
								<thead>
									<tr className="border-b bg-muted/40 text-left text-xs font-medium text-muted-foreground">
										<th className="py-3 px-4">Name</th>
										<th className="py-3 px-4">Author</th>
										<th className="py-3 px-4">Specialization</th>
										<th className="py-3 px-4">Status</th>
										<th className="py-3 px-4">Published</th>
									</tr>
								</thead>
								<tbody>
									{isLoading
										? Array.from({ length: 5 }).map((_, i) => (
												<RecentTemplateSkeleton key={i} />
											))
										: recentTemplates.map((t) => (
												<tr
													key={t.id}
													className="border-b transition-colors last:border-0 hover:bg-muted/30"
												>
													<td className="py-3 px-4 font-medium">
														{t.config.metadata.displayName}
													</td>
													<td className="py-3 px-4 font-mono text-xs text-muted-foreground">
														@{t.config.author.github}
													</td>
													<td className="py-3 px-4 text-muted-foreground">
														{t.config.specialization || "—"}
													</td>
													<td className="py-3 px-4">
														{t.official ? (
															<span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
																<ShieldCheckIcon className="size-3" />
																Official
															</span>
														) : (
															<span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
																Community
															</span>
														)}
													</td>
													<td className="py-3 px-4 text-xs text-muted-foreground">
														{formatDate(t.created_at)}
													</td>
												</tr>
											))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-base">Recent Users</CardTitle>
						<CardDescription>
							The latest registered accounts on the platform.
						</CardDescription>
					</CardHeader>
					<CardContent className="p-0">
						<div className="overflow-x-auto">
							<table className="min-w-[420px] w-full text-sm">
								<thead>
									<tr className="border-b bg-muted/40 text-left text-xs font-medium text-muted-foreground">
										<th className="py-3 px-4">User</th>
										<th className="py-3 px-4">Role</th>
										<th className="py-3 px-4">Joined</th>
									</tr>
								</thead>
								<tbody>
									{usersLoading ? (
										Array.from({ length: 5 }).map((_, i) => (
											<RecentUserSkeleton key={i} />
										))
									) : usersError ? (
										<tr>
											<td
												colSpan={3}
												className="py-8 px-4 text-sm text-muted-foreground"
											>
												Unable to fetch the user list right now.
											</td>
										</tr>
									) : recentUsers.length === 0 ? (
										<tr>
											<td
												colSpan={3}
												className="py-8 px-4 text-sm text-muted-foreground"
											>
												No registered users yet.
											</td>
										</tr>
									) : (
										recentUsers.map((user) => (
											<tr
												key={user.id}
												className="border-b transition-colors last:border-0 hover:bg-muted/30"
											>
												<td className="py-3 px-4">
													<div className="flex items-center gap-3">
														<Avatar size="sm">
															<AvatarImage
																src={user.avatar_url}
																alt={user.login}
															/>
															<AvatarFallback>
																{user.login.slice(0, 2).toUpperCase()}
															</AvatarFallback>
														</Avatar>
														<Link
															href={`/user/${user.login}`}
															className="font-mono text-xs transition-colors hover:text-primary"
														>
															@{user.login}
														</Link>
													</div>
												</td>
												<td className="py-3 px-4">
													<UserRoleBadge role={user.role} />
												</td>
												<td className="py-3 px-4 text-xs text-muted-foreground">
													{formatDate(user.created_at)}
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
