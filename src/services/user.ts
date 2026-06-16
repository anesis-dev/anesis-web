/**
 * User service — API calls related to user accounts.
 *
 * `fetchMe` loads the authenticated user's own profile (`GET /user/info`).
 *
 * `fetchUserByLogin` first tries GET; if the server returns 404 or 405
 * (older server versions only exposed POST for this endpoint) it retries
 * with POST. This makes the client compatible with both server versions.
 *
 * `updateUserRole` and `deleteUser` are admin-only operations.
 */
import { ApiError, api } from "@/api/client";
import { parseMeResponse, parseUsersResponse } from "@/lib/api-contracts";
import { IUser } from "@/types/user";

export async function fetchMe(): Promise<IUser> {
	return parseMeResponse(await api.get<unknown>("/user/info"));
}

export async function fetchAllUsers(): Promise<IUser[]> {
	return parseUsersResponse(await api.get<unknown>("/user/all"));
}

export async function fetchUserByLogin(login: string): Promise<IUser> {
	const path = `/user/by-login/${encodeURIComponent(login)}`;

	try {
		return parseMeResponse(await api.get<unknown>(path));
	} catch (error) {
		if (error instanceof ApiError && [404, 405].includes(error.status)) {
			return parseMeResponse(await api.post<unknown>(path));
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
