export interface IApiToken {
	id: string;
	name: string;
	last_used_at: string | null;
	created_at: string;
}


export interface ICreatedToken {
	id: string;
	name: string;
	token: string;
	created_at: string;
}
