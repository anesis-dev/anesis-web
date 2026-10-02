"use client";

import { useQueryClient } from "@tanstack/react-query";
import { AlertCircleIcon, LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/services/auth";

export default function AuthCallbackPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (params.get("signed_in") === "1") {
            queryClient.clear();
            router.replace("/");
            return;
        }

        if (params.get("account_added") === "1") {
            queryClient.invalidateQueries({ queryKey: ["sessions"] });
            router.replace("/");
            return;
        }

        if (
            params.get("account_already_active") === "1" ||
            params.get("account_already_added") === "1"
        ) {
            router.replace("/");
            return;
        }

        setError(
            "This sign-in link is invalid or has expired. Start the GitHub sign-in flow again.",
        );
    }, [queryClient, router]);

    if (error) {
        return (
            <div className="flex min-h-dvh w-full items-center justify-center px-4 py-10 sm:px-6">
                <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border bg-background px-6 py-8 text-center shadow-sm sm:px-8">
                    <AlertCircleIcon className="size-10 text-destructive" />
                    <div className="space-y-2">
                        <h1 className="text-xl font-semibold">
                            Unable to finish sign-in
                        </h1>
                        <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                            type="button"
                            onClick={() => {
                                window.location.href = getLoginUrl();
                            }}
                        >
                            Try again
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.replace("/")}
                        >
                            Go home
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-dvh w-full items-center justify-center px-4 py-10 sm:px-6">
            <div
                role="status"
                className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border bg-background px-6 py-8 text-center shadow-sm sm:px-8"
            >
                <LoaderIcon className="size-10 animate-spin text-muted-foreground" />
                <div className="space-y-2">
                    <h1 className="text-xl font-semibold">Finishing sign-in</h1>
                    <p className="text-sm text-muted-foreground">
                        Exchanging your GitHub callback code for a secure
                        session.
                    </p>
                </div>
            </div>
        </div>
    );
}
