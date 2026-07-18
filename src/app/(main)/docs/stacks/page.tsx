import Link from "next/link";
import { ArrowRightIcon, LayersIcon, UploadIcon, WandSparklesIcon } from "lucide-react";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { DocsHero } from "@/components/docs/DocsHero";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsSection, DocsSubheading, DocsList, Markup } from "@/components/docs/prose";
import { Button } from "@/components/ui/button";

const manifestExample = `{
  "schema_version": "1",
  "id": "nest-drizzle-stack",
  "name": "NestJS + Drizzle",
  "description": "NestJS starter with Drizzle ORM already wired up.",
  "template": "nestjs",
  "addons": [
    { "id": "dotenv", "command": "install" },
    {
      "id": "nest-drizzle",
      "command": "install",
      "inputs": { "driver": "postgres", "use_ssl": "false" }
    }
  ]
}`;

const scaffoldExample = `# Scaffold a project directly from a stack (auto-installs if uncached)
anesis new my-app --stack nest-drizzle-stack

# Or install first, then scaffold
anesis stack install nest-drizzle-stack
anesis new my-app --stack nest-drizzle-stack`;

const manifestFields = [
	{
		field: "template",
		desc: "The template name to scaffold first — the same value you'd pass to `anesis new <name> <template>`.",
	},
	{
		field: "addons[].id",
		desc: "Addon id to apply, in order, after the template is scaffolded.",
	},
	{
		field: "addons[].command",
		desc: 'Command to run on that addon. Defaults to "install" if omitted.',
	},
	{
		field: "addons[].inputs",
		desc: "Preset input values for this addon, so the user isn't re-prompted for anything the stack already decided. Missing inputs are still prompted unless --yes is passed.",
	},
];

const runOrder = [
	"The template is scaffolded first, exactly as `anesis new` would do it (including its own `inputs`/`exclude` handling).",
	"Each addon in `addons` then runs in the order listed, via the same `anesis use <id> <command>` pipeline — variant detection, input prompts, and step execution all apply.",
	"Any preset in `addons[].inputs` is used as a default; you're only prompted for values the stack didn't pin (unless `--yes` is set, which accepts every default).",
	"If an addon fails, the stack aborts with an error naming which addon failed. Steps already applied by that addon are rolled back the same way a standalone `anesis use` failure would be; earlier addons in the stack are not undone automatically.",
];

const cacheFacts = [
	"Stacks are cached at `~/.anesis/cache/stacks/<id>.json` — a single manifest file per stack, unlike templates/addons which cache whole directories.",
	"`anesis stack install <id>` pre-downloads and caches a stack manifest. Optional — `anesis new --stack <id>` auto-installs it when missing.",
	"`anesis stack list` and `anesis stack remove` operate on the local cache only, no login required.",
	"`anesis stack info <id>` prints the template and ordered addon list; it prefers the freshest registry copy but falls back to the local cache if the registry is unreachable.",
];

export default function DocsStacksPage() {
	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-5 py-10 lg:px-8">
			<DocsHero
				eyebrow="Stacks"
				eyebrowIcon={LayersIcon}
				title="Scaffold a template and its addons in one shot"
				description={
					<>
						A stack is a template plus an ordered list of addons, declared in an{" "}
						<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
							anesis.stack.json
						</code>{" "}
						manifest. Run <code>anesis new my-app --stack &lt;id&gt;</code> and
						Anesis scaffolds the template, then applies every addon in order —
						the same pipeline as running each step by hand, wired together.
					</>
				}
				chips={[
					"anesis new <dir> --stack <id>",
					"Ordered addon application",
					"Preset addon inputs",
				]}
				actions={
					<>
						<Button asChild>
							<Link href="/stacks">
								Browse stacks
								<ArrowRightIcon className="size-4" />
							</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/builder">
								<WandSparklesIcon className="size-4" />
								Open the builder
							</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/docs/stacks/creating">Creating stacks</Link>
						</Button>
					</>
				}
			/>

			<div className="flex flex-col gap-10">
				<DocsSection
					id="scaffold"
					title="Scaffolding from a stack"
					lead="This is the primary way to use a stack — one command instead of a template plus a series of anesis use calls."
				>
					<CodeBlock code={scaffoldExample} />
				</DocsSection>

				<DocsSection
					id="manifest"
					title="The anesis.stack.json manifest"
					lead="A stack manifest names a template and lists the addons to apply on top of it, in order."
				>
					<CodeBlock code={manifestExample} lang="json" />
					<DocsSubheading id="manifest-fields">Key fields</DocsSubheading>
					<dl className="space-y-3">
						{manifestFields.map((item) => (
							<div
								key={item.field}
								className="flex flex-col gap-1 sm:flex-row sm:gap-4"
							>
								<dt className="sm:w-40 sm:shrink-0">
									<code className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-foreground">
										{item.field}
									</code>
								</dt>
								<dd className="text-muted-foreground">
									<Markup>{item.desc}</Markup>
								</dd>
							</div>
						))}
					</dl>
				</DocsSection>

				<DocsSection
					id="run-order"
					title="What happens when a stack runs"
					lead="A stack doesn't introduce a new execution model — it drives the exact same template and addon pipelines documented elsewhere, in sequence."
				>
					<DocsList items={runOrder} ordered />
				</DocsSection>

				<DocsSection
					id="cache"
					title="Installing and inspecting stacks"
					lead="Stacks have their own local cache, separate from templates and addons."
				>
					<DocsList items={cacheFacts} />
				</DocsSection>

				<DocsSection
					id="publishing"
					title="Publishing a stack"
					lead="Stacks are published from a GitHub URL the same way templates and addons are."
				>
					<CodeBlock
						code={`anesis stack publish https://github.com/owner/repo
anesis stack update https://github.com/owner/repo`}
					/>
					<p>
						Both accept <code>--visibility</code>, <code>--credential-id</code>,
						and <code>--org-id</code> — see{" "}
						<Link
							href="/docs/reference/commands#stacks"
							className="font-medium text-primary hover:underline"
						>
							the command reference
						</Link>{" "}
						for the full flag list. A saved login (
						<Link
							href="/docs/authentication"
							className="font-medium text-primary hover:underline"
						>
							anesis login
						</Link>
						) is required.
					</p>
				</DocsSection>

				<DocsSection
					id="next-steps"
					title="Next steps"
					lead="A stack only references templates and addons that already exist in the registry."
				>
					<ul className="space-y-2 pl-5 list-disc marker:text-muted-foreground/60">
						<li className="pl-1">
							<Link
								href="/docs/templates/creating"
								className="font-medium text-primary hover:underline"
							>
								Creating Templates
							</Link>{" "}
							— build the base project the stack scaffolds first.
						</li>
						<li className="pl-1">
							<Link
								href="/docs/addons/creating"
								className="font-medium text-primary hover:underline"
							>
								Creating Addons
							</Link>{" "}
							— build the addons the stack applies on top, in order.
						</li>
						<li className="pl-1">
							<UploadIcon className="mr-1 inline size-3.5 align-[-2px]" />
							Once both exist in the registry, see{" "}
							<Link
								href="/docs/stacks/creating"
								className="font-medium text-primary hover:underline"
							>
								Creating Stacks
							</Link>{" "}
							for how to plan the composition and generate the manifest — the{" "}
							<Link
								href="/builder"
								className="font-medium text-primary hover:underline"
							>
								builder
							</Link>{" "}
							can also add extra one-off terminal commands (like{" "}
							<code>bun add tailwindcss</code>) alongside your addons before
							you write <code>anesis stack publish</code>.
						</li>
					</ul>
				</DocsSection>
			</div>

			<DocsPagination currentHref="/docs/stacks" />
		</div>
	);
}
