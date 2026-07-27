import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminGuard } from "@/components/admin/AdminGuard";
import SkipToContent from "@/components/SkipToContent";

export default function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AdminGuard>
			<div className="flex min-h-dvh w-full flex-col lg:flex-row lg:items-stretch">
				<SkipToContent />
				<AdminSidebar />
				<main id="main-content" tabIndex={-1} className="min-w-0 flex-1">
					{children}
				</main>
			</div>
		</AdminGuard>
	);
}
