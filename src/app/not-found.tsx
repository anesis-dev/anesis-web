import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestionIcon } from "lucide-react";

export const metadata: Metadata = {
	title: "Page not found",
	description: "The page you were looking for does not exist.",
	robots: { index: false, follow: true },
};

export default function NotFound() {
	return (
		<main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-5 py-24 text-center">
			<FileQuestionIcon className="size-12 text-primary" aria-hidden="true" />
			<div className="space-y-2">
				<p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
					404
				</p>
				<h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
				<p className="text-sm text-muted-foreground">
					The page you were looking for doesn&apos;t exist or has moved.
				</p>
			</div>
			<div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row">
				<Link href="/" className="w-full sm:w-auto">
					<Button className="w-full sm:w-auto">Go to home</Button>
				</Link>
				<Link href="/templates" className="w-full sm:w-auto">
					<Button variant="outline" className="w-full sm:w-auto">
						Browse templates
					</Button>
				</Link>
				<Link href="/docs" className="w-full sm:w-auto">
					<Button variant="outline" className="w-full sm:w-auto">
						Read the docs
					</Button>
				</Link>
			</div>
		</main>
	);
}
