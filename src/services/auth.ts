import { api } from "@/api/client";
import { env } from "@/config/env";

export function getLoginUrl(): string {
	return `${env.apiUrl}/auth/login`;
}

export function getAddAccountUrl(): string {
	return `${env.apiUrl}/auth/add-account`;
}

export async function exchangeAuthCode(code: string): Promise<void> {
	await api.post<void>("/auth/exchange", { code });
}

export async function logoutRequest(): Promise<void> {
	await fetch(`${env.apiUrl}/auth/logout`, {
		method: "GET",
		credentials: "include",
	});
}

export async function switchAccountRequest(login: string): Promise<void> {
	await api.post<void>("/auth/switch", { login });
}

export async function removeSessionRequest(login: string): Promise<void> {
	await api.delete<void>(`/auth/sessions/${encodeURIComponent(login)}`);
}
