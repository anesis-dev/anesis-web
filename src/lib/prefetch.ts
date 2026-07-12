import {
	dehydrate,
	type DehydratedState,
	type FetchQueryOptions,
	QueryClient,
} from "@tanstack/react-query";

/**
 * Prefetches a query in a throwaway server-side QueryClient and returns the
 * dehydrated cache for a `<HydrationBoundary>`. `prefetchQuery` never throws,
 * so a failed server fetch simply yields no hydrated data and the client
 * refetches as usual.
 */
export async function dehydrateQuery(
	options: FetchQueryOptions,
): Promise<DehydratedState> {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(options);
	return dehydrate(queryClient);
}
