/**
 * Repository credential service.
 *
 * Provides CRUD operations for VCS credentials stored on the server, used to
 * access private template and addon repositories.
 *
 * Endpoints:
 * - `GET /repo-credentials` → `fetchRepoCredentials`
 * - `POST /repo-credentials` → `createRepoCredential`
 * - `DELETE /repo-credentials/:id` → `deleteRepoCredential`
 */
import { api } from "@/api/client";
import { parseRepoCredentialsResponse } from "@/lib/api-contracts";
import { IRepoCredential } from "@/types/repo-credential";

export async function fetchRepoCredentials(): Promise<IRepoCredential[]> {
	return parseRepoCredentialsResponse(await api.get<unknown>("/repo-credentials"));
}

export async function createRepoCredential(payload: {
	name: string;
	provider: string;
	credential_type: string;
	token: string;
	organization_id?: string;
}): Promise<IRepoCredential> {
	const result = await api.post<unknown>("/repo-credentials", payload);
	return parseRepoCredentialsResponse([result])[0];
}

export async function deleteRepoCredential(id: string): Promise<void> {
	await api.delete<void>(`/repo-credentials/${encodeURIComponent(id)}`);
}
