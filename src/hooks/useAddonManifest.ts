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
