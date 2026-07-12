"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangleIcon, CheckIcon, DownloadIcon, LayersIcon } from "lucide-react";
import { CommandCard } from "@/components/CommandCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAllTemplates } from "@/hooks/useAllTemplates";
import { useAllAddons } from "@/hooks/useAllAddons";
import { useAddonManifest } from "@/hooks/useAddonManifest";
import { orderByRequires } from "@/lib/stack-plan";
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

// Inputs the "install" command actually collects: manifest-level (shared) plus
// the install command's own inputs, de-duplicated by name.
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
	const { templates, isLoading: templatesLoading } = useAllTemplates();
	const { addons, isLoading: addonsLoading } = useAllAddons();

	const [projectName, setProjectName] = useState("my-app");
	const [templateName, setTemplateName] = useState<string | null>(null);
	const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
	const [manifests, setManifests] = useState<Record<string, AddonManifest>>({});
	const [inputValues, setInputValues] = useState<
		Record<string, Record<string, string>>
	>({});

	const appName = slugify(projectName);

	// De-duplicate addons by id (the catalog returns one row per version).
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

	function toggleAddon(id: string) {
		setSelectedAddons((prev) =>
			prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id],
		);
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

	// Addons required by a selection but not selected themselves.
	const missingRequires = useMemo(() => {
		const missing = new Set<string>();
		for (const id of selectedAddons) {
			for (const req of manifests[id]?.requires ?? []) {
				if (!selectedAddons.includes(req)) missing.add(req);
			}
		}
		return [...missing];
	}, [selectedAddons, manifests]);

	function addMissingRequires() {
		setSelectedAddons((prev) => [...new Set([...prev, ...missingRequires])]);
	}

	const orderedAddons = useMemo(
		() => orderByRequires(selectedAddons, (id) => manifests[id]?.requires ?? []),
		[selectedAddons, manifests],
	);

	const command = useMemo(() => {
		if (!templateName) return "";
		const lines = [`anesis new ${appName} ${templateName}`];
		if (orderedAddons.length > 0) {
			lines.push(`cd ${appName}`);
			for (const id of orderedAddons) {
				const resolved = resolveInputs(manifests[id], inputValues[id]);
				const flags = Object.entries(resolved)
					.map(([key, value]) => `--input ${key}=${value}`)
					.join(" ");
				lines.push(`anesis use ${id} install${flags ? ` ${flags}` : ""}`);
			}
		}
		return lines.join("\n");
	}, [appName, templateName, orderedAddons, manifests, inputValues]);

	function downloadStack() {
		if (!templateName) return;
		const stack = {
			schema_version: "1",
			id: appName,
			name: projectName || appName,
			description: "Generated with the Anesis builder",
			template: templateName,
			addons: orderedAddons.map((id) => {
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
					Pick a template, add the addons you want, and copy the commands or save
					it as a reusable stack.
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
						({selectedAddons.length} selected)
					</span>
				</h2>
				{addonsLoading ? (
					<p className="text-sm text-muted-foreground">Loading addons…</p>
				) : (
					<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
						{uniqueAddons.map((addon) => {
							const active = selectedAddons.includes(addon.addon_id);
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

			{selectedAddons.length > 0 ? (
				<section className="flex flex-col gap-3">
					<h2 className="text-sm font-semibold">4. Configure addons</h2>
					<div className="flex flex-col gap-3">
						{orderedAddons.map((id) => {
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
				<h2 className="text-sm font-semibold">
					{selectedAddons.length > 0 ? "5. Ship it" : "4. Ship it"}
				</h2>
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
