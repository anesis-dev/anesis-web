/**
 * Hook — fetches in-app notifications for the authenticated user and
 * provides mutation helpers to mark them as read.
 *
 * Endpoint: GET /notifications
 * Cache key: ["notifications"]
 *
 * The query is only enabled when the user is signed in and polls every
 * 30 seconds via `refetchInterval` to keep the unread badge current.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	fetchNotifications,
	markAllNotificationsRead,
	markNotificationRead,
} from "@/services/notification";
import { INotificationsResponse } from "@/types/notification";
import { useAuth } from "./useAuth";

export function useNotifications() {
	const { user } = useAuth();
	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery<INotificationsResponse>({
		queryKey: ["notifications"],
		queryFn: fetchNotifications,
		refetchInterval: 30_000,
		enabled: !!user,
	});

	const invalidate = () => queryClient.invalidateQueries({ queryKey: ["notifications"] });

	const markRead = useMutation({
		mutationFn: markNotificationRead,
		onSuccess: invalidate,
	});

	const markAllRead = useMutation({
		mutationFn: markAllNotificationsRead,
		onSuccess: invalidate,
	});

	return {
		items: data?.items ?? [],
		unreadCount: data?.unread_count ?? 0,
		isLoading,
		markRead: (id: string) => markRead.mutate(id),
		markAllRead: () => markAllRead.mutate(),
	};
}
