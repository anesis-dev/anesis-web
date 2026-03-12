"use client";

export default function Success() {
  return (
    <div className="w-full min-h-dvh flex justify-center items-center bg-[#0f0f0f]">
      <div
        className="max-w-lg h-60 bg-[#1a1a1a] px-10 rounded-xl flex flex-col justify-center items-center gap-4
    animate-[fadeIn_.6s_ease-out,glow_1.2s_ease-out_.3s_forwards]"
      >
        <h2 className="text-2xl font-semibold text-white">
          Authorization successful
        </h2>

        <p className="text-sm text-neutral-400 text-center">
          You can close this window and return to the terminal.
        </p>
      </div>
    </div>
  );
}
