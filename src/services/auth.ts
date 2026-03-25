import { env } from "@/config/env";

export function getLoginUrl(): string {
	return `${env.apiUrl}/auth/login`;
}

export async function logoutRequest(): Promise<void> {
	await fetch(`${env.apiUrl}/auth/logout`, {
		method: "GET",
		credentials: "include",
	});
}
