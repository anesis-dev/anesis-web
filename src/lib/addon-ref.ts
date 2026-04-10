import { IAddon } from "@/types/addon";

export function getAddonRef(
	addon: Pick<IAddon, "addon_id" | "version">,
): string {
	return `${addon.addon_id}@${addon.version}`;
}
