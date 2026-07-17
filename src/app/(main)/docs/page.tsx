import Link from "next/link";
import {
	ArrowRightIcon,
	BookOpenIcon,
	BotIcon,
	DatabaseIcon,
	KeyRoundIcon,
	LayersIcon,
	LayoutTemplateIcon,
	PackagePlusIcon,
	PencilRulerIcon,
	ShieldCheckIcon,
	TerminalIcon,
	UploadIcon,
} from "lucide-react";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { DocsHero } from "@/components/docs/DocsHero";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsSection, Markup } from "@/components/docs/prose";
import { Button } from "@/components/ui/button";

const quickStart = `anesis login
anesis new my-app react-vite-ts
cd my-app
anesis addon install nest-drizzle
anesis use nest-drizzle install

# Or scaffold a template + a pinned set of addons in one shot
anesis new my-app --stack nest-drizzle-stack`;

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
			"Build your own template with `anesis.template.json`, Tera rendering, and the project scaffolding contract.",
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
			"Author `anesis.addon.json` manifests with variant detection, inputs, and declarative file operation steps.",
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
	{
		title: "Using Stacks",
		description:
			"Scaffold a template plus an ordered, pre-configured set of addons in a single `anesis new --stack` call.",
		icon: LayersIcon,
		href: "/docs/stacks",
	},
	{
		title: "CLI Commands",
		description:
			"Complete command reference: aliases, usage signatures, flags, and runnable examples for every command.",
		icon: TerminalIcon,
		href: "/docs/reference/commands",
	},
	{
		title: "Local State & Schema",
		description:
			"Where Anesis stores files under `~/.anesis`, cache/lock file fields, and validation rules.",
		icon: DatabaseIcon,
		href: "/docs/reference",
	},
	{
		title: "AI Agents & MCP",
		description:
			"Non-interactive flags, token auth, and the `anesis mcp` server for AI agents and CI.",
		icon: BotIcon,
		href: "/docs/ai-agents",
	},
];

export default function DocsOverviewPage() {
	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-5 py-10 lg:px-8">
			<DocsHero
				eyebrow="Anesis Documentation"
				eyebrowIcon={BookOpenIcon}
				title="Everything you need to scaffold, extend, and publish with Anesis"
				description="Anesis is a CLI tool for creating new projects from templates and extending existing ones with addons. This documentation covers installation, day-to-day usage, and how to build and publish your own templates and addons."
				chips={[
					"Project scaffolding",
					"Declarative addons",
					"Stacks: template + addons in one command",
					"Template + addon + stack cache in ~/.anesis",
					"Addon runs tracked in anesis.lock",
				]}
				actions={
					<>
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
					</>
				}
			/>

			<div className="flex flex-col gap-10">
				<DocsSection
					id="first-run"
					title="First-run flow"
					lead="Log in, scaffold a project from a template, then apply an addon."
				>
					<CodeBlock code={quickStart} />
				</DocsSection>

				<DocsSection
					id="how-it-works"
					title="How Anesis works"
					lead="Three primitives — templates, addons, and stacks — cover the full project lifecycle."
				>
					<p>
						<span className="font-medium text-foreground">Templates</span> are
						project starters. Run{" "}
						<code>anesis new my-app react-vite-ts</code> and Anesis downloads the
						template, prompts for any inputs the template declares, renders every{" "}
						<code>.tera</code> file through those inputs plus the project name, and
						writes the output to disk.
					</p>
					<p>
						<span className="font-medium text-foreground">Addons</span> extend an
						existing project. Run <code>anesis use nest-drizzle install</code> and
						Anesis reads the addon manifest, detects your project variant, prompts
						for inputs, and applies declarative file operations — tracked so they
						can be undone with <code>anesis undo</code>.
					</p>
					<p>
						<span className="font-medium text-foreground">Stacks</span> tie the two
						together. Run <code>anesis new my-app --stack &lt;id&gt;</code> and
						Anesis scaffolds the stack&apos;s template, then applies its ordered
						list of addons with their inputs pre-filled — one command instead of a
						template followed by several <code>anesis use</code> calls.
					</p>
					<p>
						All three are cached locally under <code>~/.anesis</code>. Anesis only
						re-downloads when the backend reports a new commit SHA, and addon runs
						are recorded in <code>anesis.lock</code>.
					</p>
				</DocsSection>

				<DocsSection
					id="map"
					title="Documentation map"
					lead="Every page is focused on one job. Jump straight to what you need."
				>
					<ul className="divide-y rounded-xl border">
						{pillars.map((item) => (
							<li key={item.href}>
								<Link
									href={item.href}
									className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-accent/50"
								>
									<item.icon className="mt-0.5 size-4 shrink-0 text-primary" />
									<span className="min-w-0">
										<span className="font-medium text-foreground">
											{item.title}
										</span>
										<span className="block text-sm text-muted-foreground">
											<Markup>{item.description}</Markup>
										</span>
									</span>
									<ArrowRightIcon className="mt-1 ml-auto size-4 shrink-0 text-muted-foreground" />
								</Link>
							</li>
						))}
					</ul>
				</DocsSection>
			</div>

			<DocsPagination currentHref="/docs" />
		</div>
	);
}
