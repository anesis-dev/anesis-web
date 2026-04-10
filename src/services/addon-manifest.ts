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
