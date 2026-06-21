import { api } from "@/api/client";
import { ISession } from "@/types/session";

export async function fetchSessions(): Promise<ISession[]> {
	return api.get<ISession[]>("/auth/sessions");
}
