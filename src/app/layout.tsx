/**
 * Root layout — Server Component.
 *
 * The outermost layout for the entire Next.js app. Wraps every page with:
 * - `ThemeProvider` (next-themes) — supports system/light/dark themes via
 *   the "class" attribute strategy.
 * - `ClientProvider` — sets up TanStack Query and the language context for
 *   all Client Components down the tree.
 *
 * Also declares the global <Metadata> that serves as the default title/
 * description when individual pages do not override it.
 */
import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "@/providers/ClientProvider";
import { ThemeProvider } from "@/providers/theme-provider";

export const metadata: Metadata = {
	title: {
		default: "Anesis",
		template: "%s | Anesis",
	},
	description:
		"Anesis is a template-first CLI and web registry for scaffolding projects, publishing starters, and browsing reusable setups.",
	icons: {
		icon: "/Logo.png",
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
