import { env } from "@/config/env";

export function getLoginUrl(): string {
	return `${env.apiUrl}/auth/login`;
}

export async function logoutRequest(): Promise<void> {
	localStorage.removeItem("token");
	await fetch(`${env.apiUrl}/auth/logout`, {
		method: "GET",
		credentials: "include",
	});
}
