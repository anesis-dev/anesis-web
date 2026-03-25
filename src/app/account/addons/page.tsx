"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { BoxesIcon, BookOpenIcon, WrenchIcon } from "lucide-react";

export default function AccountAddonsPage() {
	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 py-10">
			<div className="space-y-1">
				<h1 className="text-3xl font-semibold tracking-tight">Account addons</h1>
				<p className="text-sm text-muted-foreground">
					Addon management is not exposed in the web app yet, but this page now
					explains the current state instead of rendering empty content.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BoxesIcon className="size-4" />
							Current status
						</CardTitle>
						<CardDescription>
							The addon registry and account-level addon installs are still in
							progress.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							When the addon APIs are ready, this page can list your installed
							addons, update status and installation history.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<WrenchIcon className="size-4" />
							What you can do now
						</CardTitle>
						<CardDescription>
							Use templates and docs while the addon workflow is being finished.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-3">
						<Link href="/templates">
							<Button variant="outline" className="gap-2">
								<BoxesIcon className="size-4" />
								Browse templates
							</Button>
						</Link>
						<Link href="/docs/reference">
							<Button variant="outline" className="gap-2">
								<BookOpenIcon className="size-4" />
								Read docs
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
