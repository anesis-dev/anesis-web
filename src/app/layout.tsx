import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "@/providers/ClientProvider";
import { ThemeProvider } from "@/providers/theme-provider";
import { site } from "@/config/site";

export const metadata: Metadata = {
	metadataBase: new URL(site.url),
	title: {
		default: site.title,
		template: "%s | Anesis",
	},
	description: site.description,
	applicationName: site.name,
	keywords: [
		"project scaffolding",
		"project templates",
		"boilerplate",
		"starter templates",
		"code generator",
		"CLI",
		"registry",
	],
	alternates: { canonical: "/" },
	openGraph: {
		type: "website",
		siteName: site.name,
		url: site.url,
		title: site.title,
		description: site.description,
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: site.title,
		description: site.description,
	},
	robots: {
		index: true,
		follow: true,
		googleBot: { index: true, follow: true, "max-image-preview": "large" },
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="antialiased">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<ClientProvider>{children}</ClientProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
