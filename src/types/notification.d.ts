
export interface INotificationPayload {
	resource_type?: "template" | "addon" | "stack";
	resource_name?: string;
	name?: string;
	version?: string;
}

export interface INotification {
	id: string;
	type: string;
	payload: INotificationPayload;
	read_at: string | null;
	created_at: string;
}
