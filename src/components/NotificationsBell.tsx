"use client";

import Link from "next/link";
import { BellIcon, CheckCheckIcon } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";
import { INotification } from "@/types/notification";
import { formatDate } from "@/lib/date";

function notificationHref(n: INotification): string {
	const { resource_type, resource_name, version } = n.payload;
	if (!resource_name) return "#";
	switch (resource_type) {
		case "template":
			return `/templates/${encodeURIComponent(resource_name)}`;
		case "stack":
			return `/stacks/${encodeURIComponent(resource_name)}`;
		case "addon":
			return version
				? `/addons/${encodeURIComponent(`${resource_name}@${version}`)}`
				: "/addons";
		default:
			return "#";
	}
}

function notificationText(n: INotification): string {
	const name = n.payload.name ?? n.payload.resource_name ?? "A resource";
	if (n.type === "resource_updated") {
		return n.payload.version
			? `${name} was updated to v${n.payload.version}`
			: `${name} was updated`;
	}
	return name;
}

export function NotificationsBell() {
	const { notifications, unreadCount, markRead, markAllRead } =
		useNotifications(true);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					aria-label="Notifications"
					className="relative inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
				>
					<BellIcon className="size-5" />
					{unreadCount > 0 && (
						<span className="absolute right-1.5 top-1.5 inline-flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-4 text-primary-foreground">
							{unreadCount > 9 ? "9+" : unreadCount}
						</span>
					)}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-80">
				<div className="flex items-center justify-between px-2 py-1.5">
					<DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
					{unreadCount > 0 && (
						<button
							type="button"
							onClick={() => markAllRead()}
							className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
						>
							<CheckCheckIcon className="size-3.5" />
							Mark all read
						</button>
					)}
				</div>
				<DropdownMenuSeparator />
				{notifications.length === 0 ? (
					<p className="px-3 py-6 text-center text-sm text-muted-foreground">
						You&rsquo;re all caught up.
					</p>
				) : (
					<div className="max-h-96 overflow-y-auto">
						{notifications.map((n) => (
							<DropdownMenuItem key={n.id} asChild>
								<Link
									href={notificationHref(n)}
									onClick={() => !n.read_at && markRead(n.id)}
									className="flex flex-col items-start gap-0.5"
								>
									<span className="flex w-full items-center gap-2 text-sm">
										{!n.read_at && (
											<span className="size-1.5 shrink-0 rounded-full bg-primary" />
										)}
										<span className="truncate">{notificationText(n)}</span>
									</span>
									<span className="pl-3.5 text-xs text-muted-foreground">
										{formatDate(n.created_at)}
									</span>
								</Link>
							</DropdownMenuItem>
						))}
					</div>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
