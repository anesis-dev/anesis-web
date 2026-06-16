/**
 * Notification types.
 *
 * `INotification` — a single in-app notification (e.g. org invitation).
 * `INotificationPayload` — contextual data for the notification type (org id,
 * invitation token, role, etc.).
 * `INotificationsResponse` — the paginated list response from
 * `GET /user/notifications`.
 */
export interface INotificationPayload {
	org_id?: string;
	org_name?: string;
	invitation_token?: string;
	role?: string;
}

export interface INotification {
	id: string;
	type: string;
	payload: INotificationPayload;
	read_at: string | null;
	created_at: string;
}

export interface INotificationsResponse {
	items: INotification[];
	unread_count: number;
}
