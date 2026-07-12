import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	fetchNotifications,
	fetchUnreadCount,
	markAllNotificationsRead,
	markNotificationRead,
} from "@/services/notification";
import { INotification } from "@/types/notification";

/**
 * Notification list + unread badge. `enabled` should track auth state so we
 * don't poll the endpoint for logged-out visitors. Unread count refetches on an
 * interval to keep the bell reasonably fresh.
 */
export function useNotifications(enabled: boolean) {
	const queryClient = useQueryClient();

	const list = useQuery<INotification[]>({
		queryKey: ["notifications"],
		queryFn: async () => (await fetchNotifications()).data,
		enabled,
	});

	const unread = useQuery<number>({
		queryKey: ["notifications", "unread"],
		queryFn: fetchUnreadCount,
		enabled,
		refetchInterval: 60_000,
	});

	function invalidate() {
		queryClient.invalidateQueries({ queryKey: ["notifications"] });
	}

	const markRead = useMutation({
		mutationFn: markNotificationRead,
		onSuccess: invalidate,
	});

	const markAllRead = useMutation({
		mutationFn: markAllNotificationsRead,
		onSuccess: invalidate,
	});

	return {
		notifications: list.data ?? [],
		isLoading: list.isLoading,
		unreadCount: unread.data ?? 0,
		markRead: markRead.mutate,
		markAllRead: markAllRead.mutate,
	};
}
