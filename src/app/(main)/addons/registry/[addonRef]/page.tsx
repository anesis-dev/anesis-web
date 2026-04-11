"use client";

import Link from "next/link";
import { use, useState } from "react";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  BoxesIcon,
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  FileCode2Icon,
  FolderGit2Icon,
  GitCommitHorizontalIcon,
  Layers3Icon,
  PackageIcon,
  ShieldCheckIcon,
  TerminalSquareIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAddon } from "@/hooks/useAddon";
import { useAddonManifest } from "@/hooks/useAddonManifest";
import { formatDate } from "@/lib/date";
import { parseGitHubTreeUrl } from "@/lib/github-tree-url";
import { getAddonRef } from "@/lib/addon-ref";
import { AddonManifestCommand } from "@/types/addon-manifest";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex max-w-full items-center justify-center rounded-full border bg-background/75 px-2.5 py-1 text-center text-xs font-medium text-muted-foreground backdrop-blur-sm break-words dark:bg-background/20">
      {children}
    </span>
  );
}

function MetaItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
}) {
  return (
    <div className="min-w-0 rounded-2xl border bg-background/80 p-4 backdrop-blur-sm dark:bg-background/30">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Icon className="size-3.5" />
        <span>{label}</span>
      </div>
      <div className="mt-3 min-w-0 break-words text-sm text-foreground">
        {value}
      </div>
    </div>
  );
}

function CommandCard({
  label,
  command,
  helper,
  copyLabel,
}: {
  label: string;
  command: string;
  helper: string;
  copyLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!navigator.clipboard?.writeText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  return (
    <div className="rounded-2xl border bg-background/80 p-4 backdrop-blur-sm dark:bg-background/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{helper}</p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          aria-label={copied ? `Copied ${copyLabel ?? command}` : `Copy ${copyLabel ?? command}`}
          className="w-full shrink-0 sm:w-auto"
        >
          {copied ? (
            <CheckIcon className="size-3.5" />
          ) : (
            <CopyIcon className="size-3.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="mt-4 overflow-x-auto rounded-2xl border bg-muted/35 p-4 text-sm leading-6">
        <code>{command}</code>
      </pre>
    </div>
  );
}

function getAddonExecutionCommand(addonId: string, commandName: string) {
  return `oxide ${addonId} ${commandName}`;
}

function getExecutionHelper(command: AddonManifestCommand) {
  if (command.inputs.length === 0) {
    return "Run this from the root of a project where the addon is already installed.";
  }

  return `Run this from the project root. Oxide may prompt for: ${command.inputs
    .map((input) => input.name)
    .join(", ")}.`;
}

function SnapshotCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border bg-background/80 p-4 backdrop-blur-sm dark:bg-background/30">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{helper}</p>
    </div>
  );
}

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

function getSourceInfo(url: string) {
  try {
    const repo = parseGitHubTreeUrl(url);

    return {
      repositoryUrl: `https://github.com/${repo.owner}/${repo.repo}`,
      repositoryLabel: `${repo.owner}/${repo.repo}`,
      branch: repo.branch ?? null,
      path: repo.path ?? null,
    };
  } catch {
    return {
      repositoryUrl: url,
      repositoryLabel: url,
      branch: null,
      path: null,
    };
  }
}

export default function AddonDetailsPage({
  params,
}: {
  params: Promise<{ addonRef: string }>;
}) {
  const { addonRef } = use(params);
  const decodedRef = decodeURIComponent(addonRef);
  const { addon, isLoading, isError } = useAddon(decodedRef);
  const {
    manifest,
    isLoading: isManifestLoading,
    isError: isManifestError,
  } = useAddonManifest(addon?.url ?? "");

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-5 lg:px-8">
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        <div className="h-40 animate-pulse rounded-3xl border bg-card" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-48 animate-pulse rounded-2xl border bg-card" />
          <div className="h-48 animate-pulse rounded-2xl border bg-card" />
        </div>
      </div>
    );
  }

  if (isError || !addon) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-5">
        <AlertCircleIcon className="size-10 text-muted-foreground" />
        <div>
          <p className="text-lg font-semibold">Addon not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The addon reference{" "}
            <span className="font-mono text-foreground">{decodedRef}</span>{" "}
            could not be loaded.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/addons">
            <ArrowLeftIcon className="size-4" />
            Back to addon registry
          </Link>
        </Button>
      </div>
    );
  }

  const addonRefValue = getAddonRef(addon);
  const source = getSourceInfo(addon.url);
  const installCommand = `oxide addon install ${addon.addon_id}`;
  const removeCommand = `oxide addon remove ${addon.addon_id}`;

  return (
    <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-8 px-4 py-8 sm:px-5 lg:px-8 lg:py-10">
      <div>
        <Link
          href="/addons"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back to addon registry
        </Link>
      </div>

      <section className="relative overflow-hidden rounded-[2rem] border bg-card shadow-sm">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,250,252,0.8))] dark:bg-[linear-gradient(180deg,rgba(23,23,23,0.48),rgba(23,23,23,0.18))]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="relative flex flex-col gap-8 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-4xl space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                {addon.official ? (
                  <Pill>
                    <ShieldCheckIcon className="mr-1 size-3.5" />
                    Official
                  </Pill>
                ) : (
                  <Pill>Community</Pill>
                )}
                <Pill>{addon.addon_id}</Pill>
                <Pill>schema {addon.config.schema_version}</Pill>
                <Pill>v{addon.version}</Pill>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
                  Addon Package
                </p>
                <h1 className="mt-3 break-words text-4xl font-black tracking-tight sm:text-5xl">
                  {addon.config.name}
                </h1>
                <p className="mt-4 max-w-3xl break-words text-base leading-7 text-muted-foreground">
                  {addon.config.description}
                </p>
              </div>
            </div>

            <div className="grid w-full gap-3 sm:max-w-sm">
              <Button asChild className="w-full justify-center gap-2">
                <Link
                  href={addon.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLinkIcon className="size-4" />
                  Open repository
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-center gap-2"
              >
                <Link href="/docs/addons">
                  <FileCode2Icon className="size-4" />
                  Read addon docs
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <SnapshotCard
              label="Registry Ref"
              value={addonRefValue}
              helper="Use this pinned reference when you need to identify the exact published package."
            />
            <SnapshotCard
              label="Published"
              value={formatDate(addon.created_at)}
              helper="When this addon version first appeared in the Oxide registry."
            />
            <SnapshotCard
              label="Last Sync"
              value={formatDate(addon.updated_at)}
              helper="Latest metadata refresh pulled from the linked GitHub source."
            />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
        <div className="space-y-6">
          <Card className="rounded-[1.75rem] border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <PackageIcon className="size-5 text-primary" />
                What This Addon Covers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">
                  {addon.config.name}
                </span>{" "}
                is published in the registry as{" "}
                <span className="font-mono text-foreground">
                  {addonRefValue}
                </span>
                . It is meant to extend Oxide projects with the workflow
                described in its manifest-backed package metadata.
              </p>
              <p>{addon.config.description}</p>
              <p>
                The source of truth stays in GitHub, while this page gives the
                registry-facing view: identity, install commands, publishing
                timestamps, and repository linkage.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <TerminalSquareIcon className="size-5 text-primary" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <CommandCard
                label="Install"
                command={installCommand}
                helper="Pull the addon from the registry into the local Oxide addon cache."
              />
              <CommandCard
                label="Remove"
                command={removeCommand}
                helper="Unregister the addon from your local machine when you no longer need it."
              />
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Layers3Icon className="size-5 text-primary" />
                Available Commands
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isManifestLoading ? (
                <div className="grid gap-3">
                  <div className="h-28 animate-pulse rounded-2xl border bg-muted/30" />
                  <div className="h-28 animate-pulse rounded-2xl border bg-muted/30" />
                </div>
              ) : manifest &&
                manifest.variants.some(
                  (variant) => variant.commands.length > 0,
                ) ? (
                manifest.variants.map((variant) => (
                  <div
                    key={formatVariantLabel(variant.when)}
                    className="rounded-2xl border bg-background/80 p-4 backdrop-blur-sm dark:bg-background/30"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {variant.when
                          ? `Variant: ${variant.when}`
                          : "Default variant"}
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
                          className="rounded-2xl border bg-card/70 p-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="space-y-1">
                              <p className="font-medium text-foreground">
                                {command.name}
                              </p>
                              <p className="text-sm leading-6 text-muted-foreground">
                                {command.description ||
                                  "No description was provided in oxide.addon.json."}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {command.once ? (
                                <SmallBadge>once</SmallBadge>
                              ) : null}
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
                                <SmallBadge
                                  key={`${command.name}-${input.name}`}
                                >
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
                              <SmallBadge key={`${command.name}-${stepType}`}>
                                {stepType}
                              </SmallBadge>
                            ))}
                          </div>

                          <div className="mt-4">
                            <CommandCard
                              label="Run in project"
                              command={getAddonExecutionCommand(
                                addon.addon_id,
                                command.name,
                              )}
                              helper={getExecutionHelper(command)}
                              copyLabel={`oxide ${addon.addon_id} ${command.name}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border bg-background/80 p-4 text-sm leading-6 text-muted-foreground dark:bg-background/30">
                  {isManifestError
                    ? "Command details could not be loaded from this addon's manifest."
                    : "This addon's manifest commands are not available on the page yet."}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="self-start space-y-6 xl:sticky xl:top-24">
          <Card className="rounded-[1.75rem] border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <BoxesIcon className="size-5 text-primary" />
                Package Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <MetaItem
                label="Addon Id"
                value={<span className="font-mono">{addon.addon_id}</span>}
                icon={PackageIcon}
              />
              <MetaItem
                label="Author"
                value={addon.config.author}
                icon={UserIcon}
              />
              <MetaItem
                label="Schema"
                value={`v${addon.config.schema_version}`}
                icon={FileCode2Icon}
              />
              <MetaItem
                label="Commit"
                value={<span className="font-mono">{addon.commit_sha}</span>}
                icon={GitCommitHorizontalIcon}
              />
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <FolderGit2Icon className="size-5 text-primary" />
                Source Repository
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <MetaItem
                label="Repository"
                value={
                  <Link
                    href={source.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-primary underline-offset-4 hover:underline"
                  >
                    {source.repositoryLabel}
                  </Link>
                }
                icon={ExternalLinkIcon}
              />
              <MetaItem
                label="Branch"
                value={source.branch ?? "Not specified"}
                icon={FolderGit2Icon}
              />
              <MetaItem
                label="Path"
                value={
                  source.path ? (
                    <span className="font-mono">{source.path}</span>
                  ) : (
                    "Repository root"
                  )
                }
                icon={FileCode2Icon}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
