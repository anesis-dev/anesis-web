"use client";

import dynamic from "next/dynamic";
import { LoaderIcon } from "lucide-react";

const TemplateReadmeContent = dynamic(
	() =>
		import("./TemplateReadmeContent").then((m) => m.TemplateReadme),
	{
		ssr: false,
		loading: () => (
			<div className="rounded-3xl border bg-card p-6">
				<div className="mb-5 flex items-center gap-2">
					<LoaderIcon className="size-4 animate-spin text-muted-foreground" />
					<p className="text-sm text-muted-foreground">Loading README...</p>
				</div>
				<div className="space-y-3 animate-pulse">
					<div className="h-7 w-2/5 rounded bg-muted" />
					<div className="h-4 w-full rounded bg-muted" />
					<div className="h-4 w-11/12 rounded bg-muted" />
					<div className="h-4 w-10/12 rounded bg-muted" />
					<div className="h-32 w-full rounded-2xl bg-muted" />
				</div>
			</div>
		),
	},
);

export function TemplateReadme(props: {
	content: string | null;
	fileName?: string;
	sourceUrl?: string;
	sourcePath?: string;
	isLoading?: boolean;
	isError?: boolean;
	className?: string;
}) {
	return <TemplateReadmeContent {...props} />;
}
