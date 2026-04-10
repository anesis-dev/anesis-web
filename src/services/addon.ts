import { api } from "@/api/client";
import {
	parseAddonUrlResponse,
	parseAddonsResponse,
	parsePublishAddonResponse,
} from "@/lib/api-contracts";
import { IAddon, IAddonUrlResponse } from "@/types/addon";

export async function fetchAddons(): Promise<IAddon[]> {
	return parseAddonsResponse(await api.get<unknown>("/addon/all"));
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

export async function deleteAddon(
	addonId: string,
	version: string,
): Promise<void> {
	await api.delete<void>(
		`/addon/${encodeURIComponent(addonId)}/${encodeURIComponent(version)}`,
	);
}
