/**
 * Repository credential type.
 *
 * Represents a stored VCS credential (e.g. GitHub PAT) used to access private
 * template or addon repositories on behalf of a user or organization.
 */
export interface IRepoCredential {
	id: string;
	name: string;
	provider: string;
	credential_type: string;
	organization_id?: string;
	created_by: string;
	created_at: string;
}
