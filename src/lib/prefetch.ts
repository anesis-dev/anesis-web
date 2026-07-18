import {
	dehydrate,
	type DehydratedState,
	type FetchQueryOptions,
	QueryClient,
} from "@tanstack/react-query";


export async function dehydrateQuery(
	options: FetchQueryOptions,
): Promise<DehydratedState> {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(options);
	return dehydrate(queryClient);
}
