"use client";

import { PaginationControls } from "@/components/PaginationControls";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useTemplates } from "@/hooks/useTemplates";
import {
	AlertCircleIcon,
	ShieldCheckIcon,
	ShieldOffIcon,
	Trash2Icon,
	ExternalLinkIcon,
	PackageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function SkeletonRow() {
	return (
		<tr className="border-b animate-pulse">
			<td className="py-3 px-4">
				<div className="h-4 w-36 rounded bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-4 w-24 rounded bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-4 w-20 rounded bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-4 w-28 rounded bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-5 w-16 rounded-full bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="h-4 w-20 rounded bg-muted" />
			</td>
			<td className="py-3 px-4">
				<div className="flex gap-2">
					<div className="h-7 w-7 rounded bg-muted" />
					<div className="h-7 w-7 rounded bg-muted" />
					<div className="h-7 w-7 rounded bg-muted" />
				</div>
			</td>
		</tr>
	);
}

function OfficialBadge({ official }: { official: boolean }) {
	return official ? (
		<span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
			<ShieldCheckIcon className="size-3" />
			Official
		</span>
	) : (
		<span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
			Community
		</span>
	);
}

const PAGE_SIZE = 10;

export default function AdminTemplatesPage() {
	const { templates, isLoading, isError } = useTemplates();
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return templates;
		return templates.filter(
			(t) =>
				t.name.toLowerCase().includes(q) ||
				t.config.metadata.displayName.toLowerCase().includes(q) ||
				t.config.author.github.toLowerCase().includes(q) ||
				t.config.specialization.toLowerCase().includes(q),
		);
	}, [templates, search]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const paginatedTemplates = filtered.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);

	return (
		<div className="flex flex-col gap-6 p-8">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Templates</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Manage all templates published on the platform.
					</p>
				</div>

				{!isLoading && (
					<span className="mt-1 font-mono text-sm text-muted-foreground">
						{filtered.length === templates.length
							? `${templates.length} total`
							: `${filtered.length} / ${templates.length}`}
					</span>
				)}
			</div>

			{/* Search */}
			<Input
				placeholder="Search by name, author or specialization…"
				value={search}
				onChange={(e) => {
					setSearch(e.target.value);
					setPage(1);
				}}
				className="max-w-sm"
			/>

			<Card className="border-dashed">
				<CardHeader>
					<CardTitle className="text-sm">Template moderation actions</CardTitle>
					<CardDescription>
						Official toggling and deletion stay disabled until the backend
						exposes mutation endpoints for admin template management.
					</CardDescription>
				</CardHeader>
			</Card>

			{isError && (
				<div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
					<AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
					<p>Templates could not be loaded right now.</p>
				</div>
			)}

			<div className="rounded-xl border overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b bg-muted/40 text-left text-xs font-medium text-muted-foreground">
								<th className="py-3 px-4">Name</th>
								<th className="py-3 px-4">Display Name</th>
								<th className="py-3 px-4">Author</th>
								<th className="py-3 px-4">Specialization</th>
								<th className="py-3 px-4">Status</th>
								<th className="py-3 px-4">Published</th>
								<th className="py-3 px-4">Actions</th>
							</tr>
						</thead>
						<tbody>
							{isLoading ? (
								Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
							) : isError ? (
								<tr>
									<td colSpan={7}>
										<div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
											<AlertCircleIcon className="size-7 text-muted-foreground" />
											<p className="text-sm text-muted-foreground">
												Unable to fetch the template list right now.
											</p>
										</div>
									</td>
								</tr>
							) : filtered.length === 0 ? (
								<tr>
									<td colSpan={7}>
										<div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
											<PackageIcon className="size-7 text-muted-foreground" />
											<p className="text-sm text-muted-foreground">
												{templates.length === 0
													? "No templates published yet."
													: "No templates match your search."}
											</p>
										</div>
									</td>
								</tr>
							) : (
								filtered.map((t) => (
									<tr
										key={t.id}
										className="border-b transition-colors last:border-0 hover:bg-muted/30"
									>
										<td className="py-3 px-4 font-mono text-xs">{t.name}</td>
										<td className="py-3 px-4 font-medium">
											{t.config.metadata.displayName}
										</td>
										<td className="py-3 px-4">
											<Link
												href={`/user/${t.config.author.github}`}
												className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
											>
												@{t.config.author.github}
											</Link>
										</td>
										<td className="py-3 px-4 text-muted-foreground">
											{t.config.specialization || "—"}
										</td>
										<td className="py-3 px-4">
											<OfficialBadge official={t.official} />
										</td>
										<td className="py-3 px-4 text-xs text-muted-foreground">
											{new Date(t.created_at).toLocaleDateString("en-US", {
												year: "numeric",
												month: "short",
												day: "numeric",
											})}
										</td>
										<td className="py-3 px-4">
											<div className="flex items-center gap-1">
												{/* View */}
												<Button
													asChild
													size="icon-xs"
													variant="ghost"
													title="View repository"
													aria-label={`Open repository for ${t.config.metadata.displayName}`}
												>
													<Link
														href={t.config.repository.url}
														target="_blank"
														rel="noopener noreferrer"
													>
														<ExternalLinkIcon />
													</Link>
												</Button>

												<Button
													size="icon-xs"
													variant="ghost"
													title="Admin API required to change official status"
													aria-label={`Official status management for ${t.config.metadata.displayName} is unavailable`}
													disabled
													className={cn(
														t.official
															? "text-primary hover:text-muted-foreground"
															: "text-muted-foreground hover:text-primary",
													)}
												>
													{t.official ? <ShieldOffIcon /> : <ShieldCheckIcon />}
												</Button>

												<Button
													size="icon-xs"
													variant="ghost"
													title="Admin API required to delete templates"
													aria-label={`Delete for ${t.config.metadata.displayName} is unavailable`}
													disabled
													className="text-muted-foreground hover:text-destructive"
												>
													<Trash2Icon />
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
