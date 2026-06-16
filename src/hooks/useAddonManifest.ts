/**
 * Hook — fetches and validates the `anesis.addon.json` manifest from GitHub
 * via the Next.js proxy route `/api/addon-manifest`.
 *
 * Cache key: ["addon-manifest", repositoryUrl]
 *
 * Returns `null` when the manifest is not yet loaded. Exposes the raw error
 * object so callers can show structured error messages.
 */
import { useQuery } from "@tanstack/react-query";
import { fetchAddonManifest } from "@/services/addon-manifest";
import { AddonManifest } from "@/types/addon-manifest";

export function useAddonManifest(repositoryUrl: string) {
  const {
    data: manifest = null,
    isLoading,
    isError,
    error,
  } = useQuery<AddonManifest | null>({
    queryKey: ["addon-manifest", repositoryUrl],
    queryFn: () => fetchAddonManifest(repositoryUrl),
    enabled: !!repositoryUrl,
  });

  return { manifest, isLoading, isError, error };
}
