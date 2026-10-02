"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authorLogin } from "@/lib/author";
import { getAddonHref, getAddonRef } from "@/lib/addon-ref";
import { IAddon } from "@/types/addon";
import { RegistryCard } from "@/components/registry/RegistryCard";
import { OfficialBadge } from "@/components/ui/badge";
import { DownloadIcon } from "lucide-react";
import { starAddon } from "@/services/addon";
import { useAuth } from "@/hooks/useAuth";

export function AddonStatusBadge({ official }: { official: boolean }) {
    return official ? <OfficialBadge /> : null;
}

interface AddonCardProps {
    addon: IAddon;
    visibility?: string;
}

export function AddonCard({ addon, visibility }: AddonCardProps) {
    const { config } = addon;
    const ownerLogin = authorLogin(config?.author);
    const detailsHref = getAddonHref(addon);

    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isStarred, setIsStarred] = useState(addon.is_starred ?? false);
    const [starCount, setStarCount] = useState(addon.star_count ?? 0);
    const [starring, setStarring] = useState(false);

    useEffect(() => {
        setIsStarred(addon.is_starred ?? false);
        setStarCount(addon.star_count ?? 0);
    }, [addon.is_starred, addon.star_count]);

    async function handleStar() {
        if (starring) return;
        setStarring(true);
        try {
            const result = await starAddon(addon.addon_id);
            setIsStarred(result.is_starred);
            setStarCount(result.star_count);
            await queryClient.invalidateQueries({
                queryKey: ["addon", getAddonRef(addon)],
            });
            await queryClient.invalidateQueries({ queryKey: ["addons"] });
        } finally {
            setStarring(false);
        }
    }

    return (
        <RegistryCard
            href={detailsHref}
            title={config.name}
            description={config.description}
            official={addon.official}
            isPrivate={(visibility ?? addon.visibility) === "private"}
            owner={
                ownerLogin
                    ? { label: `@${ownerLogin}`, href: `/user/${ownerLogin}` }
                    : null
            }
            version={addon.version}
            isStarred={isStarred}
            starCount={starCount}
            onToggleStar={handleStar}
            starring={starring}
            starDisabled={!user}
            footerExtras={
                (addon.download_count ?? 0) > 0 ? (
                    <span
                        className="flex items-center gap-1 text-[11px] text-muted-foreground"
                        title={`${addon.download_count} installs`}
                    >
                        <DownloadIcon className="size-3" />
                        {addon.download_count}
                    </span>
                ) : undefined
            }
        />
    );
}
