"use client";

export default function CliError() {
  return (
    <div className="w-full min-h-dvh flex justify-center items-center bg-[#0f0f0f]">
      <div
        className="max-w-lg h-60 bg-[#1a1a1a] px-10 rounded-xl flex flex-col justify-center items-center gap-4
        animate-[fadeIn_.6s_ease-out,errorGlow_1.2s_ease-out_.3s_forwards]"
      >
        <svg className="w-14 h-14 text-red-500" viewBox="0 0 52 52">
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

        <p className="text-sm text-neutral-400 text-center">
          Something went wrong. Please return to the terminal and try again.
        </p>
      </div>
    </div>
  );
}
