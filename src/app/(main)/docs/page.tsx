import Link from "next/link";
import {
	ArrowRightIcon,
	BookOpenIcon,
	KeyRoundIcon,
	LayoutTemplateIcon,
	PackagePlusIcon,
	PencilRulerIcon,
	ShieldCheckIcon,
	UploadIcon,
} from "lucide-react";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const quickStart = `oxide login
oxide new my-app react-vite-ts
cd my-app
oxide addon install nest-drizzle
oxide nest-drizzle install`;

const pillars = [
	{
		title: "Installation",
		description:
			"Shell installers, npm wrapper, cargo install, manual release artifacts, PATH setup, and endpoint overrides.",
		icon: BookOpenIcon,
		href: "/docs/installation",
	},
	{
		title: "Authentication",
		description:
			"Browser login, local auth file semantics, account lookup, logout behavior, and which commands need a token.",
		icon: ShieldCheckIcon,
		href: "/docs/authentication",
	},
	{
		title: "Using Templates",
		description:
			"Install, create new projects, list, remove, and update templates from the registry.",
		icon: LayoutTemplateIcon,
		href: "/docs/templates",
	},
	{
		title: "Creating Templates",
		description:
			"Build your own template with `oxide.template.json`, Tera rendering, and the project scaffolding contract.",
		icon: PencilRulerIcon,
		href: "/docs/templates/creating",
	},
	{
		title: "Using Addons",
		description:
			"Install addons, run commands inside a project, and understand how the lock file tracks your work.",
		icon: PackagePlusIcon,
		href: "/docs/addons",
	},
	{
		title: "Creating Addons",
		description:
			"Author `oxide.addon.json` manifests with variant detection, inputs, and declarative file operation steps.",
		icon: PencilRulerIcon,
		href: "/docs/addons/creating",
	},
	{
		title: "Publishing Templates",
		description: "Publish and update templates in the registry with a GitHub URL.",
		icon: UploadIcon,
		href: "/docs/templates/publishing",
	},
	{
		title: "Publishing Addons",
		description: "Publish and update addons in the registry with a GitHub URL.",
		icon: UploadIcon,
		href: "/docs/addons/publishing",
	},
];

export default function DocsOverviewPage() {
	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 lg:px-8">
			<section className="relative overflow-hidden rounded-[2rem] border bg-card px-6 py-8 shadow-sm sm:px-8">
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(181,111,43,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(112,73,35,0.12),transparent_30%)]" />
				<div className="relative space-y-5">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<BookOpenIcon className="size-4" />
						Oxide Documentation
					</div>
					<div className="max-w-4xl space-y-3">
						<h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
							Everything you need to scaffold, extend, and publish with Oxide
						</h1>
						<p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
							Oxide is a CLI tool for creating new projects from templates and
							extending existing ones with addons. This documentation covers
							installation, day-to-day usage, and how to build and publish your own
							templates and addons.
						</p>
					</div>
					<div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
						<span className="rounded-full border bg-background/80 px-3 py-1">
							Project scaffolding
						</span>
						<span className="rounded-full border bg-background/80 px-3 py-1">
							Declarative addons
						</span>
						<span className="rounded-full border bg-background/80 px-3 py-1">
							Template + addon cache in ~/.oxide
						</span>
						<span className="rounded-full border bg-background/80 px-3 py-1">
							Addon runs tracked in oxide.lock
						</span>
					</div>
					<div className="flex flex-wrap gap-3">
						<Button asChild>
							<Link href="/docs/installation">
								Get started
								<ArrowRightIcon className="size-4" />
							</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/docs/authentication">
								<KeyRoundIcon className="size-4" />
								Authentication
							</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/templates">Browse templates</Link>
						</Button>
					</div>
				</div>
			</section>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>First-run flow</CardTitle>
						<CardDescription>
							Log in, scaffold a project from a template, then apply an addon.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<CodeBlock code={quickStart} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>How Oxide works</CardTitle>
						<CardDescription>
							Two primitives — templates and addons — cover the full project lifecycle.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4 text-sm text-muted-foreground">
						<div className="flex gap-3">
							<span className="mt-0.5 size-5 shrink-0 rounded-full bg-primary/10 text-center text-xs leading-5 text-primary font-medium">1</span>
							<p>
								<span className="font-medium text-foreground">Templates</span> are
								project starters. Run{" "}
								<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
									oxide new my-app react-vite-ts
								</code>{" "}
								and Oxide downloads the template, renders any{" "}
								<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
									.tera
								</code>{" "}
								files with your project name, and writes the output to disk.
							</p>
						</div>
						<div className="flex gap-3">
							<span className="mt-0.5 size-5 shrink-0 rounded-full bg-primary/10 text-center text-xs leading-5 text-primary font-medium">2</span>
							<p>
								<span className="font-medium text-foreground">Addons</span> extend an
								existing project. Run{" "}
								<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
									oxide nest-drizzle install
								</code>{" "}
								and Oxide reads the addon manifest, detects your project variant,
								prompts for inputs, and applies declarative file operations.
							</p>
						</div>
						<div className="flex gap-3">
							<span className="mt-0.5 size-5 shrink-0 rounded-full bg-primary/10 text-center text-xs leading-5 text-primary font-medium">3</span>
							<p>
								Both are cached locally under{" "}
								<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
									~/.oxide
								</code>
								. Oxide only re-downloads when the backend reports a new commit SHA,
								and addon runs are recorded in{" "}
								<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
									oxide.lock
								</code>
								.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<section className="space-y-4">
				<div className="space-y-2">
					<p className="text-sm font-medium text-primary">Documentation map</p>
					<h2 className="text-2xl font-bold tracking-tight">
						Every page is focused on one job
					</h2>
				</div>
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					{pillars.map((item) => (
						<Card key={item.href} className="gap-4">
							<CardHeader className="gap-3">
								<div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
									<item.icon className="size-5" />
								</div>
								<div className="space-y-1">
									<CardTitle className="text-base">{item.title}</CardTitle>
									<CardDescription>{item.description}</CardDescription>
								</div>
							</CardHeader>
							<CardContent>
								<Button variant="outline" asChild>
									<Link href={item.href}>
										Open page
										<ArrowRightIcon className="size-4" />
									</Link>
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			<DocsPagination currentHref="/docs" />
		</div>
	);
}
