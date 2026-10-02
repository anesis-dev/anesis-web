import type { Metadata } from "next";
import { cache } from "react";
import { HydrationBoundary } from "@tanstack/react-query";
import { StackDetail } from "@/components/stacks/StackDetail";
import {
	registryMetadata,
	unresolvedMetadata,
} from "@/lib/registry-metadata";
import { safeDecodeURIComponent } from "@/lib/safe-decode-uri";
import { fetchStack } from "@/services/stack";
import { dehydrateQuery } from "@/lib/prefetch";

// cache(): generateMetadata and the page share one backend request (apiFetch
// sets an AbortSignal, which opts out of Next's built-in fetch dedupe).
const getStack = cache(fetchStack);

export async function generateMetadata({
	params,
}: {
	params: Promise<{ stackRef: string }>;
}): Promise<Metadata> {
	const { stackRef } = await params;

	try {
		const stack = await getStack(safeDecodeURIComponent(stackRef));
		return registryMetadata({
			title: `${stack.name} — Anesis stack`,
			description:
				stack.description ||
				`${stack.name} is an Anesis stack: a template plus a curated set of addons, installable with one command.`,
			canonicalPath: `/stacks/${encodeURIComponent(stack.stack_id)}`,
			keywords: [stack.stack_id, stack.name, "anesis stack", "project stack"],
		});
	} catch {
		return unresolvedMetadata("Stack");
	}
}

export default async function StackDetailPage({
	params,
}: {
	params: Promise<{ stackRef: string }>;
}) {
	const { stackRef } = await params;
	const ref = safeDecodeURIComponent(stackRef);
	// Same key as useStack, so the client renders from SSR data immediately.
	const state = await dehydrateQuery({
		queryKey: ["stack", ref],
		queryFn: () => getStack(ref),
	});
	return (
		<HydrationBoundary state={state}>
			<StackDetail stackRef={ref} />
		</HydrationBoundary>
	);
}
