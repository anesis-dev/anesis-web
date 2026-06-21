import { api } from "@/api/client";
import { getAddonRef } from "@/lib/addon-ref";
import {
  parseAddonUrlResponse,
  parseAddonsPageResponse,
  parsePublishAddonResponse,
  parseStarResponse,
} from "@/lib/api-contracts";
import { IPaginatedResponse, IPaginationParams } from "@/types/pagination";
import { IAddon, IAddonUrlResponse, IStarResponse } from "@/types/addon";

function buildPaginationPath(path: string, pagination: IPaginationParams): string {
  const page = Math.max(1, Math.trunc(pagination.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Math.trunc(pagination.pageSize ?? 20)));
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  return `${path}?${params.toString()}`;
}

export async function fetchAddons(
  pagination: IPaginationParams = {},
): Promise<IPaginatedResponse<IAddon>> {
  return parseAddonsPageResponse(
    await api.get<unknown>(buildPaginationPath("/addon/all", pagination)),
  );
}

export async function fetchAllAddons(): Promise<IAddon[]> {
  const pageSize = 100;
  const firstPage = await fetchAddons({ page: 1, pageSize });
  const addons = [...firstPage.data];

  for (let page = 2; page <= firstPage.totalPages; page += 1) {
    const nextPage = await fetchAddons({ page, pageSize });
    addons.push(...nextPage.data);
  }

  return addons;
}

export async function fetchAddon(addonRef: string): Promise<IAddon> {
  const pageSize = 100;
  let page = 1;

  while (true) {
    const response = await fetchAddons({ page, pageSize });
    const addon = response.data.find((entry) => getAddonRef(entry) === addonRef);

    if (addon) {
      return addon;
    }

    if (page >= response.totalPages) {
      break;
    }

    page += 1;
  }

  try {
    page = 1;
    while (true) {
      const response = await fetchMyAddons({ page, pageSize });
      const addon = response.data.find((entry) => getAddonRef(entry) === addonRef);

      if (addon) {
        return addon;
      }

      if (page >= response.totalPages) {
        break;
      }

      page += 1;
    }
  } catch {
  }

  throw new Error(`Addon "${addonRef}" was not found.`);
}

export async function fetchMyAddons(
  pagination: IPaginationParams = {},
): Promise<IPaginatedResponse<IAddon>> {
  return parseAddonsPageResponse(
    await api.get<unknown>(buildPaginationPath("/addon/my", pagination)),
  );
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
  visibility: "public" | "private" = "public",
): Promise<{ message: string; addon_id: string }> {
  return parsePublishAddonResponse(
    await api.post<unknown>("/addon/publish", {
      url,
      visibility,
    }),
  );
}

export async function updateAddon(url: string): Promise<void> {
  await api.patch<void>("/addon", { url });
}

export async function updateAddonVisibility(
  id: string,
  visibility: string,
): Promise<void> {
  await api.patch<void>(`/addon/${encodeURIComponent(id)}/visibility`, {
    visibility,
  });
}

export async function recordAddonUse(addonId: string): Promise<void> {
  await api.post<void>(`/addon/${encodeURIComponent(addonId)}/use`, {});
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

export async function starAddon(addonId: string): Promise<IStarResponse> {
  return parseStarResponse(
    await api.post<unknown>(`/addon/${encodeURIComponent(addonId)}/star`, {}),
  );
}

export async function fetchStarredAddons(
  pagination: IPaginationParams = {},
): Promise<IPaginatedResponse<IAddon>> {
  return parseAddonsPageResponse(
    await api.get<unknown>(buildPaginationPath("/addon/starred", pagination)),
  );
}
