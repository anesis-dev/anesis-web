import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkipToContent from "@/components/SkipToContent";

export default function AccountLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="w-full min-h-dvh flex flex-col">
			<SkipToContent />
			<Header />
			<main id="main-content" tabIndex={-1} className="flex-1">
				{children}
			</main>
			<Footer />
		</div>
	);
}
