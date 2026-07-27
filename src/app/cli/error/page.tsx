"use client";

export default function CliError() {
    return (
        <div className="flex min-h-dvh w-full items-center justify-center bg-[#090202] px-4 py-10 sm:px-6">
            <div className="flex w-full max-w-lg flex-col items-center justify-center gap-4 rounded-2xl bg-[#0E0303] px-6 py-8 text-center animate-[fadeIn_.6s_ease-out,errorGlow_1.2s_ease-out_.3s_forwards] sm:px-10 sm:py-10">
                <svg className="h-14 w-14 text-red-500" viewBox="0 0 52 52">
                    <circle
                        cx="26"
                        cy="26"
                        r="25"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="opacity-30"
                    />

                    <path
                        d="M16 16 L36 36 M36 16 L16 36"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        className="animate-[draw_.5s_ease-out_.3s_forwards]"
                        style={{
                            strokeDasharray: 60,
                            strokeDashoffset: 60,
                        }}
                    />
                </svg>

                <h2 className="text-2xl font-semibold text-white">
                    Authorization failed
                </h2>

                <p className="text-sm text-neutral-400">
                    Something went wrong. Please return to the terminal and try
                    again.
                </p>
            </div>
        </div>
    );
}
