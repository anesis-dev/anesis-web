/**
 * User type.
 *
 * Represents an authenticated Anesis user as returned by `GET /user/info`.
 * The `role` field gates admin functionality throughout the UI.
 */
export interface IUser {
	id: string;
	login: string;
	github_id: number;
	avatar_url: string;
	role: "admin" | "user";
	created_at?: string;
}
