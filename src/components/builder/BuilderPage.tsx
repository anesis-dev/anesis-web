"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
	AlertTriangleIcon,
	ArrowDownIcon,
	ArrowUpIcon,
	CheckIcon,
	DownloadIcon,
	LayersIcon,
	PlusIcon,
	XIcon,
} from "lucide-react";
import { CommandCard } from "@/components/CommandCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PublishStackDialog } from "@/components/stacks/PublishStackDialog";
import { useAllTemplates } from "@/hooks/useAllTemplates";
import { useAllAddons } from "@/hooks/useAllAddons";
import { useAddonManifest } from "@/hooks/useAddonManifest";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { IAddon } from "@/types/addon";
import { AddonManifest, AddonManifestInput } from "@/types/addon-manifest";

function slugify(value: string): string {
	return (
		value
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "") || "my-app"
	);
}



type SequenceItem =
	| { kind: "addon"; key: string; id: string }
	| { kind: "command"; key: string; value: string };



function installInputs(manifest: AddonManifest): AddonManifestInput[] {
	const byName = new Map<string, AddonManifestInput>();
	for (const input of manifest.inputs ?? []) byName.set(input.name, input);
	for (const variant of manifest.variants ?? []) {
		for (const command of variant.commands ?? []) {
			if (command.name !== "install") continue;
			for (const input of command.inputs ?? []) byName.set(input.name, input);
		}
	}
	return [...byName.values()];
}

function resolveInputs(
	manifest: AddonManifest | undefined,
	values: Record<string, string> | undefined,
): Record<string, string> {
	if (!manifest) return {};
	const resolved: Record<string, string> = {};
	for (const input of installInputs(manifest)) {
		const value = values?.[input.name] ?? input.default ?? "";
		if (value !== "") resolved[input.name] = value;
	}
	return resolved;
}

function AddonConfigCard({
	addon,
	values,
	onChange,
	onManifest,
}: {
	addon: IAddon;
	values: Record<string, string> | undefined;
	onChange: (addonId: string, name: string, value: string) => void;
	onManifest: (addonId: string, manifest: AddonManifest) => void;
}) {
	const { manifest, isLoading } = useAddonManifest(addon.url);

	useEffect(() => {
		if (manifest) onManifest(addon.addon_id, manifest);
	}, [manifest, addon.addon_id, onManifest]);

	const inputs = manifest ? installInputs(manifest) : [];

	return (
		<div className="flex flex-col gap-3 rounded-lg border p-3">
			<div className="flex items-center gap-2 text-sm font-medium">
				{addon.name}
				<span className="font-mono text-xs text-muted-foreground">{addon.addon_id}</span>
			</div>

			{isLoading ? (
				<p className="text-xs text-muted-foreground">Loading options…</p>
			) : inputs.length === 0 ? (
				<p className="text-xs text-muted-foreground">No options to configure.</p>
			) : (
				<div className="grid gap-3 sm:grid-cols-2">
					{inputs.map((input) => {
						const value = values?.[input.name] ?? input.default ?? "";
						return (
							<div key={input.name} className="flex flex-col gap-1.5">
								<label className="flex flex-col gap-1 text-xs">
									<span className="font-medium">
										{input.name}
										{input.required ? (
											<span className="text-destructive"> *</span>
										) : null}
									</span>
									{input.description ? (
										<span className="text-muted-foreground">{input.description}</span>
									) : null}
								</label>
								{input.type === "select" ? (
									<select
										value={value}
										onChange={(event) =>
											onChange(addon.addon_id, input.name, event.target.value)
										}
										className="h-9 rounded-md border bg-background px-2 text-sm"
									>
										<option value="">—</option>
										{input.options.map((option) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
									</select>
								) : input.type === "boolean" ? (
									<select
										value={value}
										onChange={(event) =>
											onChange(addon.addon_id, input.name, event.target.value)
										}
										className="h-9 rounded-md border bg-background px-2 text-sm"
									>
										<option value="">—</option>
										<option value="true">true</option>
										<option value="false">false</option>
									</select>
								) : (
									<Input
										value={value}
										onChange={(event) =>
											onChange(addon.addon_id, input.name, event.target.value)
										}
										placeholder={input.default ?? ""}
									/>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

export function BuilderPage() {
	const { user, login } = useAuth();
	const { templates, isLoading: templatesLoading } = useAllTemplates();
	const { addons, isLoading: addonsLoading } = useAllAddons();

	const [projectName, setProjectName] = useState("my-app");
	const [templateName, setTemplateName] = useState<string | null>(null);
	const [sequence, setSequence] = useState<SequenceItem[]>([]);
	const [manifests, setManifests] = useState<Record<string, AddonManifest>>({});
	const [inputValues, setInputValues] = useState<
		Record<string, Record<string, string>>
	>({});
	const [commandDraft, setCommandDraft] = useState("");

	const appName = slugify(projectName);

	
	const uniqueAddons = useMemo(() => {
		const seen = new Set<string>();
		return addons.filter((addon) => {
			if (seen.has(addon.addon_id)) return false;
			seen.add(addon.addon_id);
			return true;
		});
	}, [addons]);

	const addonById = useMemo(() => {
		const map = new Map<string, IAddon>();
		for (const addon of uniqueAddons) map.set(addon.addon_id, addon);
		return map;
	}, [uniqueAddons]);

	const addonSequence = useMemo(
		() => sequence.filter((item): item is Extract<SequenceItem, { kind: "addon" }> =>
			item.kind === "addon",
		),
		[sequence],
	);
	const selectedAddonIds = useMemo(
		() => addonSequence.map((item) => item.id),
		[addonSequence],
	);

	function toggleAddon(id: string) {
		setSequence((prev) => {
			const exists = prev.some((item) => item.kind === "addon" && item.id === id);
			if (exists) return prev.filter((item) => !(item.kind === "addon" && item.id === id));
			return [...prev, { kind: "addon", key: `addon:${id}`, id }];
		});
	}

	const handleManifest = useCallback((addonId: string, manifest: AddonManifest) => {
		setManifests((prev) =>
			prev[addonId] === manifest ? prev : { ...prev, [addonId]: manifest },
		);
	}, []);

	const handleInputChange = useCallback(
		(addonId: string, name: string, value: string) => {
			setInputValues((prev) => ({
				...prev,
				[addonId]: { ...prev[addonId], [name]: value },
			}));
		},
		[],
	);

	
	const missingRequires = useMemo(() => {
		const missing = new Set<string>();
		for (const id of selectedAddonIds) {
			for (const req of manifests[id]?.requires ?? []) {
				if (!selectedAddonIds.includes(req)) missing.add(req);
			}
		}
		return [...missing];
	}, [selectedAddonIds, manifests]);

	function addMissingRequires() {
		setSequence((prev) => {
			const next = [...prev];
			for (const reqId of missingRequires) {
				const dependentIndex = next.findIndex(
					(item) =>
						item.kind === "addon" && (manifests[item.id]?.requires ?? []).includes(reqId),
				);
				const insertAt = dependentIndex === -1 ? next.length : dependentIndex;
				next.splice(insertAt, 0, { kind: "addon", key: `addon:${reqId}`, id: reqId });
			}
			return next;
		});
	}

	
	
	const orderIssueByAddonId = useMemo(() => {
		const positionById = new Map(addonSequence.map((item, index) => [item.id, index]));
		const issues = new Map<string, string>();
		addonSequence.forEach((item, index) => {
			for (const req of manifests[item.id]?.requires ?? []) {
				const reqIndex = positionById.get(req);
				if (reqIndex !== undefined && reqIndex > index) {
					issues.set(item.id, req);
					break;
				}
			}
		});
		return issues;
	}, [addonSequence, manifests]);

	function fixOrderIssue(addonId: string, requiresId: string) {
		setSequence((prev) => {
			const reqIndex = prev.findIndex(
				(item) => item.kind === "addon" && item.id === requiresId,
			);
			if (reqIndex === -1) return prev;
			const reqItem = prev[reqIndex];
			const withoutReq = [...prev.slice(0, reqIndex), ...prev.slice(reqIndex + 1)];
			const targetIndex = withoutReq.findIndex(
				(item) => item.kind === "addon" && item.id === addonId,
			);
			if (targetIndex === -1) return prev;
			return [
				...withoutReq.slice(0, targetIndex),
				reqItem,
				...withoutReq.slice(targetIndex),
			];
		});
	}

	function addCommand() {
		const value = commandDraft.trim();
		if (!value) return;
		const key = `command:${Date.now()}:${Math.random().toString(36).slice(2)}`;
		setSequence((prev) => [...prev, { kind: "command", key, value }]);
		setCommandDraft("");
	}

	function removeSequenceItem(item: SequenceItem) {
		if (item.kind === "addon") {
			toggleAddon(item.id);
			return;
		}
		setSequence((prev) => prev.filter((entry) => entry.key !== item.key));
	}

	function moveSequenceItem(index: number, direction: -1 | 1) {
		setSequence((prev) => {
			const target = index + direction;
			if (target < 0 || target >= prev.length) return prev;
			const next = [...prev];
			[next[index], next[target]] = [next[target], next[index]];
			return next;
		});
	}

	const configureStepNumber = 4;
	const sequenceStepNumber =
		addonSequence.length > 0 ? configureStepNumber + 1 : configureStepNumber;
	const shipStepNumber = sequenceStepNumber + 1;

	const command = useMemo(() => {
		if (!templateName) return "";
		const lines = [`anesis new ${appName} ${templateName}`];
		if (sequence.length > 0) {
			lines.push(`cd ${appName}`);
			for (const item of sequence) {
				if (item.kind === "addon") {
					const resolved = resolveInputs(manifests[item.id], inputValues[item.id]);
					const flags = Object.entries(resolved)
						.map(([key, value]) => `--input ${key}=${value}`)
						.join(" ");
					lines.push(`anesis use ${item.id} install${flags ? ` ${flags}` : ""}`);
				} else {
					lines.push(item.value);
				}
			}
		}
		return lines.join("\n");
	}, [appName, templateName, sequence, manifests, inputValues]);

	function downloadStack() {
		if (!templateName) return;
		const stack = {
			schema_version: "1",
			id: appName,
			name: projectName || appName,
			description: "Generated with the Anesis builder",
			template: templateName,
			addons: addonSequence.map(({ id }) => {
				const resolved = resolveInputs(manifests[id], inputValues[id]);
				return Object.keys(resolved).length > 0
					? { id, command: "install", inputs: resolved }
					: { id, command: "install" };
			}),
		};
		const blob = new Blob([JSON.stringify(stack, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = "anesis.stack.json";
		anchor.click();
		URL.revokeObjectURL(url);
	}

	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-5 lg:px-8">
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-bold tracking-tight">Stack builder</h1>
				<p className="text-sm text-muted-foreground">
					Pick a template, add the addons you want, reorder the run sequence to
					match what actually depends on what, and copy the commands or save it
					as a reusable stack.
				</p>
			</div>

			<section className="flex flex-col gap-2">
				<h2 className="text-sm font-semibold">1. Project name</h2>
				<Input
					value={projectName}
					onChange={(event) => setProjectName(event.target.value)}
					placeholder="my-app"
					className="max-w-sm"
				/>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-sm font-semibold">2. Template</h2>
				{templatesLoading ? (
					<p className="text-sm text-muted-foreground">Loading templates…</p>
				) : (
					<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
						{templates.map((template) => {
							const active = template.name === templateName;
							return (
								<button
									key={template.id}
									type="button"
									onClick={() => setTemplateName(template.name)}
									className={cn(
										"flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors hover:border-foreground/30",
										active && "border-primary bg-primary/5",
									)}
								>
									<span className="flex w-full items-center justify-between gap-2 text-sm font-medium">
										{template.config.metadata?.displayName ?? template.name}
										{active && <CheckIcon className="size-4 text-primary" />}
									</span>
									<span className="line-clamp-2 text-xs text-muted-foreground">
										{template.config.metadata?.description}
									</span>
								</button>
							);
						})}
					</div>
				)}
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-sm font-semibold">
					3. Addons{" "}
					<span className="font-normal text-muted-foreground">
						({selectedAddonIds.length} selected)
					</span>
				</h2>
				{addonsLoading ? (
					<p className="text-sm text-muted-foreground">Loading addons…</p>
				) : (
					<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
						{uniqueAddons.map((addon) => {
							const active = selectedAddonIds.includes(addon.addon_id);
							return (
								<button
									key={addon.addon_id}
									type="button"
									onClick={() => toggleAddon(addon.addon_id)}
									className={cn(
										"flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors hover:border-foreground/30",
										active && "border-primary bg-primary/5",
									)}
								>
									<span className="flex w-full items-center justify-between gap-2 text-sm font-medium">
										{addon.name}
										{active && <CheckIcon className="size-4 text-primary" />}
									</span>
									<span className="line-clamp-2 text-xs text-muted-foreground">
										{addon.config.description}
									</span>
								</button>
							);
						})}
					</div>
				)}

				{missingRequires.length > 0 ? (
					<div className="flex flex-col gap-2 rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
						<div className="flex items-start gap-2 text-amber-700 dark:text-amber-400">
							<AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
							<span>
								Some selected addons require:{" "}
								<span className="font-medium">
									{missingRequires
										.map((id) => addonById.get(id)?.name ?? id)
										.join(", ")}
								</span>
							</span>
						</div>
						<Button type="button" size="sm" variant="outline" onClick={addMissingRequires}>
							Add required addons
						</Button>
					</div>
				) : null}
			</section>

			{selectedAddonIds.length > 0 ? (
				<section className="flex flex-col gap-3">
					<h2 className="text-sm font-semibold">{configureStepNumber}. Configure addons</h2>
					<div className="flex flex-col gap-3">
						{selectedAddonIds.map((id) => {
							const addon = addonById.get(id);
							if (!addon) return null;
							return (
								<AddonConfigCard
									key={id}
									addon={addon}
									values={inputValues[id]}
									onChange={handleInputChange}
									onManifest={handleManifest}
								/>
							);
						})}
					</div>
				</section>
			) : null}

			<section className="flex flex-col gap-3">
				<h2 className="text-sm font-semibold">{sequenceStepNumber}. Order &amp; extra commands</h2>
				<p className="text-sm text-muted-foreground">
					This is the exact order things run in, right after scaffolding.
					Reorder addons to match real dependencies, or slot in one-off
					terminal commands anywhere — e.g. run{" "}
					<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
						bun add tailwindcss
					</code>{" "}
					before an addon that expects it, instead of last. Custom commands
					aren&apos;t part of the <code>anesis.stack.json</code> manifest, so
					downloading or publishing only keeps the addon order.
				</p>

				{sequence.length > 0 ? (
					<ul className="flex flex-col gap-1.5">
						{sequence.map((item, index) => {
							const addon = item.kind === "addon" ? addonById.get(item.id) : null;
							const addonId = item.kind === "addon" ? item.id : null;
							const issue = addonId ? orderIssueByAddonId.get(addonId) : undefined;
							return (
								<li
									key={item.key}
									className="flex flex-col gap-1.5 rounded-md border bg-muted/30 px-3 py-2"
								>
									<div className="flex items-center justify-between gap-2">
										<span className="flex min-w-0 items-center gap-2 text-xs">
											<span className="font-mono text-muted-foreground">
												{index + 1}
											</span>
											{item.kind === "addon" ? (
												<span className="truncate font-medium">
													{addon?.name ?? item.id}
												</span>
											) : (
												<span className="truncate font-mono">{item.value}</span>
											)}
										</span>
										<span className="flex shrink-0 items-center gap-1">
											<button
												type="button"
												onClick={() => moveSequenceItem(index, -1)}
												disabled={index === 0}
												aria-label={`Move earlier: ${item.kind === "addon" ? (addon?.name ?? item.id) : item.value}`}
												className="text-muted-foreground hover:text-foreground disabled:opacity-30"
											>
												<ArrowUpIcon className="size-3.5" />
											</button>
											<button
												type="button"
												onClick={() => moveSequenceItem(index, 1)}
												disabled={index === sequence.length - 1}
												aria-label={`Move later: ${item.kind === "addon" ? (addon?.name ?? item.id) : item.value}`}
												className="text-muted-foreground hover:text-foreground disabled:opacity-30"
											>
												<ArrowDownIcon className="size-3.5" />
											</button>
											<button
												type="button"
												onClick={() => removeSequenceItem(item)}
												aria-label={`Remove: ${item.kind === "addon" ? (addon?.name ?? item.id) : item.value}`}
												className="text-muted-foreground hover:text-destructive"
											>
												<XIcon className="size-3.5" />
											</button>
										</span>
									</div>
									{issue ? (
										<div className="flex flex-wrap items-center justify-between gap-2 rounded border border-amber-500/40 bg-amber-500/5 px-2 py-1 text-xs text-amber-700 dark:text-amber-400">
											<span>
												Requires{" "}
												<span className="font-medium">
													{addonById.get(issue)?.name ?? issue}
												</span>
												, which runs later in this list
											</span>
											<button
												type="button"
												onClick={() => addonId && fixOrderIssue(addonId, issue)}
												className="shrink-0 font-medium underline"
											>
												Fix order
											</button>
										</div>
									) : null}
								</li>
							);
						})}
					</ul>
				) : (
					<p className="text-xs text-muted-foreground">
						Select addons above, or add a command below.
					</p>
				)}

				<div className="flex gap-2">
					<Input
						value={commandDraft}
						onChange={(event) => setCommandDraft(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								event.preventDefault();
								addCommand();
							}
						}}
						placeholder="bun add tailwindcss"
						className="font-mono text-sm"
					/>
					<Button
						type="button"
						variant="outline"
						onClick={addCommand}
						disabled={!commandDraft.trim()}
						className="shrink-0 gap-1.5"
					>
						<PlusIcon className="size-4" />
						Add
					</Button>
				</div>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-sm font-semibold">{shipStepNumber}. Ship it</h2>
				{templateName ? (
					<>
						<CommandCard
							label="Run in your terminal"
							command={command}
							copyLabel="commands"
						/>
						<Button
							type="button"
							variant="outline"
							onClick={downloadStack}
							className="w-full gap-1.5 sm:w-auto"
						>
							<DownloadIcon className="size-4" />
							Download anesis.stack.json
						</Button>

						<div className="flex flex-col gap-2 rounded-lg border border-dashed p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
							<p className="text-muted-foreground">
								Commit the downloaded file to a GitHub repo, then publish it to
								the registry so others can scaffold it directly.
							</p>
							{user ? (
								<PublishStackDialog
									label="Publish stack"
									variant="outline"
									className="w-full gap-1.5 sm:w-auto"
								/>
							) : (
								<Button onClick={login} variant="outline" className="w-full gap-1.5 sm:w-auto">
									Login to publish
								</Button>
							)}
						</div>
					</>
				) : (
					<div className="flex items-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
						<LayersIcon className="size-4" />
						Pick a template to generate your setup command.
					</div>
				)}
			</section>
		</div>
	);
}
