"use client";

import { AppErrorState } from "@/components/AppErrorState";

export default function AdminError({
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<AppErrorState
			title="Admin panel error"
			description="The admin panel hit an unexpected rendering error."
			reset={reset}
		/>
	);
}
