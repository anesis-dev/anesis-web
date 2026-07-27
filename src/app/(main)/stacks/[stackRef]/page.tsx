import type { Metadata } from "next";
import { StackDetail } from "@/components/stacks/StackDetail";
import {
	registryMetadata,
	unresolvedMetadata,
} from "@/lib/registry-metadata";
import { fetchStack } from "@/services/stack";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ stackRef: string }>;
}): Promise<Metadata> {
	const { stackRef } = await params;
	const ref = decodeURIComponent(stackRef);

	try {
		const stack = await fetchStack(ref);
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
	return <StackDetail stackRef={decodeURIComponent(stackRef)} />;
}
