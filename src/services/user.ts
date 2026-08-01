import { ApiError, api } from "@/api/client";
import { parseMeResponse, parsePublicUserResponse, parseUsersResponse } from "@/lib/api-contracts";
import { IPublicUser, IUser } from "@/types/user";

export async function fetchMe(): Promise<IUser> {
	return parseMeResponse(await api.get<unknown>("/user/info"));
}

export async function fetchAllUsers(): Promise<IUser[]> {
	return parseUsersResponse(await api.get<unknown>("/user/all"));
}

export async function fetchUserByLogin(login: string): Promise<IPublicUser> {
	const path = `/user/by-login/${encodeURIComponent(login)}`;

	try {
		return parsePublicUserResponse(await api.get<unknown>(path));
	} catch (error) {
		if (error instanceof ApiError && [404, 405].includes(error.status)) {
			return parsePublicUserResponse(await api.post<unknown>(path));
		}

		throw error;
	}
}

export async function updateUserRole(
	userId: string,
	admin: boolean,
): Promise<void> {
	await api.patch<void>(
		`/user/${encodeURIComponent(userId)}/role?admin=${admin}`,
	);
}

export async function deleteUser(userId: string): Promise<void> {
	await api.delete<void>(`/user/${encodeURIComponent(userId)}`);
}
