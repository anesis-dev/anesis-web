import Link from "next/link";
import {
	ArrowRightIcon,
	BookOpenIcon,
	DownloadIcon,
	KeyRoundIcon,
	LayoutTemplateIcon,
	PackagePlusIcon,
	WandSparklesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { docsNav } from "@/constants/docsNav";
import { DocsPagination } from "@/components/docs/DocsPagination";

const capabilities = [
	{
		title: "Install the CLI",
		description:
			"Set up Oxide from release binaries on macOS, Linux, or Windows.",
		icon: DownloadIcon,
	},
	{
		title: "Scaffold projects",
		description:
			"Generate starters through the interactive flow or from known template names.",
		icon: WandSparklesIcon,
	},
	{
		title: "Authenticate with GitHub",
		description:
			"Connect your account when you need authenticated flows like publishing your own template.",
		icon: KeyRoundIcon,
	},
	{
		title: "Manage templates",
		description:
			"Install, cache, inspect, delete, and reuse templates locally.",
		icon: LayoutTemplateIcon,
	},
	{
		title: "Publish templates",
		description:
			"Register GitHub-hosted template folders that contain oxide.template.json.",
		icon: PackagePlusIcon,
	},
];

export default function DocsOverviewPage() {
	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-10 lg:px-8">
			<section className="rounded-3xl border bg-gradient-to-br from-card via-card to-muted/40 p-8">
				<div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
					<BookOpenIcon className="size-4" />
					Oxide Documentation
				</div>
				<div className="max-w-3xl space-y-4">
					<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
						Install Oxide, scaffold projects, and author templates and addons
					</h1>
					<p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
						Oxide is a CLI for generating project starters, working with
						reusable templates, and extending generated projects through
						declarative addon manifests. Day-to-day scaffolding should feel
						lightweight, while authenticated flows stay out of the way until you
						actually need them.
					</p>
				</div>
				<div className="mt-6 flex flex-wrap gap-3">
					<Button asChild>
						<Link href="/docs/installation">
							Start with installation
							<ArrowRightIcon className="size-4" />
						</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link href="/docs/addons">Read addon docs</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link href="/templates">Browse templates</Link>
					</Button>
				</div>
			</section>

			<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{capabilities.map((item) => (
					<Card key={item.title} className="gap-4">
						<CardHeader className="gap-3">
							<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
								<item.icon className="size-5" />
							</div>
							<div className="space-y-1">
								<CardTitle className="text-base">{item.title}</CardTitle>
								<CardDescription>{item.description}</CardDescription>
							</div>
						</CardHeader>
					</Card>
				))}
			</section>

			<section className="grid gap-4 md:grid-cols-2">
				{docsNav
					.filter((item) => item.href !== "/docs")
					.map((item) => (
						<Card key={item.href}>
							<CardHeader>
								<CardTitle>{item.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<Button variant="outline" asChild>
									<Link href={item.href}>
										Open {item.title}
										<ArrowRightIcon className="size-4" />
									</Link>
								</Button>
							</CardContent>
						</Card>
					))}
			</section>

			<DocsPagination currentHref="/docs" />
		</div>
	);
}
