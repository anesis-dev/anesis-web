import { api } from "@/api/client";
import { IApiToken, ICreatedToken } from "@/types/token";

export async function fetchTokens(): Promise<IApiToken[]> {
	return api.get<IApiToken[]>("/token");
}

export async function createToken(name: string): Promise<ICreatedToken> {
	return api.post<ICreatedToken>("/token", { name });
}

export async function deleteToken(id: string): Promise<void> {
	return api.delete<void>(`/token/${encodeURIComponent(id)}`);
}
