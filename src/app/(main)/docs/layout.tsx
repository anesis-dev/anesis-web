import { DocsSidebar } from "@/components/docs/DocsSidebar";

export default function DocsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex min-h-[calc(100dvh-8vh)] flex-col lg:flex-row">
			<DocsSidebar />
			<div className="min-w-0 flex-1">{children}</div>
		</div>
	);
}
