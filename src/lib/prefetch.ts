import {
	dehydrate,
	type DehydratedState,
	type FetchQueryOptions,
	QueryClient,
} from "@tanstack/react-query";


export async function dehydrateQuery(
	options: FetchQueryOptions,
): Promise<DehydratedState> {
	// retry:false - a failed prefetch during SSR/SSG won't succeed on retry (the
	// backend is down or misconfigured, not flaky), so retrying only adds wall
	// time to the render/build. The client re-fetches for real once hydrated.
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	await queryClient.prefetchQuery(options);
	return dehydrate(queryClient);
}
