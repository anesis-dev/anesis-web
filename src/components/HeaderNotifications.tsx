"use client";

import { useAuth } from "@/hooks/useAuth";
import { NotificationsBell } from "./NotificationsBell";


export function HeaderNotifications() {
	const { user } = useAuth();
	if (!user) return null;
	return <NotificationsBell />;
}
