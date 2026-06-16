/**
 * Access-control types.
 *
 * `ITemplateAccess` and `IAddonAccess` represent a single access grant row
 * returned by the server when listing who can view a private/org-private
 * template or addon.
 */
export interface ITemplateAccess {
	id: string;
	template_id: string;
	grantee_type: string;
	grantee_id: string;
	granted_by: string;
	created_at: string;
}

export interface IAddonAccess {
	id: string;
	addon_id: string;
	grantee_type: string;
	grantee_id: string;
	granted_by: string;
	created_at: string;
}
