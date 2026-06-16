/**
 * Notification bell button with dropdown — Client Component.
 *
 * Shows a red indicator dot when there are unread notifications. Opens a
 * dropdown panel listing all notifications.
 *
 * Currently supports the `org_invitation` notification type, which renders
 * Accept / Decline action buttons via the `OrgInvitationItem` sub-component.
 * Other notification types fall back to a plain text display.
 *
 * Accepting or declining an invitation invalidates both the notifications and
 * organizations queries so the sidebar and org pages reflect the change.
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BellIcon, CheckCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";
import { acceptInvitation, declineInvitation } from "@/services/organization";
import { INotification } from "@/types/notification";
import { cn } from "@/lib/utils";

function OrgInvitationItem({ notification, onAction }: { notification: INotification; onAction: () => void }) {
	const queryClient = useQueryClient();
	const { org_name, role, invitation_token } = notification.payload;

	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["notifications"] });
		queryClient.invalidateQueries({ queryKey: ["organizations"] });
		onAction();
	};

	const accept = useMutation({
		mutationFn: () => acceptInvitation(invitation_token!),
		onSuccess: invalidate,
	});

	const decline = useMutation({
		mutationFn: () => declineInvitation(invitation_token!),
		onSuccess: invalidate,
	});

	const isPending = accept.isPending || decline.isPending;

	return (
		<div className={cn("flex flex-col gap-2 rounded-lg p-3 transition-colors", notification.read_at ? "opacity-60" : "bg-white/5")}>
			<div className="flex items-start justify-between gap-2">
				<div className="min-w-0">
					<p className="text-sm font-medium leading-snug">
						Invitation to <span className="text-foreground font-semibold">{org_name}</span>
					</p>
					{role && (
						<p className="text-muted-foreground mt-0.5 text-xs capitalize">{role} role</p>
					)}
				</div>
				{!notification.read_at && (
					<span className="mt-1 size-2 shrink-0 rounded-full bg-blue-500" />
				)}
			</div>
			{!notification.read_at && invitation_token && (
				<div className="flex gap-2">
					<Button
						size="sm"
						className="h-7 flex-1 text-xs"
						disabled={isPending}
						onClick={() => accept.mutate()}
					>
						Accept
					</Button>
					<Button
						size="sm"
						variant="ghost"
						className="h-7 flex-1 text-xs"
						disabled={isPending}
						onClick={() => decline.mutate()}
					>
						Decline
					</Button>
				</div>
			)}
		</div>
	);
}

export function NotificationBell() {
	const { items, unreadCount, markAllRead } = useNotifications();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="relative rounded-full"
					aria-label="Notifications"
				>
					<BellIcon className="size-4" />
					{unreadCount > 0 && (
						<span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500 ring-2 ring-background" />
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-80 p-0" align="end">
				<div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
					<span className="text-sm font-semibold">Notifications</span>
					{unreadCount > 0 && (
						<Button
							variant="ghost"
							size="sm"
							className="text-muted-foreground hover:text-foreground -mr-1 h-7 gap-1.5 text-xs"
							onClick={markAllRead}
						>
							<CheckCheckIcon className="size-3.5" />
							Mark all read
						</Button>
					)}
				</div>

				<div className="max-h-[420px] overflow-y-auto">
					{items.length === 0 ? (
						<div className="text-muted-foreground flex flex-col items-center gap-2 py-10 text-sm">
							<BellIcon className="size-8 opacity-30" />
							<span>No notifications yet</span>
						</div>
					) : (
						<div className="flex flex-col gap-1 p-2">
							{items.map((notification) =>
								notification.type === "org_invitation" ? (
									<OrgInvitationItem
										key={notification.id}
										notification={notification}
										onAction={() => {}}
									/>
								) : (
									<div key={notification.id} className="rounded-lg p-3 text-sm">
										{notification.type}
									</div>
								),
							)}
						</div>
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
