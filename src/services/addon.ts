import { api } from "@/api/client";
import { getAddonRef } from "@/lib/addon-ref";
import {
  parseAddonUrlResponse,
  parseAddonsResponse,
  parsePublishAddonResponse,
} from "@/lib/api-contracts";
import { IAddon, IAddonUrlResponse } from "@/types/addon";

export async function fetchAddons(): Promise<IAddon[]> {
  return parseAddonsResponse(await api.get<unknown>("/addon/all"));
}

export async function fetchAddon(addonRef: string): Promise<IAddon> {
  const addons = await fetchAddons();
  const addon = addons.find((entry) => getAddonRef(entry) === addonRef);

  if (!addon) {
    throw new Error(`Addon "${addonRef}" was not found.`);
  }

  return addon;
}

export async function fetchMyAddons(): Promise<IAddon[]> {
  return parseAddonsResponse(await api.get<unknown>("/addon/my"));
}

export async function fetchAddonUrl(
  addonId: string,
): Promise<IAddonUrlResponse> {
  return parseAddonUrlResponse(
    await api.get<unknown>(`/addon/${encodeURIComponent(addonId)}/url`),
  );
}

export async function publishAddon(
  url: string,
): Promise<{ message: string; addon_id: string }> {
  return parsePublishAddonResponse(
    await api.post<unknown>("/addon/publish", {
      url,
    }),
  );
}

export async function updateAddon(url: string): Promise<void> {
  await api.patch<void>("/addon", { url });
}

export async function updateAddonOfficialStatus(
  addonId: string,
  official: boolean,
): Promise<void> {
  await api.patch<void>(
    `/addon/${encodeURIComponent(addonId)}/official?official=${official}`,
  );
}

export async function deleteAddon(
  addonId: string,
  version: string,
): Promise<void> {
  await api.delete<void>(
    `/addon/${encodeURIComponent(addonId)}/${encodeURIComponent(version)}`,
  );
}
