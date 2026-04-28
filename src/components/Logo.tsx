import Image from "next/image";
import Link from "next/link";

export default function Logo() {
	return (
		<Link href="/" className="flex shrink-0 items-center gap-2">
			<Image
				src="/logo_white.png"
				alt="Anesis logo"
				width={32}
				height={32}
				className="size-7 object-contain sm:size-8"
				priority
			/>
			<h2 className="font-mono text-base font-extrabold sm:text-lg">Anesis</h2>
		</Link>
	);
}
