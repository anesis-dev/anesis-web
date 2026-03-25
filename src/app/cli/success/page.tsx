"use client";

export default function Success() {
	return (
		<div className="flex min-h-dvh w-full items-center justify-center bg-[#0f0f0f] px-4 py-10 sm:px-6">
			<div className="flex w-full max-w-lg flex-col items-center justify-center gap-4 rounded-2xl bg-[#1a1a1a] px-6 py-8 text-center animate-[fadeIn_.6s_ease-out,glow_1.2s_ease-out_.3s_forwards] sm:px-10 sm:py-10">
				<h2 className="text-2xl font-semibold text-white">
					Authorization successful
				</h2>

				<p className="text-sm text-neutral-400">
					You can close this window and return to the terminal.
				</p>
			</div>
		</div>
	);
}
