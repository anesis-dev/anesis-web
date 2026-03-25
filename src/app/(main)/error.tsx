"use client";

import { AppErrorState } from "@/components/AppErrorState";

export default function MainError({
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<AppErrorState
			title="Main site error"
			description="A page in the public site failed to load correctly."
			reset={reset}
		/>
	);
}
