
export interface IUser {
	id: string;
	login: string;
	github_id: number;
	avatar_url: string;
	role: "admin" | "user";
	created_at?: string;
}
