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
