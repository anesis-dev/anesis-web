"use client";

import { use } from "react";
import { StackDetail } from "@/components/stacks/StackDetail";

export default function StackDetailPage({
	params,
}: {
	params: Promise<{ stackRef: string }>;
}) {
	const { stackRef } = use(params);
	return <StackDetail stackRef={decodeURIComponent(stackRef)} />;
}
