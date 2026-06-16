/**
 * Account section layout — Server Component.
 *
 * Wraps all `/account/*` pages with the site Header and Footer.
 * Individual account pages handle their own authentication guards.
 */
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
