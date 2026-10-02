"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authorLogin } from "@/lib/author";
import {
    getTemplateHref,
    getTemplateLatestHref,
    getTemplateRef,
} from "@/lib/template-ref";
import { ITemplate } from "@/types/template";
import { RegistryCard } from "@/components/registry/RegistryCard";
import { starTemplate } from "@/services/template";
import { useAuth } from "@/hooks/useAuth";

interface TemplateCardProps {
    template: ITemplate;
    versionCount?: number;
    linkToLatest?: boolean;
    visibility?: string;
}

export function TemplateCard({
    template,
    versionCount = 1,
    linkToLatest = false,
    visibility,
}: TemplateCardProps) {
    const { config } = template;
    const { metadata, author, technologies, languages } = config;
    const ownerLogin = authorLogin(author);
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
            const templateRef = linkToLatest
                ? template.name
                : getTemplateRef(template);
            await queryClient.invalidateQueries({
                queryKey: ["template", templateRef],
            });
            await queryClient.invalidateQueries({ queryKey: ["templates"] });
        } finally {
            setStarring(false);
        }
    }

    return (
        <RegistryCard
            href={detailsHref}
            title={metadata.displayName}
            description={metadata.description}
            official={template.official}
            isPrivate={(visibility ?? template.visibility) === "private"}
            owner={
                ownerLogin
                    ? { label: `@${ownerLogin}`, href: `/user/${ownerLogin}` }
                    : null
            }
            tags={tags}
            version={config.version}
            versionCount={versionCount}
            isStarred={isStarred}
            starCount={starCount}
            onToggleStar={handleStar}
            starring={starring}
            starDisabled={!user}
        />
    );
}
