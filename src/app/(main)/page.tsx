"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AddonCard } from "@/components/addons/AddonCard";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { Button } from "@/components/ui/button";
import { useAddons } from "@/hooks/useAddons";
import { useTemplates } from "@/hooks/useTemplates";
import { getDateTimestamp } from "@/lib/date";
import {
	ArrowRightIcon,
	BookOpenIcon,
	BoxesIcon,
	CheckIcon,
	CommandIcon,
	CopyIcon,
	LoaderIcon,
	ServerCogIcon,
	TerminalSquareIcon,
	ZapIcon,
} from "lucide-react";

const installCommand = `npm install -g anesis-cli`;

function TemplateSkeleton() {
	return (
		<div className="flex h-full flex-col gap-4 rounded-xl border border-primary/15 bg-card/80 px-6 py-5 animate-pulse">
			<div className="flex items-start justify-between gap-3">
				<div className="h-4 w-2/3 rounded bg-muted" />
				<div className="h-5 w-16 rounded-full bg-muted" />
			</div>
			<div className="space-y-2">
				<div className="h-3 w-full rounded bg-muted" />
				<div className="h-3 w-4/5 rounded bg-muted" />
			</div>
			<div className="flex flex-wrap gap-1.5">
				<div className="h-5 w-16 rounded bg-muted" />
				<div className="h-5 w-14 rounded bg-muted" />
				<div className="h-5 w-20 rounded bg-muted" />
			</div>
			<div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
				<div className="h-3 w-24 rounded bg-muted" />
				<div className="h-7 w-16 rounded bg-muted" />
			</div>
		</div>
	);
}

function AddonSkeleton() {
	return (
		<div className="flex h-full animate-pulse flex-col gap-4 rounded-xl border border-primary/15 bg-card/80 px-6 py-5">
			<div className="flex items-start justify-between gap-3">
				<div className="space-y-2">
					<div className="h-4 w-32 rounded bg-muted" />
					<div className="h-3 w-52 rounded bg-muted" />
				</div>
				<div className="h-5 w-20 rounded-full bg-muted" />
			</div>
			<div className="flex gap-2">
				<div className="h-5 w-24 rounded bg-muted" />
				<div className="h-5 w-14 rounded bg-muted" />
			</div>
			<div className="h-3 w-28 rounded bg-muted" />
			<div className="h-3 w-36 rounded bg-muted" />
			<div className="mt-auto flex items-center gap-2 border-t border-white/10 pt-4">
				<div className="h-8 w-8 rounded bg-muted" />
				<div className="h-8 flex-1 rounded bg-muted" />
			</div>
		</div>
	);
}

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
		title: "Rust CLI core",
		description:
			"Keep local scaffolding fast while the web app handles discovery, documentation, and publishing.",
		icon: ServerCogIcon,
	},
];

export default function Home() {
	const { templates, isLoading: templatesLoading } = useTemplates({
		pageSize: 100,
	});
	const { addons, isLoading: addonsLoading } = useAddons({ pageSize: 100 });
	const [installCopied, setInstallCopied] = useState(false);

	async function handleCopyInstallCommand() {
		if (!navigator.clipboard?.writeText) {
			return;
		}

		try {
			await navigator.clipboard.writeText(installCommand);
			setInstallCopied(true);
			window.setTimeout(() => setInstallCopied(false), 1600);
		} catch {}
	}

	const featuredTemplates = useMemo(() => {
		return [...templates]
			.sort((a, b) => {
				if (a.official !== b.official) {
					return Number(b.official) - Number(a.official);
				}
				return getDateTimestamp(b.created_at) - getDateTimestamp(a.created_at);
			})
			.slice(0, 4);
	}, [templates]);

	const featuredAddons = useMemo(() => {
		return [...addons]
			.sort((a, b) => {
				if (a.official !== b.official) {
					return Number(b.official) - Number(a.official);
				}
				return getDateTimestamp(b.created_at) - getDateTimestamp(a.created_at);
			})
			.slice(0, 4);
	}, [addons]);

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
						</div>

						<div className="mx-auto mt-6 w-full max-w-md">
							<div className="flex items-center overflow-hidden rounded-lg border border-primary/25 bg-black/42 text-left shadow-[0_0_34px_rgba(20,75,52,0.26)] ring-1 ring-white/5 backdrop-blur-xl">
								<button
									type="button"
									onClick={handleCopyInstallCommand}
									aria-label={`Copy npm install command: ${installCommand}`}
									className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45"
								>
									<span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
										<TerminalSquareIcon className="size-3.5" />
									</span>
									<code className="block min-w-0 max-w-full overflow-x-auto whitespace-nowrap font-mono text-xs font-semibold text-foreground sm:text-sm">
										{installCommand}
									</code>
								</button>
								<div className="border-l border-primary/15 p-1.5">
									<Button
										type="button"
										variant={installCopied ? "secondary" : "ghost"}
										size="icon"
										className="size-8 hover:bg-primary/10"
										onClick={handleCopyInstallCommand}
										aria-label={
											installCopied
												? "Install command copied"
												: "Copy install command"
										}
									>
										{installCopied ? (
											<CheckIcon className="size-4" />
										) : (
											<CopyIcon className="size-4" />
										)}
									</Button>
								</div>
							</div>
						</div>
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

				<div className="grid gap-4 lg:grid-cols-3">
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
							repeated commands for setup, maintenance, or delivery.
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
						</div>
					</div>
				</div>
			</section>

			<section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-18 sm:px-6 lg:gap-12 lg:px-8 lg:py-24">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className="space-y-2">
						<p className="text-sm font-medium text-primary">Recent addons</p>
						<h2 className="text-3xl font-bold tracking-normal">
							Latest automations from the registry
						</h2>
						<p className="max-w-2xl text-sm leading-6 text-muted-foreground">
							These packages extend Anesis with reusable commands, so the
							homepage shows live registry activity instead of only starter
							templates.
						</p>
					</div>
					<Button
						variant="outline"
						className="w-full border-primary/25 bg-black/20 hover:bg-primary/10 sm:w-auto"
						asChild
					>
						<Link href="/addons">
							View all addons
							<ArrowRightIcon className="size-4" />
						</Link>
					</Button>
				</div>

				{addonsLoading ? (
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						{Array.from({ length: 4 }).map((_, index) => (
							<AddonSkeleton key={index} />
						))}
					</div>
				) : featuredAddons.length > 0 ? (
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						{featuredAddons.map((addon) => (
							<AddonCard key={addon.id} addon={addon} />
						))}
					</div>
				) : (
					<div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-primary/25 bg-card/40 text-center">
						<LoaderIcon className="size-6 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">No addons yet</p>
							<p className="mt-1 text-xs text-muted-foreground">
								Once addons are published, they will show up here.
							</p>
						</div>
					</div>
				)}
			</section>

			<section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 pb-18 sm:px-6 lg:gap-12 lg:px-8 lg:pb-24">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className="space-y-2">
						<p className="text-sm font-medium text-primary">
							Featured templates
						</p>
						<h2 className="text-3xl font-bold tracking-normal">
							Recent starters from the registry
						</h2>
					</div>
					<Button
						variant="outline"
						className="w-full border-primary/25 bg-black/20 hover:bg-primary/10 sm:w-auto"
						asChild
					>
						<Link href="/templates">
							View all
							<ArrowRightIcon className="size-4" />
						</Link>
					</Button>
				</div>

				{templatesLoading ? (
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						{Array.from({ length: 4 }).map((_, index) => (
							<TemplateSkeleton key={index} />
						))}
					</div>
				) : featuredTemplates.length > 0 ? (
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						{featuredTemplates.map((template) => (
							<TemplateCard key={template.id} template={template} />
						))}
					</div>
				) : (
					<div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-primary/25 bg-card/40 text-center">
						<LoaderIcon className="size-6 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">No templates yet</p>
							<p className="mt-1 text-xs text-muted-foreground">
								Once templates are published, they will show up here.
							</p>
						</div>
					</div>
				)}
			</section>
		</div>
	);
}
