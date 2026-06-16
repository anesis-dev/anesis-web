/**
 * Authentication service — functions that interact with the auth endpoints.
 *
 * `getLoginUrl` / `getAddAccountUrl` return the full redirect URLs so the
 * browser can be sent directly to the server-initiated OAuth flow.
 *
 * `exchangeAuthCode` is called by the web callback page to exchange the
 * GitHub OAuth code for a session cookie (legacy code-exchange flow).
 *
 * `logoutRequest` uses a raw `fetch` with `credentials: "include"` because
 * it must send the cookie even though it doesn't need the JSON helpers in
 * `api`.
 *
 * `switchAccountRequest` / `removeSessionRequest` manage multi-account
 * sessions stored server-side.
 */
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
