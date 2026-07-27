import type { Metadata } from "next";
import Link from "next/link";
import {
	ArrowRightIcon,
	BookOpenIcon,
	BoxesIcon,
	CommandIcon,
	LayersIcon,
	ServerCogIcon,
	ZapIcon,
} from "lucide-react";
import { FeaturedRegistry } from "@/components/home/FeaturedRegistry";
import { InstallCommand } from "@/components/home/InstallCommand";
import { Button } from "@/components/ui/button";

const features = [
	{
		title: "Template starters",
		description:
			"Pull polished project starters from a shared registry and keep setup consistent across teams.",
		icon: CommandIcon,
	},
	{
		title: "Workflow addons",
		description:
			"Attach reusable commands for QA, migrations, release routines, and internal delivery flows.",
		icon: BoxesIcon,
	},
	{
		title: "Composable stacks",
		description:
			"Bundle a template with pinned addons into a stack, then scaffold the whole setup in one command.",
		icon: LayersIcon,
	},
	{
		title: "Rust CLI core",
		description:
			"Keep local scaffolding fast while the web app handles discovery, documentation, and publishing.",
		icon: ServerCogIcon,
	},
];

export const metadata: Metadata = {
	description:
		"Anesis is a template-first CLI and web registry for scaffolding projects, publishing starters, and extending them with reusable, versioned addons.",
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<div className="w-full">
			<section className="relative isolate overflow-hidden border-b border-white/10">
				<div className="anesis-page-texture absolute inset-0 -z-10" />
				<div className="mx-auto flex min-h-[calc(100dvh-4.0625rem)] w-full max-w-7xl items-center justify-center px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
					<div className="mx-auto max-w-3xl text-center">
						<div className="space-y-5">
							<h1 className="text-4xl font-black tracking-normal text-foreground sm:text-5xl lg:text-7xl">
								Anesis CLI Registry
							</h1>
							<p className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
								Launch projects from shared templates, install team workflow
								addons, and keep repeatable setup fast with a Rust-powered local
								CLI.
							</p>
						</div>

						<div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
							<Button
								size="lg"
								className="w-full shadow-[0_0_28px_rgba(45,106,79,0.38)] sm:w-auto"
								asChild
							>
								<Link href="/docs/installation">
									<BookOpenIcon className="size-4" />
									Get started
								</Link>
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="w-full border-primary/25 bg-black/20 text-foreground hover:bg-primary/10 sm:w-auto"
								asChild
							>
								<Link href="/templates">
									Browse templates
									<ArrowRightIcon className="size-4" />
								</Link>
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="w-full border-primary/25 bg-black/20 text-foreground hover:bg-primary/10 sm:w-auto"
								asChild
							>
								<Link href="/addons">
									Browse addons
									<ArrowRightIcon className="size-4" />
								</Link>
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="w-full border-primary/25 bg-black/20 text-foreground hover:bg-primary/10 sm:w-auto"
								asChild
							>
								<Link href="/stacks">
									Browse stacks
									<ArrowRightIcon className="size-4" />
								</Link>
							</Button>
						</div>

						<InstallCommand />
					</div>
				</div>
			</section>

			<section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-18 sm:px-6 lg:gap-12 lg:px-8 lg:py-24">
				<div className="max-w-2xl space-y-3">
					<p className="inline-flex items-center gap-2 text-sm font-medium text-primary">
						<ZapIcon className="size-4" />
						Core ideas
					</p>
					<h2 className="text-3xl font-bold tracking-normal sm:text-4xl">
						Templates start the project. Addons teach the CLI what to do next.
					</h2>
				</div>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{features.map((feature) => (
						<div
							key={feature.title}
							className="group rounded-2xl border border-primary/15 bg-card/76 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)] transition-colors hover:border-primary/45"
						>
							<div className="mb-5 flex size-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
								<feature.icon className="size-5" />
							</div>
							<h3 className="text-lg font-semibold">{feature.title}</h3>
							<p className="mt-2 text-sm leading-6 text-muted-foreground">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</section>

			<section className="border-y border-white/10 bg-black/18">
				<div className="mx-auto grid w-full max-w-6xl gap-5 px-5 py-18 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
					<div className="rounded-2xl border border-primary/15 bg-card/70 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
						<p className="text-sm font-medium text-primary">Documentation</p>
						<h2 className="mt-2 text-2xl font-bold tracking-normal">
							Install the CLI, wire templates, and publish clean manifests
						</h2>
						<p className="mt-3 text-sm leading-6 text-muted-foreground">
							The docs cover installation, CLI usage, and the registry contracts
							for `anesis.template.json` and `anesis.addon.json`.
						</p>
						<div className="mt-5 flex flex-wrap gap-3">
							<Button
								variant="outline"
								className="border-primary/25 bg-black/20 hover:bg-primary/10"
								asChild
							>
								<Link href="/docs/installation">Installation</Link>
							</Button>
							<Button
								variant="outline"
								className="border-primary/25 bg-black/20 hover:bg-primary/10"
								asChild
							>
								<Link href="/docs/cli">CLI</Link>
							</Button>
							<Button
								variant="outline"
								className="border-primary/25 bg-black/20 hover:bg-primary/10"
								asChild
							>
								<Link href="/docs/templates">Templates</Link>
							</Button>
							<Button
								variant="outline"
								className="border-primary/25 bg-black/20 hover:bg-primary/10"
								asChild
							>
								<Link href="/docs/addons">Addons</Link>
							</Button>
						</div>
					</div>

					<div className="rounded-2xl border border-primary/15 bg-card/70 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
						<p className="text-sm font-medium text-primary">Publishing</p>
						<h2 className="mt-2 text-2xl font-bold tracking-normal">
							Ship starters and workflow packages from the same registry model
						</h2>
						<p className="mt-3 text-sm leading-6 text-muted-foreground">
							Templates can target any stack, and addons can encapsulate
							repeated commands for setup, maintenance, or delivery. Combine
							both into a reusable stack with the visual builder.
						</p>
						<div className="mt-5 flex flex-wrap gap-3">
							<Button
								variant="outline"
								className="border-primary/25 bg-black/20 hover:bg-primary/10"
								asChild
							>
								<Link href="/templates">
									View templates
									<ArrowRightIcon className="size-4" />
								</Link>
							</Button>
							<Button
								variant="outline"
								className="border-primary/25 bg-black/20 hover:bg-primary/10"
								asChild
							>
								<Link href="/addons">
									View addons
									<ArrowRightIcon className="size-4" />
								</Link>
							</Button>
							<Button
								variant="outline"
								className="border-primary/25 bg-black/20 hover:bg-primary/10"
								asChild
							>
								<Link href="/stacks">
									View stacks
									<ArrowRightIcon className="size-4" />
								</Link>
							</Button>
							<Button
								variant="outline"
								className="border-primary/25 bg-black/20 hover:bg-primary/10"
								asChild
							>
								<Link href="/builder">
									Build a stack
									<ArrowRightIcon className="size-4" />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			<FeaturedRegistry />
		</div>
	);
}
