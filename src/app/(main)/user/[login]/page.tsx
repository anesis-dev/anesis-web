"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGitHubUser } from "@/hooks/useGitHubUser";
import { useTemplates } from "@/hooks/useTemplates";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { ITemplate } from "@/types/template";
import { UsersIcon, BookOpenIcon, PackageIcon, UserIcon } from "lucide-react";

function Stat({ label, value }: { label: string; value: number }) {
	return (
		<div className="flex flex-col items-center gap-0.5">
			<span className="text-lg font-bold">{value.toLocaleString()}</span>
			<span className="text-xs text-muted-foreground">{label}</span>
		</div>
	);
}

function AvatarSkeleton() {
	return (
		<div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start animate-pulse">
			<div className="size-24 shrink-0 rounded-full bg-muted" />
			<div className="flex flex-col items-center gap-3 sm:items-start">
				<div className="h-6 w-40 rounded bg-muted" />
				<div className="h-4 w-24 rounded bg-muted" />
				<div className="h-4 w-64 rounded bg-muted" />
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

export default function UserProfilePage({
	params,
}: {
	params: Promise<{ login: string }>;
}) {
	const { login } = use(params);
	const {
		githubUser,
		isLoading: userLoading,
		isError: userError,
	} = useGitHubUser(login);
	const { templates, isLoading: templatesLoading } = useTemplates();

	const userTemplates: ITemplate[] = templates.filter(
		(t) => t.config.author.github.toLowerCase() === login.toLowerCase(),
	);

	if (userError) {
		return (
			<div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-5">
				<UserIcon className="size-12 text-muted-foreground" />
				<div>
					<p className="font-semibold text-lg">User not found</p>
					<p className="text-sm text-muted-foreground mt-1">
						No GitHub user with the login{" "}
						<span className="font-mono text-foreground">@{login}</span> exists.
					</p>
				</div>
				<Link
					href="/templates"
					className="text-sm text-muted-foreground underline-offset-4 hover:underline"
				>
					← Back to templates
				</Link>
			</div>
		);
	}

	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 sm:px-5">
			{/* Profile header */}
			{userLoading ? (
				<AvatarSkeleton />
			) : githubUser ? (
				<div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
					{/* Avatar */}
					<div className="relative size-24 shrink-0 overflow-hidden rounded-full border">
						<Image
							src={githubUser.avatar_url}
							alt={githubUser.login}
							fill
							sizes="96px"
							className="object-cover grayscale"
						/>
					</div>

					{/* Info */}
					<div className="flex flex-1 flex-col items-center gap-3 sm:items-start">
						<div className="flex flex-col items-center gap-0.5 sm:items-start">
							{githubUser.name && (
								<h1 className="text-2xl font-bold tracking-tight">
									{githubUser.name}
								</h1>
							)}
							<p className="font-mono text-sm text-muted-foreground">
								@{githubUser.login}
							</p>
						</div>

						{githubUser.bio && (
							<p className="max-w-md text-center text-sm text-muted-foreground sm:text-left">
								{githubUser.bio}
							</p>
						)}

						{/* Stats */}
						<div className="grid w-full max-w-sm grid-cols-3 gap-4 sm:w-auto sm:max-w-none sm:flex sm:items-center sm:gap-6">
							<Stat label="Followers" value={githubUser.followers} />
							<Stat label="Following" value={githubUser.following} />
							<Stat label="Repos" value={githubUser.public_repos} />
						</div>

						{/* GitHub link */}
						<Link
							href={githubUser.html_url}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition-colors hover:bg-accent sm:w-auto"
						>
							<GitHubIcon className="size-3.5" />
							View on GitHub
						</Link>
					</div>
				</div>
			) : null}

			{/* Divider */}
			<div className="h-px w-full bg-border" />

			{/* Templates section */}
			<div className="flex flex-col gap-5">
				<div className="flex items-center gap-2">
					<PackageIcon className="size-4 text-muted-foreground" />
					<h2 className="font-semibold">
						Templates
						{!templatesLoading && (
							<span className="ml-2 font-mono text-sm font-normal text-muted-foreground">
								{userTemplates.length}
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

				{!templatesLoading && userTemplates.length === 0 && (
					<div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-14 text-center">
						<BookOpenIcon className="size-7 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">No templates yet</p>
							<p className="mt-1 text-xs text-muted-foreground">
								This user hasn&apos;t published any templates.
							</p>
						</div>
					</div>
				)}

				{!templatesLoading && userTemplates.length > 0 && (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{userTemplates.map((template) => (
							<TemplateCard key={template.id} template={template} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
