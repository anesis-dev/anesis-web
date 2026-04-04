"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useGitHubUser } from "@/hooks/useGitHubUser";
import { useMyTemplates } from "@/hooks/useMyTemplates";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { Button } from "@/components/ui/button";
import {
	BookOpenIcon,
	LogOutIcon,
	PackageIcon,
	ShieldIcon,
	UsersIcon,
} from "lucide-react";

function Stat({ label, value }: { label: string; value: number }) {
	return (
		<div className="flex flex-col items-center gap-0.5">
			<span className="text-lg font-bold">{value.toLocaleString()}</span>
			<span className="text-xs text-muted-foreground">{label}</span>
		</div>
	);
}

function ProfileSkeleton() {
	return (
		<div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start animate-pulse">
			<div className="size-24 shrink-0 rounded-full bg-muted" />
			<div className="flex flex-col items-center gap-3 sm:items-start w-full">
				<div className="h-6 w-40 rounded bg-muted" />
				<div className="h-4 w-24 rounded bg-muted" />
				<div className="h-4 w-64 rounded bg-muted" />
				<div className="h-8 w-32 rounded-md bg-muted" />
			</div>
		</div>
	);
}

function TemplateSkeleton() {
	return (
		<div className="flex flex-col gap-4 rounded-xl border bg-card py-5 px-6 animate-pulse">
			<div className="h-4 w-2/3 rounded bg-muted" />
			<div className="space-y-2">
				<div className="h-3 w-full rounded bg-muted" />
				<div className="h-3 w-4/5 rounded bg-muted" />
			</div>
			<div className="flex gap-1.5">
				{[80, 60, 72].map((w) => (
					<div
						key={w}
						className="h-5 rounded-md bg-muted"
						style={{ width: w }}
					/>
				))}
			</div>
			<div className="flex items-center justify-between border-t pt-4">
				<div className="h-3 w-24 rounded bg-muted" />
				<div className="h-3 w-10 rounded bg-muted" />
			</div>
		</div>
	);
}

function NotLoggedIn({ onLogin }: { onLogin: () => void }) {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
			<UsersIcon className="size-12 text-muted-foreground" />
			<div>
				<p className="font-semibold text-lg">You are not logged in</p>
				<p className="text-sm text-muted-foreground mt-1">
					Sign in with GitHub to view your account.
				</p>
			</div>
			<div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
				<Button onClick={onLogin} className="w-full sm:w-auto">
					<GitHubIcon className="size-4" />
					Sign in with GitHub
				</Button>
				<Link href="/" className="w-full sm:w-auto">
					<Button variant="outline" className="w-full sm:w-auto">← Go to home</Button>
				</Link>
			</div>
		</div>
	);
}

export default function AccountPage() {
	const { user, isLoading: authLoading, login, logout } = useAuth();
	const { githubUser, isLoading: githubLoading } = useGitHubUser(
		user?.login ?? "",
	);
	const { templates: myTemplates, isLoading: templatesLoading } = useMyTemplates(
		!!user,
	);

	if (authLoading) {
		return (
			<div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 sm:px-5">
				<ProfileSkeleton />
				<div className="h-px w-full bg-border" />
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<TemplateSkeleton key={i} />
					))}
				</div>
			</div>
		);
	}

	if (!user) {
		return <NotLoggedIn onLogin={login} />;
	}

	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 sm:px-5">
			{/* Profile header */}
			{githubLoading ? (
				<ProfileSkeleton />
			) : (
				<div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
					{/* Avatar */}
					<div className="relative size-24 shrink-0 overflow-hidden rounded-full border">
						<Image
							src={user.avatar_url}
							alt={user.login}
							fill
							sizes="96px"
							className="object-cover grayscale"
						/>
					</div>

					{/* Info */}
					<div className="flex flex-1 flex-col items-center gap-3 sm:items-start">
						<div className="flex flex-col items-center gap-0.5 sm:items-start">
							{githubUser?.name && (
								<h1 className="text-2xl font-bold tracking-tight">
									{githubUser.name}
								</h1>
							)}
							<p className="font-mono text-sm text-muted-foreground">
								@{user.login}
							</p>
						</div>

						{githubUser?.bio && (
							<p className="max-w-md text-center text-sm text-muted-foreground sm:text-left">
								{githubUser.bio}
							</p>
						)}

						{/* Stats */}
						{githubUser && (
							<div className="grid w-full max-w-sm grid-cols-3 gap-4 sm:w-auto sm:max-w-none sm:flex sm:items-center sm:gap-6">
								<Stat label="Followers" value={githubUser.followers} />
								<Stat label="Following" value={githubUser.following} />
								<Stat label="Repos" value={githubUser.public_repos} />
							</div>
						)}

						{/* Actions */}
						<div className="flex w-full flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-start">
							{user.role === "admin" && (
								<Link href="/admin" className="w-full sm:w-auto">
									<Button variant="default" size="sm" className="w-full gap-1.5 sm:w-auto">
										<ShieldIcon className="size-3.5" />
										Admin Panel
									</Button>
								</Link>
							)}

							<Link
								href={`https://github.com/${user.login}`}
								target="_blank"
								rel="noopener noreferrer"
								className="w-full sm:w-auto"
							>
								<Button variant="outline" size="sm" className="w-full gap-1.5 sm:w-auto">
									<GitHubIcon className="size-3.5" />
									View on GitHub
								</Button>
							</Link>

							<Button
								variant="ghost"
								size="sm"
								onClick={logout}
								className="w-full gap-1.5 text-muted-foreground hover:text-destructive sm:w-auto"
							>
								<LogOutIcon className="size-3.5" />
								Log out
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Divider */}
			<div className="h-px w-full bg-border" />

			{/* My templates */}
			<div className="flex flex-col gap-5">
				<div className="flex items-center gap-2">
					<PackageIcon className="size-4 text-muted-foreground" />
					<h2 className="font-semibold">
						My Templates
						{!templatesLoading && (
							<span className="ml-2 font-mono text-sm font-normal text-muted-foreground">
								{myTemplates.length}
							</span>
						)}
					</h2>
				</div>

				{templatesLoading && (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 3 }).map((_, i) => (
							<TemplateSkeleton key={i} />
						))}
					</div>
				)}

				{!templatesLoading && myTemplates.length === 0 && (
					<div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-14 text-center">
						<BookOpenIcon className="size-7 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">No templates yet</p>
							<p className="mt-1 text-xs text-muted-foreground">
								You haven&apos;t published any templates.
							</p>
						</div>
					</div>
				)}

				{!templatesLoading && myTemplates.length > 0 && (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{myTemplates.map((template) => (
							<TemplateCard key={template.id} template={template} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
