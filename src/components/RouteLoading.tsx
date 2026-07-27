import { Loader2Icon } from "lucide-react";

export default function RouteLoading({ label = "Loading…" }: { label?: string }) {
	return (
		<div
			role="status"
			aria-live="polite"
			className="flex min-h-[50dvh] w-full flex-1 flex-col items-center justify-center gap-3 px-5 py-24"
		>
			<Loader2Icon
				className="size-6 animate-spin text-primary"
				aria-hidden="true"
			/>
			<p className="text-sm text-muted-foreground">{label}</p>
		</div>
	);
}
