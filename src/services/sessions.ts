/**
 * Sessions service.
 *
 * Fetches the list of all active sessions for the current user from
 * `GET /auth/sessions`. Used by `useSessions` to support multi-account
 * switching.
 */
import { api } from "@/api/client";
import { ISession } from "@/types/session";

export async function fetchSessions(): Promise<ISession[]> {
	return api.get<ISession[]>("/auth/sessions");
}
