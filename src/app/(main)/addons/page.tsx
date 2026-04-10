import Link from "next/link";
import {
	BookOpenIcon,
	BoxesIcon,
	CommandIcon,
	FileJsonIcon,
	Layers3Icon,
	RouteIcon,
} from "lucide-react";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Button } from "@/components/ui/button";
import { getLocalAddonCatalog } from "@/services/addon-catalog";
import {
	AddonManifestCommand,
	AddonManifestDetectRule,
	AddonManifestInput,
} from "@/types/addon-manifest";

export const metadata = {
	title: "Addons",
};

function StatCard({
	label,
	value,
	description,
}: {
	label: string;
	value: string | number;
	description: string;
}) {
	return (
		<div className="rounded-3xl border bg-card/90 p-5 shadow-sm">
			<p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
				{label}
			</p>
			<p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
			<p className="mt-2 text-sm leading-6 text-muted-foreground">
				{description}
			</p>
		</div>
	);
}

function Badge({ children }: { children: React.ReactNode }) {
	return (
		<span className="inline-flex items-center rounded-full border bg-background/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
			{children}
		</span>
	);
}

function countLabel(count: number, singular: string, plural = `${singular}s`) {
	return `${count} ${count === 1 ? singular : plural}`;
}

function formatVariantLabel(when: string | null) {
	return when ?? "default";
}

function describeDetectRule(rule: AddonManifestDetectRule) {
	switch (rule.type) {
		case "file_exists":
			return `${rule.file} ${rule.negate ? "must not exist" : "must exist"}`;
		case "file_contains":
			return `${rule.file} ${rule.negate ? "must not contain" : "must contain"} "${rule.contains}"`;
		case "json_contains":
		case "toml_contains":
		case "yaml_contains":
			return `${rule.file} ${rule.negate ? "must not match" : "must match"} ${rule.key_path}${rule.value ? ` = ${rule.value}` : ""}`;
		default:
			return rule.type;
	}
}

function renderInputBadge(input: AddonManifestInput) {
	return (
		<Badge key={input.name}>
			{input.name}
			<span className="ml-1 font-mono text-[10px] uppercase tracking-[0.14em]">
				{input.type}
			</span>
		</Badge>
	);
}

function getCommandStepTypes(command: AddonManifestCommand) {
	return Array.from(new Set(command.steps.map((step) => step.type)));
}

export default async function AddonsPage() {
	const addons = await getLocalAddonCatalog();
	const totalCommands = addons.reduce(
		(sum, addon) => sum + addon.commandNames.length,
		0,
	);
	const totalVariants = addons.reduce(
		(sum, addon) => sum + addon.variants.length,
		0,
	);
	const totalStepTypes = new Set(
		addons.flatMap((addon) => addon.stepTypes),
	).size;

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-5 lg:px-8">
			<section className="relative overflow-hidden rounded-[2rem] border bg-[radial-gradient(circle_at_top_left,rgba(221,107,32,0.18),transparent_38%),linear-gradient(135deg,rgba(255,252,247,0.95),rgba(255,248,240,0.78))] p-6 shadow-sm sm:p-8 dark:bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.22),transparent_32%),linear-gradient(135deg,rgba(37,27,21,0.96),rgba(24,19,16,0.98))]">
				<div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
				<div className="relative flex flex-col gap-6">
					<div className="max-w-4xl space-y-3">
						<p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">
							Addon Catalog
						</p>
						<h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
							Official addons generated from live{" "}
							<code className="rounded bg-background/80 px-2 py-1 font-mono text-[0.72em]">
								oxide.addon.json
							</code>
						</h1>
						<p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
							This page reads manifests from the sibling addons repository and
							turns them into human-readable docs. Compatibility rules, commands,
							inputs, and step types come from the same JSON the CLI validates.
						</p>
					</div>

					<div className="flex flex-wrap gap-3">
						<Button asChild>
							<Link href="/addons/registry">
								<BoxesIcon className="size-4" />
								Open registry explorer
							</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/docs/addons">
								<BookOpenIcon className="size-4" />
								Authoring docs
							</Link>
						</Button>
					</div>
				</div>
			</section>

			<div className="grid gap-4 md:grid-cols-3">
				<StatCard
					label="Addons"
					value={addons.length}
					description="Manifest directories discovered under the local addons repository."
				/>
				<StatCard
					label="Commands"
					value={totalCommands}
					description="Named addon entrypoints exposed through the current manifests."
				/>
				<StatCard
					label="Variants"
					value={totalVariants}
					description={`${totalStepTypes} distinct declarative step types are used across the current addon set.`}
				/>
			</div>

			{addons.length > 1 ? (
				<div className="flex flex-wrap gap-2">
					{addons.map((addon) => (
						<Button key={addon.id} variant="outline" asChild>
							<Link href={`#${addon.id}`}>{addon.name}</Link>
						</Button>
					))}
				</div>
			) : null}

			{addons.length === 0 ? (
				<div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed py-20 text-center">
					<FileJsonIcon className="size-8 text-muted-foreground" />
					<div className="space-y-1">
						<p className="text-sm font-medium">No local addon manifests found</p>
						<p className="text-sm text-muted-foreground">
							Add a folder with <code>oxide.addon.json</code> under the sibling{" "}
							<code>addons</code> repository and it will show up here.
						</p>
					</div>
				</div>
			) : (
				addons.map((addon) => (
					<section
						key={addon.id}
						id={addon.id}
						className="scroll-mt-24 space-y-4"
					>
						<div className="grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
							<div className="rounded-[2rem] border bg-card p-6 shadow-sm sm:p-8">
								<div className="flex flex-col gap-5">
									<div className="space-y-3">
										<div className="flex flex-wrap gap-2">
											<Badge>{addon.id}</Badge>
											<Badge>v{addon.version}</Badge>
											<Badge>schema {addon.schema_version}</Badge>
											<Badge>{addon.author}</Badge>
										</div>
										<div>
											<h2 className="text-3xl font-semibold tracking-tight">
												{addon.name}
											</h2>
											<p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
												{addon.description}
											</p>
										</div>
									</div>

									<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
										<StatCard
											label="Variants"
											value={addon.variants.length}
											description="Manifest branches selected from detect rules or the fallback path."
										/>
										<StatCard
											label="Named Commands"
											value={addon.commandNames.length}
											description="Unique command names exposed across all variants."
										/>
										<StatCard
											label="Inputs"
											value={addon.inputNames.length}
											description="Unique prompt names collected from addon-level and command-level inputs."
										/>
										<StatCard
											label="Dependencies"
											value={addon.requires.length}
											description="Addon ids that must already be installed before commands can run."
										/>
									</div>
								</div>
							</div>

							<div className="grid gap-4">
								<div className="rounded-3xl border bg-card p-5 shadow-sm">
									<div className="flex items-center gap-2 text-sm font-medium text-foreground">
										<FileJsonIcon className="size-4 text-primary" />
										Manifest source
									</div>
									<p className="mt-3 break-all font-mono text-sm text-foreground">
										{addon.manifestPath}
									</p>
									<p className="mt-3 text-sm leading-6 text-muted-foreground">
										This section is rendered directly from the file above, so the
										web copy stays aligned with the repo state.
									</p>
								</div>

								<div className="rounded-3xl border bg-card p-5 shadow-sm">
									<div className="flex items-center gap-2 text-sm font-medium text-foreground">
										<RouteIcon className="size-4 text-primary" />
										Detection
									</div>
									{addon.detect.length > 0 ? (
										<div className="mt-4 space-y-4">
											{addon.detect.map((block) => (
												<div
													key={block.id}
													className="rounded-2xl border bg-muted/20 p-4"
												>
													<div className="flex flex-wrap items-center gap-2">
														<p className="font-medium">{block.id}</p>
														<Badge>match: {block.match}</Badge>
													</div>
													<div className="mt-3 space-y-2 text-sm text-muted-foreground">
														{block.rules.map((rule, index) => (
															<p key={`${block.id}-${index}`}>
																{describeDetectRule(rule)}
															</p>
														))}
													</div>
												</div>
											))}
										</div>
									) : (
										<p className="mt-3 text-sm leading-6 text-muted-foreground">
											No detect blocks were defined, so only the fallback variant
											would apply.
										</p>
									)}
								</div>
							</div>
						</div>

						<div className="grid gap-4 xl:grid-cols-[1.25fr_0.95fr]">
							<div className="grid gap-4 lg:grid-cols-2">
								{addon.variants.map((variant) => (
									<div
										key={`${addon.id}-${formatVariantLabel(variant.when)}`}
										className="rounded-3xl border bg-card p-5 shadow-sm"
									>
										<div className="flex items-center gap-2 text-sm font-medium text-foreground">
											<Layers3Icon className="size-4 text-primary" />
											{variant.when
												? `Variant: ${variant.when}`
												: "Fallback variant"}
										</div>
										<p className="mt-2 text-sm leading-6 text-muted-foreground">
											{variant.when
												? "Activated when its detect block resolves first."
												: "Used when no earlier detect block matches the current project."}
										</p>

										<div className="mt-4 space-y-3">
											{variant.commands.map((command) => (
												<div
													key={`${addon.id}-${formatVariantLabel(variant.when)}-${command.name}`}
													className="rounded-2xl border bg-muted/20 p-4"
												>
													<div className="flex flex-wrap items-start justify-between gap-3">
														<div className="space-y-1">
															<p className="font-medium">{command.name}</p>
															<p className="text-sm leading-6 text-muted-foreground">
																{command.description || "No command description provided."}
															</p>
														</div>
														<div className="flex flex-wrap gap-2">
															{command.once ? <Badge>once</Badge> : null}
															<Badge>{countLabel(command.steps.length, "step")}</Badge>
														</div>
													</div>

													{command.requires_commands.length > 0 ? (
														<p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
															Requires: {command.requires_commands.join(", ")}
														</p>
													) : null}

													{command.inputs.length > 0 ? (
														<div className="mt-3 flex flex-wrap gap-2">
															{command.inputs.map(renderInputBadge)}
														</div>
													) : null}

													<div className="mt-3 flex flex-wrap gap-2">
														{getCommandStepTypes(command).map((stepType) => (
															<Badge key={`${command.name}-${stepType}`}>
																{stepType}
															</Badge>
														))}
													</div>
												</div>
											))}
										</div>
									</div>
								))}
							</div>

							<div className="space-y-4">
								<div className="rounded-3xl border bg-card p-5 shadow-sm">
									<div className="flex items-center gap-2 text-sm font-medium text-foreground">
										<CommandIcon className="size-4 text-primary" />
										Inputs and dependencies
									</div>

									<div className="mt-4 space-y-4">
										<div>
											<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
												Shared inputs
											</p>
											<div className="mt-2 flex flex-wrap gap-2">
												{addon.inputs.length > 0 ? (
													addon.inputs.map(renderInputBadge)
												) : (
													<p className="text-sm text-muted-foreground">
														No addon-level prompts defined.
													</p>
												)}
											</div>
										</div>

										<div>
											<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
												Requires
											</p>
											<div className="mt-2 flex flex-wrap gap-2">
												{addon.requires.length > 0 ? (
													addon.requires.map((dependency) => (
														<Badge key={dependency}>{dependency}</Badge>
													))
												) : (
													<p className="text-sm text-muted-foreground">
														This addon does not require any other installed addons.
													</p>
												)}
											</div>
										</div>

										<div>
											<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
												Step primitives
											</p>
											<div className="mt-2 flex flex-wrap gap-2">
												{addon.stepTypes.map((stepType) => (
													<Badge key={stepType}>{stepType}</Badge>
												))}
											</div>
										</div>
									</div>
								</div>

								<details className="rounded-3xl border bg-card p-5 shadow-sm">
									<summary className="cursor-pointer list-none text-sm font-medium text-foreground">
										<div className="inline-flex items-center gap-2">
											<FileJsonIcon className="size-4 text-primary" />
											Manifest preview
										</div>
									</summary>
									<div className="mt-4">
										<CodeBlock code={addon.rawManifest} />
									</div>
								</details>
							</div>
						</div>
					</section>
				))
			)}
		</div>
	);
}
