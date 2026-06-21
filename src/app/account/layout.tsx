import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AccountLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="w-full min-h-dvh flex flex-col">
			<Header />
			<div className="flex-1">{children}</div>
			<Footer />
		</div>
	);
}
