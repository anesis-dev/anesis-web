import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href={"/"} className="flex items-center gap-1">
      <div className="relative w-7.5 h-7.5">
        <Image src={"/logo_white.png"} alt="logo" fill />
      </div>
      <h2 className="font-mono font-extrabold">Oxide</h2>
    </Link>
  );
}
