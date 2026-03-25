import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { BoxesIcon, BookOpenIcon, TerminalSquareIcon } from "lucide-react";

export default function AddonsPage() {
	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-12">
			<div className="space-y-2">
				<h1 className="text-4xl font-semibold tracking-tight">Addons</h1>
				<p className="max-w-2xl text-sm text-muted-foreground">
					The addon ecosystem is planned, but the public registry is not available
					in the web app yet. This route now explains the product state instead of
					showing a blank screen.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BoxesIcon className="size-4" />
							Registry status
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							No public addon catalog is exposed yet.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TerminalSquareIcon className="size-4" />
							CLI focus
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							Today Oxide is centered on project scaffolding and template-driven
							setup.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BookOpenIcon className="size-4" />
							Learn more
						</CardTitle>
					</CardHeader>
					<CardContent className="flex gap-3">
						<Link href="/docs">
							<Button variant="outline">Docs</Button>
						</Link>
						<Link href="/templates">
							<Button variant="outline">Templates</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
