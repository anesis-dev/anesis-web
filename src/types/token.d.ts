export interface IApiToken {
	id: string;
	name: string;
	last_used_at: string | null;
	created_at: string;
}

/** Returned only once, at creation — `token` is the plaintext secret. */
export interface ICreatedToken {
	id: string;
	name: string;
	token: string;
	created_at: string;
}
