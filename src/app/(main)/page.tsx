"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AddonCard } from "@/components/addons/AddonCard";
import { useAddons } from "@/hooks/useAddons";
import { useTemplates } from "@/hooks/useTemplates";
import { getDateTimestamp } from "@/lib/date";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

const installCommand = `npm install -g @oxide-cli/oxide`;

const features = [
  {
    title: "Template starters",
    description:
      "Generate full project starters from reusable registry packages instead of rebuilding the same setup every time.",
    icon: CommandIcon,
  },
  {
    title: "Workflow addons",
    description:
      "Install reusable commands on top of a project so teams can share setup, QA, and delivery flows as packages.",
    icon: BoxesIcon,
  },
  {
    title: "Rust CLI core",
    description:
      "Oxide keeps the local developer flow fast in Rust while the web app handles discovery, docs, and publishing.",
    icon: ServerCogIcon,
  },
];

function TemplateSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border bg-card px-6 py-5 animate-pulse">
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
      <div className="mt-auto flex items-center justify-between border-t pt-4">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="h-7 w-16 rounded bg-muted" />
      </div>
    </div>
  );
}

function AddonSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col gap-4 rounded-xl border bg-card px-6 py-5">
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
      <div className="mt-auto flex items-center gap-2 border-t pt-4">
        <div className="h-8 w-8 rounded bg-muted" />
        <div className="h-8 flex-1 rounded bg-muted" />
      </div>
    </div>
  );
}

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
      .slice(0, 3);
  }, [addons]);

  return (
    <div className="w-full">
      <section className="border-b">
        <div className="mx-auto flex min-h-[93dvh] w-full max-w-6xl flex-col items-center justify-center gap-8 px-4 py-16 text-center sm:px-5 lg:gap-6 lg:px-8 lg:py-24">
          <div className="max-w-4xl space-y-5">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
              A fast Rust CLI for templates, addons, and repeatable setup.
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Oxide helps teams scaffold projects from registry templates, attach
              reusable workflow addons, and publish both package types through one
              shared platform.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/docs/installation">
                <BookOpenIcon className="size-4" />
                Get started
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
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
              className="w-full sm:w-auto"
              asChild
            >
              <Link href="/addons">
                Browse addons
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mx-auto w-full max-w-2xl">
            <div className="flex flex-col overflow-hidden rounded-xl border bg-background/85 text-left shadow-sm ring-1 ring-foreground/5 backdrop-blur sm:flex-row sm:items-stretch">
              <button
                type="button"
                onClick={handleCopyInstallCommand}
                aria-label={`Copy npm install command: ${installCommand}`}
                className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/45 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-muted/45 text-primary">
                  <TerminalSquareIcon className="size-4" />
                </span>
                <code className="block min-w-0 max-w-full overflow-x-auto whitespace-nowrap font-mono text-sm font-semibold text-foreground sm:text-base">
                  {installCommand}
                </code>
              </button>
              <div className="border-t p-2 sm:border-l sm:border-t-0">
                <Button
                  type="button"
                  variant={installCopied ? "secondary" : "ghost"}
                  className="w-full sm:w-auto"
                  onClick={handleCopyInstallCommand}
                  aria-label={
                    installCopied ? "Install command copied" : "Copy install command"
                  }
                >
                  {installCopied ? (
                    <CheckIcon className="size-4" />
                  ) : (
                    <CopyIcon className="size-4" />
                  )}
                  {installCopied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-20 lg:gap-12 lg:px-8 lg:py-24">
        <div className="max-w-2xl space-y-2">
          <p className="text-sm font-medium text-primary">Core ideas</p>
          <h2 className="text-3xl font-bold tracking-tight">
            Templates start the project. Addons teach the CLI what to do next.
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border bg-card p-6">
              <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-muted">
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

      <section className="border-y bg-muted/20">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="rounded-2xl border bg-card p-6">
            <p className="text-sm font-medium text-primary">Documentation</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Installation, CLI usage, templates, and addons
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              The docs section explains how to install Oxide, use the CLI, and
              structure both `oxide.template.json` and `oxide.addon.json`
              correctly.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link href="/docs/installation">Installation</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs/cli">CLI</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs/templates">Templates</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs/addons">Addons</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <p className="text-sm font-medium text-primary">Publishing</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Publish starters and workflow packages from the same registry model
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Templates can target any stack, and addons can encapsulate repeated
              commands for setup or maintenance. The important part is shipping a
              valid `oxide.template.json` or `oxide.addon.json` from the correct
              GitHub directory.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link href="/templates">
                  View templates
                  <ArrowRightIcon className="size-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/addons">
                  View addons
                  <ArrowRightIcon className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-20 lg:gap-12 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">Recent addons</p>
            <h2 className="text-3xl font-bold tracking-tight">
              Latest automations from the registry
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              These packages extend Oxide with reusable commands, so the homepage
              shows live registry activity instead of only starter templates.
            </p>
          </div>
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/addons">
              View all addons
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </div>

        {addonsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <AddonSkeleton key={index} />
            ))}
          </div>
        ) : featuredAddons.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {featuredAddons.map((addon) => (
              <AddonCard key={addon.id} addon={addon} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed text-center">
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

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-20 lg:gap-12 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">
              Featured templates
            </p>
            <h2 className="text-3xl font-bold tracking-tight">
              Recent starters from the registry
            </h2>
          </div>
          <Button variant="outline" className="w-full sm:w-auto" asChild>
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
          <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed text-center">
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
