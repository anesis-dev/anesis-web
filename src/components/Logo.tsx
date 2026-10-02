import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
	className?: string;
	variant?: "mark" | "full";
};

export default function Logo({ className, variant = "mark" }: LogoProps) {
	const isFullLogo = variant === "full";

	return (
		<Link
			href="/"
			aria-label="Anesis home"
			className={cn(
				"group flex shrink-0 items-center gap-2",
				className,
			)}
		>
			<Image
				src="/Logo.png"
				alt=""
				// Rendered size, not the file's 760x595: next/image builds the srcset
				// from these, so the real size made every page fetch a ~828px logo.
				width={isFullLogo ? 64 : 56}
				height={isFullLogo ? 50 : 44}
				className={cn(
					"object-contain drop-shadow-[0_0_18px_rgba(45,106,79,0.40)]",
					isFullLogo ? "h-14 w-16" : "h-10 w-14",
				)}
				priority={!isFullLogo}
			/>
			<span
				className={cn(
					"whitespace-nowrap font-semibold tracking-normal text-foreground",
					isFullLogo ? "text-2xl" : "text-xl",
				)}
			>
				Anesis
			</span>
		</Link>
	);
}
