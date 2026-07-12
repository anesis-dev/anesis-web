import { api } from "@/api/client";
import { IPaginatedResponse } from "@/types/pagination";
import { INotification } from "@/types/notification";

export async function fetchNotifications(): Promise<
	IPaginatedResponse<INotification>
> {
	return api.get<IPaginatedResponse<INotification>>("/notification?page=1&page_size=20");
}

export async function fetchUnreadCount(): Promise<number> {
	const res = await api.get<{ count: number }>("/notification/unread-count");
	return res.count ?? 0;
}

export async function markNotificationRead(id: string): Promise<void> {
	await api.post<void>(`/notification/${encodeURIComponent(id)}/read`, {});
}

export async function markAllNotificationsRead(): Promise<void> {
	await api.post<void>("/notification/read-all", {});
}
