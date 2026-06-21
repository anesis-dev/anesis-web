"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getTemplateHref, getTemplateLatestHref } from "@/lib/template-ref";
import { ITemplate } from "@/types/template";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { LockIcon, ShieldCheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { StarButton } from "@/components/StarButton";
import { starTemplate } from "@/services/template";
import { useAuth } from "@/hooks/useAuth";

interface TemplateCardProps {
  template: ITemplate;
  versionCount?: number;
  linkToLatest?: boolean;
  visibility?: string;
}

function Tag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium bg-muted text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function TemplateCard({
  template,
  versionCount = 1,
  linkToLatest = false,
  visibility,
}: TemplateCardProps) {
  const { config } = template;
  const { metadata, author, technologies, languages } = config;
  const detailsHref = linkToLatest
    ? getTemplateLatestHref(template.name)
    : getTemplateHref(template);

  const tags = [...technologies, ...languages];

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isStarred, setIsStarred] = useState(template.is_starred ?? false);
  const [starCount, setStarCount] = useState(template.star_count ?? 0);
  const [starring, setStarring] = useState(false);

  useEffect(() => {
    setIsStarred(template.is_starred ?? false);
    setStarCount(template.star_count ?? 0);
  }, [template.is_starred, template.star_count]);

  async function handleStar() {
    if (starring) return;
    setStarring(true);
    try {
      const result = await starTemplate(template.name);
      setIsStarred(result.is_starred);
      setStarCount(result.star_count);
      await queryClient.invalidateQueries({ queryKey: ["templates"] });
    } finally {
      setStarring(false);
    }
  }

  return (
    <Card className="relative gap-3 py-4 h-full transition-colors hover:border-foreground/30">
      <Link href={detailsHref} className="absolute inset-0 rounded-[inherit]" aria-label={metadata.displayName} />

      <CardHeader className="gap-1 pb-0">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold leading-snug">
            {metadata.displayName}
          </CardTitle>
          <div className="flex items-center gap-1 shrink-0">
            {template.official && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                <ShieldCheckIcon className="size-2.5" />
                Official
              </span>
            )}
            {(visibility ?? template.visibility) === "private" && (
              <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                <LockIcon className="size-2.5" />
                Private
              </span>
            )}
          </div>
        </div>
        <CardDescription className="line-clamp-2 text-xs leading-relaxed">
          {metadata.description}
        </CardDescription>
      </CardHeader>

      {tags.length > 0 && (
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </CardContent>
      )}

      <CardFooter className="mt-auto flex items-center justify-between gap-3 border-t pt-3">
        <Link
          href={`/user/${author.github}`}
          className="relative z-10 flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <GitHubIcon className="size-3 shrink-0" />
          <span className="truncate">@{author.github}</span>
        </Link>

        <div className="flex items-center gap-2 shrink-0">
          <StarButton
            isStarred={isStarred}
            starCount={starCount}
            onToggle={handleStar}
            loading={starring}
            disabled={!user}
            variant="icon"
          />
          <span className="font-mono text-[11px] text-muted-foreground">
            v{config.version}
            {versionCount > 1 && (
              <span className="ml-1 text-muted-foreground/60">({versionCount})</span>
            )}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
