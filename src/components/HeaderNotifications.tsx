"use client";

import { useAuth } from "@/hooks/useAuth";
import { NotificationsBell } from "./NotificationsBell";

/** Renders the notifications bell only for signed-in users. */
export function HeaderNotifications() {
	const { user } = useAuth();
	if (!user) return null;
	return <NotificationsBell />;
}
