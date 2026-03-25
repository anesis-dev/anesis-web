"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
	LayoutDashboardIcon,
	PackageIcon,
	UsersIcon,
	ArrowLeftIcon,
	ShieldIcon,
} from "lucide-react";

const navItems = [
	{
		title: "Dashboard",
		href: "/admin",
		icon: LayoutDashboardIcon,
		exact: true,
	},
	{
		title: "Templates",
		href: "/admin/templates",
		icon: PackageIcon,
		exact: false,
	},
	{
		title: "Users",
		href: "/admin/users",
		icon: UsersIcon,
		exact: false,
	},
];

export function AdminSidebar() {
	const pathname = usePathname();
	const { user } = useAuth();

	function isActive(href: string, exact: boolean) {
		return exact ? pathname === href : pathname.startsWith(href);
	}

	return (
		<aside className="flex h-dvh w-60 shrink-0 flex-col border-r bg-card">
			{/* Header */}
			<div className="flex items-center gap-2.5 border-b px-5 py-4">
				<div className="flex size-7 items-center justify-center rounded-md bg-primary">
					<ShieldIcon className="size-4 text-primary-foreground" />
				</div>
				<div className="flex flex-col">
					<span className="text-sm font-bold leading-none">Admin Panel</span>
					<span className="mt-0.5 text-[11px] text-muted-foreground">
						Oxide
					</span>
				</div>
			</div>

			{/* Nav */}
			<nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
				{navItems.map((item) => {
					const active = isActive(item.href, item.exact);
					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
								active
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:bg-accent hover:text-foreground",
							)}
						>
							<item.icon className="size-4 shrink-0" />
							{item.title}
						</Link>
					);
				})}
			</nav>

			{/* Footer */}
			<div className="flex flex-col gap-2 border-t p-3">
				<Link
					href="/"
					className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
				>
					<ArrowLeftIcon className="size-4 shrink-0" />
					Back to site
				</Link>

				{user && (
					<div className="flex items-center gap-2.5 rounded-md px-3 py-2">
						<div className="relative size-6 shrink-0 overflow-hidden rounded-full">
							<Image
								src={user.avatar_url}
								alt={user.login}
								fill
								className="object-cover grayscale"
							/>
						</div>
						<span className="truncate font-mono text-xs text-muted-foreground">
							@{user.login}
						</span>
					</div>
				)}
			</div>
		</aside>
	);
}
