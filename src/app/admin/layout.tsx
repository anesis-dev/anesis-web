import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminGuard } from "@/components/admin/AdminGuard";

export default function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AdminGuard>
			<div className="flex h-dvh w-full overflow-hidden">
				<AdminSidebar />
				<main className="flex-1 overflow-y-auto">
					{children}
				</main>
			</div>
		</AdminGuard>
	);
}
