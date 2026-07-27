import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Addon registry",
	description:
		"The full Anesis addon registry: reusable, versioned project modifications published by the community.",
	alternates: { canonical: "/addons/registry" },
};

export default function AddonsRegistryRoute() {
	redirect("/addons");
}
