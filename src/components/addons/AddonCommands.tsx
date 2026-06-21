"use client";

import { Layers3Icon } from "lucide-react";
import { CommandCard } from "@/components/CommandCard";
import { AddonManifest, AddonManifestCommand } from "@/types/addon-manifest";

function SmallBadge({ children }: { children: React.ReactNode }) {
	return (
		<span className="inline-flex items-center rounded-full border bg-background/75 px-2.5 py-1 text-xs font-medium text-muted-foreground">
			{children}
		</span>
	);
}

function getCommandStepTypes(command: AddonManifestCommand) {
	return Array.from(new Set(command.steps.map((step) => step.type)));
}

function formatVariantLabel(when: string | null) {
	return when ?? "default";
}

function getExecutionHelper(command: AddonManifestCommand) {
	if (command.inputs.length === 0) {
		return "Run this from the root of a project where the addon is already installed.";
	}

	return `Run this from the project root. Anesis may prompt for: ${command.inputs
		.map((input) => input.name)
		.join(", ")}.`;
}

export function AddonCommands({
	addonId,
	manifest,
	isLoading,
	isError,
}: {
	addonId: string;
	manifest: AddonManifest | null;
	isLoading?: boolean;
	isError?: boolean;
}) {
	const totalCommands =
		manifest?.variants.reduce((sum, variant) => sum + variant.commands.length, 0) ?? 0;

	if (isLoading) {
		return (
			<div className="grid gap-3">
				<div className="h-28 animate-pulse rounded-2xl border bg-muted/30" />
				<div className="h-28 animate-pulse rounded-2xl border bg-muted/30" />
			</div>
		);
	}

	if (!manifest || totalCommands === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-card py-14 text-center">
				<Layers3Icon className="size-8 text-muted-foreground" />
				<div>
					<p className="font-medium">No commands to show</p>
					<p className="mt-1 text-sm text-muted-foreground">
						{isError
							? "Command details could not be loaded from this addon's manifest."
							: "This addon does not declare any commands in its manifest yet."}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-wrap items-center gap-2">
				<h2 className="text-lg font-semibold tracking-tight">Commands</h2>
				<SmallBadge>
					{totalCommands} {totalCommands === 1 ? "command" : "commands"}
				</SmallBadge>
			</div>
			<p className="text-sm leading-6 text-muted-foreground">
				Commands this addon provides. Run them with{" "}
				<span className="font-mono text-foreground">anesis use {addonId} &lt;command&gt;</span>{" "}
				from a project where the addon is installed.
			</p>

			{manifest.variants
				.filter((variant) => variant.commands.length > 0)
				.map((variant) => (
					<div
						key={formatVariantLabel(variant.when)}
						className="rounded-2xl border bg-card p-4 shadow-sm"
					>
						<div className="flex flex-wrap items-center gap-2">
							<p className="text-sm font-semibold text-foreground">
								{variant.when ? `Variant: ${variant.when}` : "Default variant"}
							</p>
							<SmallBadge>
								{variant.commands.length}{" "}
								{variant.commands.length === 1 ? "command" : "commands"}
							</SmallBadge>
						</div>

						<div className="mt-4 space-y-3">
							{variant.commands.map((command) => (
								<div
									key={`${formatVariantLabel(variant.when)}-${command.name}`}
									className="rounded-2xl border bg-background/70 p-4"
								>
									<div className="flex flex-wrap items-start justify-between gap-3">
										<div className="space-y-1">
											<p className="font-mono font-medium text-foreground">{command.name}</p>
											<p className="text-sm leading-6 text-muted-foreground">
												{command.description ||
													"No description was provided in anesis.addon.json."}
											</p>
										</div>
										<div className="flex flex-wrap gap-2">
											{command.once ? <SmallBadge>once</SmallBadge> : null}
											<SmallBadge>
												{command.steps.length}{" "}
												{command.steps.length === 1 ? "step" : "steps"}
											</SmallBadge>
										</div>
									</div>

									{command.requires_commands.length > 0 ? (
										<p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
											Requires: {command.requires_commands.join(", ")}
										</p>
									) : null}

									{command.inputs.length > 0 ? (
										<div className="mt-3 flex flex-wrap gap-2">
											{command.inputs.map((input) => (
												<SmallBadge key={`${command.name}-${input.name}`}>
													{input.name}
													<span className="ml-1 font-mono text-[10px] uppercase tracking-[0.14em]">
														{input.type}
													</span>
												</SmallBadge>
											))}
										</div>
									) : null}

									<div className="mt-3 flex flex-wrap gap-2">
										{getCommandStepTypes(command).map((stepType) => (
											<SmallBadge key={`${command.name}-${stepType}`}>{stepType}</SmallBadge>
										))}
									</div>

									<div className="mt-4">
										<CommandCard
											label="Run in project"
											command={`anesis use ${addonId} ${command.name}`}
											helper={getExecutionHelper(command)}
											copyLabel={`anesis use ${addonId} ${command.name}`}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				))}
		</div>
	);
}
