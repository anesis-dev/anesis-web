/**
 * Notification service — API calls for in-app notifications.
 *
 * `fetchNotifications` returns all notifications along with an unread count.
 * `markNotificationRead` marks a single notification as read by its ID.
 * `markAllNotificationsRead` marks all current notifications as read.
 */
import { api } from "@/api/client";
import { parseNotificationsResponse } from "@/lib/api-contracts";
import { INotificationsResponse } from "@/types/notification";

export async function fetchNotifications(): Promise<INotificationsResponse> {
	return parseNotificationsResponse(await api.get<unknown>("/notifications"));
}

export async function markNotificationRead(id: string): Promise<void> {
	await api.patch<void>(`/notifications/${encodeURIComponent(id)}/read`, {});
}

export async function markAllNotificationsRead(): Promise<void> {
	await api.post<void>("/notifications/read-all", {});
}
