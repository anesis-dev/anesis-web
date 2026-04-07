import { api } from "@/api/client";
import { env } from "@/config/env";

export function getLoginUrl(): string {
	return `${env.apiUrl}/auth/login`;
}

export async function exchangeAuthCode(code: string): Promise<void> {
	await api.post<void>("/auth/exchange", { code });
}

export async function logoutRequest(): Promise<void> {
	localStorage.removeItem("token");
	await fetch(`${env.apiUrl}/auth/logout`, {
		method: "GET",
		credentials: "include",
	});
}
