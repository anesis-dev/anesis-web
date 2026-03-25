import { DocsSidebar } from "@/components/docs/DocsSidebar";

export default function DocsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-col lg:min-h-dvh lg:flex-row">
			<DocsSidebar />
			<div className="min-w-0 flex-1">{children}</div>
		</div>
	);
}
