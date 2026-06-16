/**
 * Addon manifest client service.
 *
 * Fetches a parsed `AddonManifest` via the `/api/addon-manifest` Next.js route
 * handler, which proxies the GitHub Contents API to avoid CORS restrictions.
 * Returns `null` when the manifest file is not found (HTTP 404).
 */
import { AddonManifest } from "@/types/addon-manifest";

export async function fetchAddonManifest(
  repositoryUrl: string,
): Promise<AddonManifest | null> {
  const response = await fetch(
    `/api/addon-manifest?url=${encodeURIComponent(repositoryUrl)}`,
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    throw new Error(
      payload?.message ?? "Failed to load addon manifest details.",
    );
  }

  return (await response.json()) as AddonManifest;
}
