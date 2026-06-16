/**
 * Theme provider wrapper — Client Component.
 *
 * Thin wrapper around `next-themes`' `ThemeProvider`. Exists so that the
 * root layout can import a named export from a local file, keeping the
 * `next-themes` dependency behind a single abstraction point.
 * All props are forwarded unchanged.
 */
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
