import Link from "next/link";
import { Button } from "./ui/button";
import { nav } from "@/constants/nav";

export default function Nav() {
  return (
    <nav className="flex gap-3">
      {nav.map((n, i) => (
        <Button key={i} variant={"ghost"} className="px-5 py-2.5" asChild>
          <Link href={`/${n.url}`} className="font-medium">
            {n.title}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
