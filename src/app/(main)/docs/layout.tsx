import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsTableOfContents } from "@/components/docs/DocsTableOfContents";
import SkipToContent from "@/components/SkipToContent";

export default function DocsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-col lg:min-h-dvh lg:flex-row">
			{/* The outer layout's skip link lands above the docs sidebar, which is
			    ~15 links. This one goes past it, straight to the article. */}
			<SkipToContent href="#docs-article" label="Skip to article" />
			<DocsSidebar />
			<div id="docs-article" className="min-w-0 flex-1" tabIndex={-1}>
				{children}
			</div>
			<DocsTableOfContents />
		</div>
	);
}
