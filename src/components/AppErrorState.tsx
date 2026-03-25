"use client";

import Link from "next/link";
import { AlertTriangleIcon, RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppErrorState({
	title,
	description,
	reset,
}: {
	title: string;
	description: string;
	reset: () => void;
}) {
	return (
		<div className="mx-auto flex min-h-[50vh] w-full max-w-3xl flex-col items-center justify-center gap-5 px-5 py-16 text-center">
			<AlertTriangleIcon className="size-10 text-muted-foreground" />
			<div className="space-y-2">
				<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
			<div className="flex flex-wrap items-center justify-center gap-3">
				<Button onClick={reset} className="gap-2">
					<RotateCcwIcon className="size-4" />
					Try again
				</Button>
				<Link href="/">
					<Button variant="outline">Back to home</Button>
				</Link>
			</div>
		</div>
	);
}
