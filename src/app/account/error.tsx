"use client";

import { AppErrorState } from "@/components/AppErrorState";

export default function AccountError({
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<AppErrorState
			title="Account page error"
			description="The account section failed to render. Try the request again."
			reset={reset}
		/>
	);
}
