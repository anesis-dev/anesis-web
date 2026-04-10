"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTemplates } from "@/hooks/useTemplates";
import { getDateTimestamp } from "@/lib/date";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { PublishTemplateDialog } from "@/components/templates/PublishTemplateDialog";
import { Button } from "@/components/ui/button";
import {
  ArrowRightIcon,
  BookOpenIcon,
  CommandIcon,
  GitBranchPlusIcon,
  LoaderIcon,
  ServerCogIcon,
  ShieldCheckIcon,
  TerminalSquareIcon,
} from "lucide-react";

const installCommand = `curl -sSL https://raw.githubusercontent.com/oxide-cli/oxide/main/install.sh | bash`;

const features = [
  {
    title: "Rust CLI",
    description:
      "Oxide itself is written in Rust. The website is a separate TypeScript frontend.",
    icon: ServerCogIcon,
  },
  {
    title: "Template-first setup",
    description:
      "Generate projects from reusable templates instead of repeating the same boilerplate.",
    icon: CommandIcon,
  },
  {
    title: "Publish when needed",
    description:
      "The current CLI expects an authenticated session before it can resolve and download registry templates.",
    icon: ShieldCheckIcon,
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

export default function Home() {
  const { user, login } = useAuth();
  const { templates, isLoading } = useTemplates();

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

  return (
    <div className="w-full">
      <section className="border-b">
        <div className="mx-auto flex min-h-[93dvh] w-full max-w-6xl flex-col items-center justify-center gap-8 px-4 py-16 text-center sm:px-5 lg:gap-6 lg:px-8 lg:py-24">
          <div className="max-w-4xl space-y-5">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
              A fast Rust CLI for generating projects from reusable templates.
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Oxide helps developers scaffold projects faster, discover reusable
              templates, and publish their own starters for modern stacks and
              custom workflows.
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
            {user ? (
              <PublishTemplateDialog
                label="Publish template"
                size="lg"
                variant="ghost"
                className="w-full gap-1.5 sm:w-auto"
              />
            ) : (
              <Button
                size="lg"
                variant="ghost"
                onClick={login}
                className="w-full sm:w-auto"
              >
                <GitBranchPlusIcon className="size-4" />
                Login to publish
              </Button>
            )}
          </div>

          <div className="mx-auto w-full max-w-2xl rounded-[1.75rem] border bg-card/95 p-5 text-left shadow-sm">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              <TerminalSquareIcon className="size-4 text-primary" />
              Install Oxide
            </div>
            <pre className="mt-3 overflow-x-auto rounded-xl border bg-background/90 px-3 py-3 whitespace-pre-wrap break-all text-sm text-foreground shadow-sm">
              <code>{installCommand}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-20 lg:gap-12 lg:px-8 lg:py-24">
        <div className="max-w-2xl space-y-2">
          <p className="text-sm font-medium text-primary">Core ideas</p>
          <h2 className="text-3xl font-bold tracking-tight">
            Clear boundaries between the CLI, templates, and the site
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
              Templates are not limited to one language ecosystem
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              A template can be for Rust, Python, Go, JavaScript, TypeScript, or
              anything else. The important part is that the folder contains a
              valid `oxide.template.json` and points to the correct GitHub
              directory.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link href="/templates">
                  View registry
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

        {isLoading ? (
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
