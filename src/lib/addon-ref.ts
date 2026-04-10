import { IAddon } from "@/types/addon";

export function getAddonRef(
  addon: Pick<IAddon, "addon_id" | "version">,
): string {
  return `${addon.addon_id}@${addon.version}`;
}

export function getAddonHref(
  addon: Pick<IAddon, "addon_id" | "version">,
): string {
  const addonId = addon.addon_id.trim();
  const version = addon.version.trim();

  if (!addonId || !version) {
    return "/addons/registry";
  }

  return `/addons/registry/${encodeURIComponent(
    getAddonRef({ addon_id: addonId, version }),
  )}`;
}
