"use client";

export default function Success() {
    return (
        <div className="flex min-h-dvh w-full items-center justify-center bg-[#020906] px-4 py-10 sm:px-6">
            <div className="flex w-full max-w-lg flex-col items-center justify-center gap-4 rounded-2xl bg-[#030E07] px-6 py-8 text-center animate-[fadeIn_.6s_ease-out,glow_1.2s_ease-out_.3s_forwards] sm:px-10 sm:py-10">
                <svg className="h-14 w-14 text-green-500" viewBox="0 0 52 52">
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
                        d="M15 27 L22 34 L37 18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-[draw_.5s_ease-out_.3s_forwards]"
                        style={{
                            strokeDasharray: 30,
                            strokeDashoffset: 30,
                        }}
                    />
                </svg>

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
