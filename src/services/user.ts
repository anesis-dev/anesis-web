import { api } from "@/api/client";
import { parseMeResponse, parseUsersResponse } from "@/lib/api-contracts";
import { IUser } from "@/types/user";

export async function fetchMe(): Promise<IUser> {
	return parseMeResponse(await api.get<unknown>("/user/info"));
}

export async function fetchAllUsers(): Promise<IUser[]> {
	return parseUsersResponse(await api.get<unknown>("/user/all"));
}

export async function deleteUser(userId: string): Promise<void> {
	await api.delete<void>(`/user/${encodeURIComponent(userId)}`);
}
