"use client";

import { AppErrorState } from "@/components/AppErrorState";

export default function RootError({
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<AppErrorState
			title="Something went wrong"
			description="The application hit an unexpected error while rendering this page."
			reset={reset}
		/>
	);
}
