import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	BookOpenIcon,
	BoxesIcon,
	ShieldCheckIcon,
	TerminalSquareIcon,
} from "lucide-react";

export default function AddonsPage() {
	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-12">
			<div className="space-y-2">
				<h1 className="text-4xl font-semibold tracking-tight">Addons</h1>
				<p className="max-w-2xl text-sm text-muted-foreground">
					Oxide addons extend generated projects through declarative JSON
					manifests. The web registry UI is still limited, but the addon
					architecture and authoring model are already documented.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BoxesIcon className="size-4" />
							Manifest-driven
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							Addons are defined in `oxide.addon.json` and execute bounded file
							operations instead of arbitrary user code.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<ShieldCheckIcon className="size-4" />
							Safe by design
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							Official templates provide markers, and addon commands resolve
							into predictable edits tracked through `oxide.lock`.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TerminalSquareIcon className="size-4" />
							Authoring docs
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-3">
						<Button variant="outline" asChild>
							<Link href="/docs/addons">
								<BookOpenIcon className="size-4" />
								Addon docs
							</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/templates">Templates</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
