"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
	const router = useRouter();

	useEffect(() => {
		const token = new URLSearchParams(window.location.search).get("token");
		if (token) {
			localStorage.setItem("token", token);
		}
		router.replace("/");
	}, [router]);

	return null;
}
