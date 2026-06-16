/**
 * Test render helpers.
 *
 * Utilities for rendering components under a fresh `QueryClient` in Vitest
 * tests. Retry is disabled by default to prevent test timeouts.
 *
 * Exports:
 * - `createTestQueryClient()` — creates a `QueryClient` with retry disabled.
 * - `createQueryClientWrapper(queryClient)` — returns a JSX wrapper component.
 * - `renderWithQueryClient(ui, options)` — renders UI with a fresh client and
 *   returns both the render result and the `queryClient` instance.
 */
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderOptions } from "@testing-library/react";

export function createTestQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});
}

export function createQueryClientWrapper(queryClient: QueryClient) {
	return function QueryClientWrapper({
		children,
	}: {
		children: React.ReactNode;
	}) {
		return (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);
	};
}

export function renderWithQueryClient(
	ui: React.ReactElement,
	options?: Omit<RenderOptions, "wrapper">,
) {
	const queryClient = createTestQueryClient();

	return {
		queryClient,
		...render(ui, {
			wrapper: createQueryClientWrapper(queryClient),
			...options,
		}),
	};
}
