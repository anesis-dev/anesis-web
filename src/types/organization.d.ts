/**
 * Organization domain types.
 *
 * `IOrganization` — org record from the server.
 * `IOrganizationMember` — a member row with optional denormalized user fields.
 * `IOrganizationInvitation` — a pending/accepted/declined/expired invitation.
 * `IOrgRole` — union of possible org-level roles.
 * `IInvitationStatus` — union of invitation lifecycle states.
 */
export type IOrgRole = "member" | "admin" | "owner";

export type IInvitationStatus = "pending" | "accepted" | "declined" | "expired";

export interface IOrganization {
	id: string;
	name: string;
	slug: string;
	description?: string;
	avatar_url?: string;
	owner_id: string;
	created_at: string;
	updated_at: string;
}

export interface IOrganizationMember {
	id: string;
	organization_id: string;
	user_id: string;
	role: IOrgRole;
	invited_by?: string;
	joined_at: string;
	user_login?: string;
	user_avatar_url?: string;
}

export interface IOrganizationInvitation {
	id: string;
	organization_id: string;
	email?: string;
	user_id?: string;
	token: string;
	role: IOrgRole;
	status: IInvitationStatus;
	expires_at: string;
	invited_by?: string;
	created_at: string;
}
