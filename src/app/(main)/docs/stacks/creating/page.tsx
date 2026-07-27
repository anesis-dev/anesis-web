import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, LayersIcon, PencilRulerIcon, WandSparklesIcon } from "lucide-react";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { DocsHero } from "@/components/docs/DocsHero";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsSection, DocsSubheading, DocsList } from "@/components/docs/prose";
import { Button } from "@/components/ui/button";

const planningPoints = [
	"Pick exactly one template — the same name you'd pass to `anesis new <name> <template>`. It must already exist in the registry.",
	"List the addons to layer on top, in the order they should run. Each `id` must already be published — a stack never bundles addon or template source, only references to them.",
	"If an addon declares `requires`, include those addons in the list too (earlier in the order) — the CLI refuses to run a stack that skips a hard dependency.",
	"Decide which addon inputs you want to pin with `inputs`, so users aren't re-prompted for choices the stack already made, and which ones should stay open.",
];

const manifestExample = `{
  "schema_version": "1",
  "id": "nest-saas",
  "name": "NestJS SaaS Starter",
  "description": "NestJS backend with Prisma, JWT auth, Swagger docs and request validation.",
  "version": "1.0.0",
  "author": { "name": "Maksym Zhuk", "github": "anesis-dev" },
  "template": "nest-express",
  "addons": [
    { "id": "nest-prisma-v7", "command": "install" },
    { "id": "nest-auth-jwt", "command": "install" },
    { "id": "nest-swagger", "command": "install" },
    { "id": "nest-validation", "command": "install" }
  ]
}`;

const idRules = [
	"`id` is the identifier used everywhere in the CLI — `anesis new my-app --stack <id>`, `anesis stack install <id>`, etc. Keep it URL-safe: lowercase letters, numbers, and hyphens.",
	"`name` is the human-readable title shown in the registry UI — spaces and casing are fine here.",
	"`description` is a one-line summary shown on stack cards and the detail page.",
	"`version` is a semver string (`major.minor.patch`). Publishing a new version adds a new entry; the registry shows the latest and a version count. Re-publishing an existing version is rejected.",
	"`author` is an object with `name` and `github` — the GitHub handle links the stack to your profile and is shown on every stack card.",
	"`addons` must be in the exact order you want them applied — the CLI does not reorder or sort the array for you.",
];

const builderSteps = [
	"Pick a project name and a template — the builder lists every template currently in the registry.",
	"Select the addons to layer on top. If an addon requires another one you haven't selected, the builder flags it with an “Add required addons” shortcut.",
	"Configure each selected addon's install inputs — the builder reads each addon's manifest and renders the right field for every input (text, boolean, select).",
	"Optionally add extra terminal commands — anything not covered by an addon, like `bun add tailwindcss` or a one-off codegen call. These land in the copyable command list so you (and anyone following your stack by hand) don't lose track of them, but they are not written into `anesis.stack.json` since the manifest format only understands template + addon references.",
	"Copy the generated command block to sanity-check the sequence yourself, then download `anesis.stack.json` as your starting manifest.",
];

const beforePublishChecks = [
	"Run the copied commands yourself in a scratch directory — scaffold the template, apply each addon in order, and confirm nothing errors out or needs a manual fix.",
	"Double-check every `addons[].id` exists in the registry under that exact id — a typo fails at scaffold time for anyone using the stack, not at publish time.",
	"If you added extra terminal commands in the builder, fold anything essential into an actual addon (or note it in your stack's README) — the published manifest won't carry them.",
	"Push the finished `anesis.stack.json` (plus an optional README) to a GitHub repo before publishing — the registry stores a reference to that repo and commit, not the file itself.",
];

export const metadata: Metadata = {
	title: "Creating stacks",
	description:
		"Define an anesis.stack.json manifest that combines a template with the addons and commands to apply to it.",
	alternates: { canonical: "/docs/stacks/creating" },
};

export default function DocsStacksCreatingPage() {
	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-5 py-10 lg:px-8">
			<DocsHero
				eyebrow="Stacks / Creating Stacks"
				eyebrowIcon={PencilRulerIcon}
				title="Build your own stack"
				description={
					<>
						A stack doesn&apos;t contain any project files of its own — it&apos;s
						a thin manifest,{" "}
						<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
							anesis.stack.json
						</code>
						, that names one template and an ordered list of already-published
						addons. Creating one is mostly a planning exercise: get the
						composition and order right, then let the CLI drive the same
						template and addon pipelines it always uses.
					</>
				}
				chips={[
					"References existing templates + addons",
					"Ordered addon list",
					"Pinned addon inputs",
					"No new file-processing logic",
				]}
				actions={
					<>
						<Button asChild>
							<Link href="/builder">
								<WandSparklesIcon className="size-4" />
								Open the builder
								<ArrowRightIcon className="size-4" />
							</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/docs/stacks">Using stacks</Link>
						</Button>
					</>
				}
			/>

			<div className="flex flex-col gap-10">
				<DocsSection
					id="plan"
					title="1. Plan the composition"
					lead="Everything a stack references — the template and every addon — must already exist in the registry before you write the manifest. A stack cannot introduce new template or addon behavior, only sequence existing ones."
				>
					<DocsList items={planningPoints} />
				</DocsSection>

				<DocsSection
					id="builder"
					title="2. Use the builder instead of hand-writing JSON"
					lead="The stack builder walks through the same decisions as the manifest, then generates both the terminal command sequence and a downloadable anesis.stack.json."
				>
					<DocsList items={builderSteps} ordered />
					<Callout variant="tip" title="Extra terminal commands are a builder convenience">
						<p>
							The <code>anesis.stack.json</code> schema only understands a
							template plus addon references — there&apos;s no field for raw
							shell commands. The builder&apos;s{" "}
							<span className="font-medium text-foreground">
								Extra commands
							</span>{" "}
							step appends free-form lines like{" "}
							<code>bun add tailwindcss</code> to the copyable command block so
							you don&apos;t lose them while assembling a stack, but they stay
							out of the downloaded manifest and out of anything you publish.
							If a command needs to travel with the stack, wrap it in a real
							addon instead.
						</p>
					</Callout>
				</DocsSection>

				<DocsSection
					id="manifest"
					title="3. Fill in the manifest fields"
					lead="Whether you download it from the builder or write it by hand, every stack manifest has the same shape."
				>
					<CodeBlock code={manifestExample} lang="json" />
					<DocsSubheading id="manifest-fields">Field rules</DocsSubheading>
					<DocsList items={idRules} />
				</DocsSection>

				<DocsSection
					id="ordering"
					title="4. Get the addon order right"
					lead="Order matters because each addon in the list runs sequentially, the same way anesis use would run it by hand."
				>
					<p>
						If addon B declares <code>{'"requires": ["A"]'}</code>, A must
						appear earlier in the <code>addons</code> array — the CLI checks{" "}
						<code>anesis.lock</code> as it works through the list and stops
						with a clear error if a dependency is missing. The builder handles
						this for you automatically: selecting an addon that requires
						another one prompts you to add the dependency, and the generated
						command list is always ordered so requirements run first.
					</p>
				</DocsSection>

				<DocsSection
					id="before-publish"
					title="5. Validate before publishing"
					lead="Stacks don't have a local link/test command the way templates and addons do (anesis template link, anesis addon link) — validation means actually running the sequence once."
				>
					<DocsList items={beforePublishChecks} />
				</DocsSection>

				<DocsSection
					id="publish"
					title="6. Publish"
					lead="Once the manifest lives in a GitHub repo and you've confirmed the sequence works end to end, publish it the same way as any other registry entry."
				>
					<CodeBlock
						code={`anesis stack publish https://github.com/owner/repo
anesis stack republish https://github.com/owner/repo`}
					/>
					<p>
						See{" "}
						<Link
							href="/docs/stacks#publishing"
							className="font-medium text-primary hover:underline"
						>
							Publishing a stack
						</Link>{" "}
						for the full flag list and what happens on the backend, and{" "}
						<Link
							href="/docs/reference/commands#stacks"
							className="font-medium text-primary hover:underline"
						>
							the command reference
						</Link>{" "}
						for every stack subcommand.
					</p>
				</DocsSection>

				<DocsSection
					id="next-steps"
					title="Next steps"
					lead="If the template or an addon you need doesn't exist yet, build that first."
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
							<LayersIcon className="mr-1 inline size-3.5 align-[-2px]" />
							Once both exist in the registry,{" "}
							<Link href="/builder" className="font-medium text-primary hover:underline">
								open the builder
							</Link>{" "}
							to assemble and download your stack manifest.
						</li>
					</ul>
				</DocsSection>
			</div>

			<DocsPagination currentHref="/docs/stacks/creating" />
		</div>
	);
}
