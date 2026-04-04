import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "@/providers/ClientProvider";
import { ThemeProvider } from "@/providers/theme-provider";

export const metadata: Metadata = {
	title: {
		default: "Oxide",
		template: "%s | Oxide",
	},
	description:
		"Oxide is a template-first CLI and web registry for scaffolding projects, publishing starters, and browsing reusable setups.",
	icons: {
		icon: "/logo.png",
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
